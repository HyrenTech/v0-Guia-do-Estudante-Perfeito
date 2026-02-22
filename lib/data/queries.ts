import { query } from "@/lib/data/db"

export type DateRangeInput = {
  from?: string | null
  to?: string | null
}

export type DateRange = {
  from: string
  to: string
}

type TimeSeriesMetric = "spend" | "sales" | "roas" | "cpa"

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function resolveDateRange(input: DateRangeInput, fallbackDays = 30): DateRange {
  const today = new Date()
  const to = input.to ? new Date(`${input.to}T00:00:00Z`) : new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const from = input.from
    ? new Date(`${input.from}T00:00:00Z`)
    : new Date(to.getTime() - (fallbackDays - 1) * 24 * 60 * 60 * 1000)

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new Error("Período inválido")
  }

  if (from > to) {
    throw new Error("Período inválido: from > to")
  }

  return {
    from: toDateKey(from),
    to: toDateKey(to),
  }
}

export async function getLastDataTimestamp() {
  const { rows } = await query<{
    last_meta: string | null
    last_hotmart: string | null
    last_daily: string | null
  }>(`
    SELECT
      (SELECT MAX(date_hour)::text FROM meta_insights_hourly) AS last_meta,
      (SELECT MAX(COALESCE(approved_at, order_created_at))::text FROM hotmart_orders) AS last_hotmart,
      (SELECT MAX(updated_at)::text FROM daily_facts) AS last_daily
  `)

  const row = rows[0]
  const candidates = [row?.last_meta, row?.last_hotmart, row?.last_daily].filter(Boolean)
  if (!candidates.length) return null

  return candidates.sort().at(-1) ?? null
}

export async function getKpis(range: DateRange) {
  const { rows } = await query<{
    spend_meta: string
    checkouts_meta: string
    purchases_meta: string
    sales_hotmart: string
    revenue_hotmart: string
    cpa_real: string | null
    roas_real: string | null
  }>(
    `
    SELECT
      COALESCE(SUM(spend_meta), 0)::text AS spend_meta,
      COALESCE(SUM(checkouts_meta), 0)::text AS checkouts_meta,
      COALESCE(SUM(purchases_meta), 0)::text AS purchases_meta,
      COALESCE(SUM(sales_hotmart), 0)::text AS sales_hotmart,
      COALESCE(SUM(revenue_hotmart), 0)::text AS revenue_hotmart,
      CASE WHEN COALESCE(SUM(sales_hotmart), 0) > 0
        THEN (COALESCE(SUM(spend_meta), 0) / SUM(sales_hotmart))::text
        ELSE NULL
      END AS cpa_real,
      CASE WHEN COALESCE(SUM(spend_meta), 0) > 0
        THEN (COALESCE(SUM(revenue_hotmart), 0) / SUM(spend_meta))::text
        ELSE NULL
      END AS roas_real
    FROM daily_facts
    WHERE date BETWEEN $1::date AND $2::date
  `,
    [range.from, range.to]
  )

  return rows[0]
}

export async function getTimeseries(range: DateRange, metric: TimeSeriesMetric) {
  const columnMap: Record<TimeSeriesMetric, string> = {
    spend: "spend_meta",
    sales: "sales_hotmart",
    roas: "roas_real",
    cpa: "cpa_real",
  }

  const column = columnMap[metric]

  const { rows } = await query<{ date: string; value: string | null }>(
    `
    SELECT
      date::text AS date,
      CASE
        WHEN $3::text IN ('roas', 'cpa')
          THEN AVG(${column})::text
        ELSE COALESCE(SUM(${column}), 0)::text
      END AS value
    FROM daily_facts
    WHERE date BETWEEN $1::date AND $2::date
    GROUP BY date
    ORDER BY date ASC
  `,
    [range.from, range.to, metric]
  )

  return rows
}

export async function getCampaignStats(range: DateRange, status: "active" | "paused" | "all") {
  const statusFilter =
    status === "all"
      ? ""
      : status === "active"
        ? "AND LOWER(c.status) = 'active'"
        : "AND LOWER(c.status) <> 'active'"

  const sql = `
    SELECT
      c.id,
      c.platform_campaign_id,
      c.name,
      c.status,
      COALESCE(SUM(m.spend), 0)::float8 AS spend,
      COALESCE(SUM(m.impressions), 0)::float8 AS impressions,
      COALESCE(SUM(m.clicks), 0)::float8 AS clicks,
      COALESCE(SUM(m.initiate_checkout), 0)::float8 AS checkouts,
      COALESCE(SUM(m.purchase_meta), 0)::float8 AS purchases_meta,
      CASE WHEN COALESCE(SUM(m.clicks), 0) > 0
        THEN (SUM(m.spend) / SUM(m.clicks))::float8
        ELSE 0
      END AS cpc,
      CASE WHEN COALESCE(SUM(m.impressions), 0) > 0
        THEN (SUM(m.clicks) * 100.0 / SUM(m.impressions))::float8
        ELSE 0
      END AS ctr
    FROM campaigns c
    LEFT JOIN meta_insights_hourly m ON m.campaign_id = c.id
      AND m.date_hour::date BETWEEN $1::date AND $2::date
    WHERE 1=1
      ${statusFilter}
    GROUP BY c.id
    ORDER BY spend DESC, c.id ASC
  `

  const { rows } = await query(sql, [range.from, range.to])
  return rows
}

