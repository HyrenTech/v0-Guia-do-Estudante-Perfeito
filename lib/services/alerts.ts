import { getEnv } from "@/lib/config/env"
import { query } from "@/lib/data/db"
import { getOpenAlertsByType, resolveAlert, startSyncRun, finishSyncRun, upsertAlert } from "@/lib/data/repository"

type AlertKey = {
  entityType?: string | null
  entityId?: string | null
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
}

function keyOf(type: string, entityType?: string | null, entityId?: string | null) {
  return `${type}::${entityType ?? ""}::${entityId ?? ""}`
}

async function syncAlertType(type: string, items: AlertKey[]) {
  const openAlerts = await getOpenAlertsByType(type)
  const target = new Set(items.map((item) => keyOf(type, item.entityType, item.entityId)))

  for (const item of items) {
    await upsertAlert({
      type,
      severity: item.severity,
      title: item.title,
      description: item.description,
      entityType: item.entityType,
      entityId: item.entityId,
    })
  }

  for (const alert of openAlerts) {
    const openKey = keyOf(type, alert.entity_type, alert.entity_id)

    if (!target.has(openKey)) {
      await resolveAlert(type, alert.entity_type, alert.entity_id)
    }
  }

  return items.length
}

async function checkHotmartSalesDrop() {
  const { rows } = await query<{ date: string; sales: number }>(`
    SELECT
      date::text,
      sales_hotmart::int AS sales
    FROM daily_facts
    ORDER BY date DESC
    LIMIT 4
  `)

  if (rows.length < 4) {
    return syncAlertType("hotmart_sales_drop", [])
  }

  const today = rows[0]
  const prev = rows.slice(1)
  const avg = prev.reduce((acc, item) => acc + item.sales, 0) / prev.length

  if (avg <= 0) {
    return syncAlertType("hotmart_sales_drop", [])
  }

  if (today.sales <= avg * 0.65) {
    return syncAlertType("hotmart_sales_drop", [
      {
        severity: "high",
        title: "Queda de vendas Hotmart",
        description: `Vendas de hoje (${today.sales}) estão >35% abaixo da média móvel de 3 dias (${avg.toFixed(2)}).`,
      },
    ])
  }

  return syncAlertType("hotmart_sales_drop", [])
}

async function checkCpaIncrease() {
  const { rows } = await query<{ date: string; cpa: number | null }>(`
    SELECT
      date::text,
      cpa_real::float8 AS cpa
    FROM daily_facts
    WHERE cpa_real IS NOT NULL
    ORDER BY date DESC
    LIMIT 8
  `)

  if (rows.length < 4 || rows[0].cpa === null) {
    return syncAlertType("cpa_increase", [])
  }

  const today = rows[0].cpa
  const prev = rows.slice(1).map((item) => item.cpa).filter((value): value is number => value !== null)

  if (!prev.length || today === null) {
    return syncAlertType("cpa_increase", [])
  }

  const avg = prev.reduce((acc, value) => acc + value, 0) / prev.length

  if (avg > 0 && today > avg * 1.25) {
    return syncAlertType("cpa_increase", [
      {
        severity: "high",
        title: "Aumento de CPA real",
        description: `CPA de hoje (${today.toFixed(2)}) está mais de 25% acima da média móvel de 7 dias (${avg.toFixed(2)}).`,
      },
    ])
  }

  return syncAlertType("cpa_increase", [])
}

async function checkCtrDropActiveCampaigns() {
  const { rows } = await query<{
    campaign_id: string
    campaign_name: string
    current_ctr: number
    baseline_ctr: number
    impressions: number
  }>(`
    WITH current_window AS (
      SELECT
        c.platform_campaign_id AS campaign_id,
        c.name AS campaign_name,
        COALESCE(SUM(m.clicks)::float8 * 100 / NULLIF(SUM(m.impressions)::float8, 0), 0) AS current_ctr,
        COALESCE(SUM(m.impressions), 0)::float8 AS impressions
      FROM campaigns c
      INNER JOIN meta_insights_hourly m ON m.campaign_id = c.id
      WHERE LOWER(c.status) = 'active'
        AND m.date_hour >= NOW() - INTERVAL '24 hours'
      GROUP BY c.platform_campaign_id, c.name
    ),
    baseline AS (
      SELECT
        c.platform_campaign_id AS campaign_id,
        COALESCE(SUM(m.clicks)::float8 * 100 / NULLIF(SUM(m.impressions)::float8, 0), 0) AS baseline_ctr
      FROM campaigns c
      INNER JOIN meta_insights_hourly m ON m.campaign_id = c.id
      WHERE LOWER(c.status) = 'active'
        AND m.date_hour >= NOW() - INTERVAL '8 days'
        AND m.date_hour < NOW() - INTERVAL '24 hours'
      GROUP BY c.platform_campaign_id
    )
    SELECT
      cw.campaign_id,
      cw.campaign_name,
      cw.current_ctr,
      b.baseline_ctr,
      cw.impressions
    FROM current_window cw
    INNER JOIN baseline b USING (campaign_id)
    WHERE b.baseline_ctr > 0
  `)

  const violations = rows
    .filter((row) => row.impressions >= 500 && row.current_ctr < row.baseline_ctr * 0.8)
    .map<AlertKey>((row) => ({
      severity: "medium",
      title: "Queda de CTR em campanha ativa",
      description: `${row.campaign_name}: CTR atual (${row.current_ctr.toFixed(2)}%) caiu mais de 20% vs baseline (${row.baseline_ctr.toFixed(2)}%).`,
      entityType: "campaign",
      entityId: row.campaign_id,
    }))

  return syncAlertType("ctr_drop_active_campaign", violations)
}

async function checkHighSpendNoCheckout() {
  const env = getEnv()

  const { rows } = await query<{
    campaign_id: string
    campaign_name: string
    spend_6h: number
    checkouts_6h: number
  }>(
    `
    SELECT
      c.platform_campaign_id AS campaign_id,
      c.name AS campaign_name,
      COALESCE(SUM(m.spend), 0)::float8 AS spend_6h,
      COALESCE(SUM(m.initiate_checkout), 0)::float8 AS checkouts_6h
    FROM campaigns c
    INNER JOIN meta_insights_hourly m ON m.campaign_id = c.id
    WHERE LOWER(c.status) = 'active'
      AND m.date_hour >= NOW() - INTERVAL '6 hours'
    GROUP BY c.platform_campaign_id, c.name
  `
  )

  const violations = rows
    .filter((row) => row.spend_6h >= env.ALERT_HIGH_SPEND_THRESHOLD && row.checkouts_6h === 0)
    .map<AlertKey>((row) => ({
      severity: "critical",
      title: "Gasto alto sem checkout (6h)",
      description: `${row.campaign_name} gastou ${row.spend_6h.toFixed(2)} sem iniciar checkout nas últimas 6h.`,
      entityType: "campaign",
      entityId: row.campaign_id,
    }))

  return syncAlertType("high_spend_no_checkout", violations)
}

export async function runAlertEngine() {
  const syncId = await startSyncRun("alerts")

  try {
    const counts = await Promise.all([
      checkHotmartSalesDrop(),
      checkCpaIncrease(),
      checkCtrDropActiveCampaigns(),
      checkHighSpendNoCheckout(),
    ])

    const total = counts.reduce((acc, value) => acc + value, 0)
    await finishSyncRun(syncId, "success", total)
    return total
  } catch (error) {
    await finishSyncRun(syncId, "error", 0, error instanceof Error ? error.message : String(error))
    throw error
  }
}