export async function getAdStats(range: DateRange, campaignId?: string | null) {
  const params: unknown[] = [range.from, range.to]
  let campaignFilter = ""

  if (campaignId) {
    campaignFilter = "AND c.platform_campaign_id = $3"
    params.push(campaignId)
  }

  const sql = `
    SELECT
      a.id,
      a.platform_ad_id,
      a.name,
      a.status,
      c.name AS campaign_name,
      c.platform_campaign_id,
      COALESCE(SUM(m.spend), 0)::float8 AS spend,
      COALESCE(SUM(m.impressions), 0)::float8 AS impressions,
      COALESCE(SUM(m.clicks), 0)::float8 AS clicks,
      COALESCE(SUM(m.initiate_checkout), 0)::float8 AS checkouts,
      COALESCE(SUM(m.purchase_meta), 0)::float8 AS purchases_meta,
      CASE WHEN COALESCE(SUM(m.initiate_checkout), 0) > 0
        THEN (SUM(m.spend) / SUM(m.initiate_checkout))::float8
        ELSE 0
      END AS cost_per_checkout,
      CASE WHEN COALESCE(SUM(m.impressions), 0) > 0
        THEN (SUM(m.clicks) * 100.0 / SUM(m.impressions))::float8
        ELSE 0
      END AS ctr,
      CASE WHEN COALESCE(SUM(m.impressions), 0) > 0
        THEN (SUM(m.spend) * 1000.0 / SUM(m.impressions))::float8
        ELSE 0
      END AS cpm
    FROM ads a
    INNER JOIN ad_sets s ON s.id = a.ad_set_id
    INNER JOIN campaigns c ON c.id = s.campaign_id
    LEFT JOIN meta_insights_hourly m ON m.ad_id = a.id
      AND m.date_hour::date BETWEEN $1::date AND $2::date
    WHERE 1=1
      ${campaignFilter}
    GROUP BY a.id, c.name, c.platform_campaign_id
    ORDER BY cost_per_checkout ASC NULLS LAST, spend DESC
  `

  const { rows } = await query(sql, params)
  return rows
}

export async function getAlerts(status: "open" | "closed" | "all") {
  const params: unknown[] = []
  let where = ""

  if (status !== "all") {
    where = "WHERE status = $1"
    params.push(status)
  }

  const { rows } = await query(
    `
      SELECT
        id,
        type,
        severity,
        title,
        description,
        entity_type,
        entity_id,
        status,
        first_seen_at,
        last_seen_at,
        resolved_at
      FROM alerts
      ${where}
      ORDER BY
        CASE severity
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          ELSE 4
        END,
        last_seen_at DESC
    `,
    params
  )

  return rows
}

export async function getSyncStatus() {
  const lastBySource = await query<{
    source: string
    status: string
    finished_at: string | null
    records_upserted: number
    error_message: string | null
  }>(`
    SELECT DISTINCT ON (source)
      source,
      status,
      finished_at::text,
      records_upserted,
      error_message
    FROM sync_runs
    ORDER BY source, started_at DESC
  `)

  const recentRuns = await query<{
    id: number
    source: string
    status: string
    started_at: string
    finished_at: string | null
    records_upserted: number
    error_message: string | null
  }>(`
    SELECT
      id,
      source,
      status,
      started_at::text,
      finished_at::text,
      records_upserted,
      error_message
    FROM sync_runs
    ORDER BY started_at DESC
    LIMIT 20
  `)

  return {
    bySource: lastBySource.rows,
    recentRuns: recentRuns.rows,
  }
}

export async function getDashboardSnapshot(range: DateRange) {
  const [kpis, campaigns, alerts] = await Promise.all([
    getKpis(range),
    getCampaignStats(range, "all"),
    getAlerts("open"),
  ])

  return {
    kpis,
    topCampaigns: campaigns.slice(0, 5),
    openAlerts: alerts.slice(0, 5),
  }
}
