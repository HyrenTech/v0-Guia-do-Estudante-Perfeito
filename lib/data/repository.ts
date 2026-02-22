import type { PoolClient } from "pg"

import { getEnv } from "@/lib/config/env"
import { query, withTransaction } from "@/lib/data/db"

export type SyncSource = "meta" | "hotmart" | "daily_facts" | "alerts" | "hourly_sync"

type SqlExecutor = {
  query: PoolClient["query"]
}

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return 0
  if (typeof value === "number") return value
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const toDateKey = (date: Date) => date.toISOString().slice(0, 10)

function eachDate(from: string, to: string) {
  const list: string[] = []
  const start = new Date(`${from}T00:00:00.000Z`)
  const end = new Date(`${to}T00:00:00.000Z`)

  for (let cursor = start; cursor <= end; cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)) {
    list.push(toDateKey(cursor))
  }

  return list
}

export async function startSyncRun(source: SyncSource) {
  const { rows } = await query<{ id: number }>(
    `
      INSERT INTO sync_runs (source, status, started_at)
      VALUES ($1, 'running', NOW())
      RETURNING id
    `,
    [source]
  )

  return rows[0].id
}

export async function finishSyncRun(
  id: number,
  status: "success" | "error",
  recordsUpserted: number,
  errorMessage?: string
) {
  await query(
    `
      UPDATE sync_runs
      SET
        status = $2,
        records_upserted = $3,
        error_message = $4,
        finished_at = NOW()
      WHERE id = $1
    `,
    [id, status, recordsUpserted, errorMessage ?? null]
  )
}

export async function upsertPlatformAccount(input: {
  platform: string
  platformAccountId: string
  name: string
  currency: string
  timezone: string
}) {
  const { rows } = await query<{ id: number }>(
    `
      INSERT INTO platform_accounts (platform, platform_account_id, name, currency, timezone)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (platform, platform_account_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        currency = EXCLUDED.currency,
        timezone = EXCLUDED.timezone
      RETURNING id
    `,
    [input.platform, input.platformAccountId, input.name, input.currency, input.timezone]
  )

  return rows[0].id
}

export async function getPrimaryAccountId() {
  const { rows } = await query<{ id: number }>(
    `
      SELECT id
      FROM platform_accounts
      WHERE platform = 'meta'
      ORDER BY created_at ASC
      LIMIT 1
    `
  )

  return rows[0]?.id ?? null
}

export async function upsertCampaign(
  db: SqlExecutor,
  input: {
    platformCampaignId: string
    accountId: number
    name: string
    status: string
    objective?: string | null
  }
) {
  const { rows } = await db.query<{ id: number }>(
    `
      INSERT INTO campaigns (platform_campaign_id, account_id, name, status, objective, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (platform_campaign_id)
      DO UPDATE SET
        account_id = EXCLUDED.account_id,
        name = EXCLUDED.name,
        status = EXCLUDED.status,
        objective = EXCLUDED.objective,
        updated_at = NOW()
      RETURNING id
    `,
    [input.platformCampaignId, input.accountId, input.name, input.status, input.objective ?? null]
  )

  return rows[0].id
}

export async function upsertAdSet(
  db: SqlExecutor,
  input: {
    platformAdSetId: string
    campaignId: number
    name: string
    status: string
    dailyBudget?: number | null
  }
) {
  const { rows } = await db.query<{ id: number }>(
    `
      INSERT INTO ad_sets (platform_ad_set_id, campaign_id, name, status, daily_budget, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (platform_ad_set_id)
      DO UPDATE SET
        campaign_id = EXCLUDED.campaign_id,
        name = EXCLUDED.name,
        status = EXCLUDED.status,
        daily_budget = EXCLUDED.daily_budget,
        updated_at = NOW()
      RETURNING id
    `,
    [input.platformAdSetId, input.campaignId, input.name, input.status, input.dailyBudget ?? null]
  )

  return rows[0].id
}

export async function upsertAd(
  db: SqlExecutor,
  input: {
    platformAdId: string
    adSetId: number
    name: string
    status: string
    creativeType?: string | null
  }
) {
  const { rows } = await db.query<{ id: number }>(
    `
      INSERT INTO ads (platform_ad_id, ad_set_id, name, status, creative_type, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (platform_ad_id)
      DO UPDATE SET
        ad_set_id = EXCLUDED.ad_set_id,
        name = EXCLUDED.name,
        status = EXCLUDED.status,
        creative_type = EXCLUDED.creative_type,
        updated_at = NOW()
      RETURNING id
    `,
    [input.platformAdId, input.adSetId, input.name, input.status, input.creativeType ?? null]
  )

  return rows[0].id
}

export async function upsertMetaInsight(
  db: SqlExecutor,
  input: {
    accountId: number
    campaignId?: number | null
    adSetId?: number | null
    adId: number
    dateHour: string
    spend: number
    impressions: number
    clicks: number
    cpm: number
    cpc: number
    ctr: number
    initiateCheckout: number
    purchaseMeta: number
  }
) {
  await db.query(
    `
      INSERT INTO meta_insights_hourly (
        account_id,
        campaign_id,
        ad_set_id,
        ad_id,
        date_hour,
        spend,
        impressions,
        clicks,
        cpm,
        cpc,
        ctr,
        initiate_checkout,
        purchase_meta,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (ad_id, date_hour)
      DO UPDATE SET
        account_id = EXCLUDED.account_id,
        campaign_id = EXCLUDED.campaign_id,
        ad_set_id = EXCLUDED.ad_set_id,
        spend = EXCLUDED.spend,
        impressions = EXCLUDED.impressions,
        clicks = EXCLUDED.clicks,
        cpm = EXCLUDED.cpm,
        cpc = EXCLUDED.cpc,
        ctr = EXCLUDED.ctr,
        initiate_checkout = EXCLUDED.initiate_checkout,
        purchase_meta = EXCLUDED.purchase_meta,
        updated_at = NOW()
    `,
    [
      input.accountId,
      input.campaignId ?? null,
      input.adSetId ?? null,
      input.adId,
      input.dateHour,
      input.spend,
      input.impressions,
      input.clicks,
      input.cpm,
      input.cpc,
      input.ctr,
      input.initiateCheckout,
      input.purchaseMeta,
    ]
  )
}

export async function upsertHotmartOrder(input: {
  hotmartOrderId: string
  eventType: string
  status: string
  orderCreatedAt?: string | null
  approvedAt?: string | null
  currency?: string | null
  grossValue?: number
  netValue?: number
  productName?: string | null
  offerCode?: string | null
  buyerHash?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
  rawPayload: unknown
}) {
  await query(
    `
      INSERT INTO hotmart_orders (
        hotmart_order_id,
        event_type,
        status,
        order_created_at,
        approved_at,
        currency,
        gross_value,
        net_value,
        product_name,
        offer_code,
        buyer_hash,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        raw_payload,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16::jsonb, NOW()
      )
      ON CONFLICT (hotmart_order_id, event_type)
      DO UPDATE SET
        status = EXCLUDED.status,
        order_created_at = EXCLUDED.order_created_at,
        approved_at = EXCLUDED.approved_at,
        currency = EXCLUDED.currency,
        gross_value = EXCLUDED.gross_value,
        net_value = EXCLUDED.net_value,
        product_name = EXCLUDED.product_name,
        offer_code = EXCLUDED.offer_code,
        buyer_hash = EXCLUDED.buyer_hash,
        utm_source = EXCLUDED.utm_source,
        utm_medium = EXCLUDED.utm_medium,
        utm_campaign = EXCLUDED.utm_campaign,
        utm_content = EXCLUDED.utm_content,
        raw_payload = EXCLUDED.raw_payload,
        updated_at = NOW()
    `,
    [
      input.hotmartOrderId,
      input.eventType,
      input.status,
      input.orderCreatedAt ?? null,
      input.approvedAt ?? null,
      input.currency ?? null,
      toNumber(input.grossValue),
      toNumber(input.netValue),
      input.productName ?? null,
      input.offerCode ?? null,
      input.buyerHash ?? null,
      input.utmSource ?? null,
      input.utmMedium ?? null,
      input.utmCampaign ?? null,
      input.utmContent ?? null,
      JSON.stringify(input.rawPayload),
    ]
  )
}

export async function recomputeDailyFacts(range: { from: string; to: string }, accountId?: number | null) {
  const env = getEnv()
  const targetAccountId = accountId ?? (await getPrimaryAccountId())

  if (!targetAccountId) {
    return 0
  }

  const [metaRows, hotmartRows] = await Promise.all([
    query<{
      date: string
      spend_meta: string
      checkouts_meta: string
      purchases_meta: string
    }>(
      `
      SELECT
        (date_hour AT TIME ZONE $3)::date::text AS date,
        COALESCE(SUM(spend), 0)::text AS spend_meta,
        COALESCE(SUM(initiate_checkout), 0)::text AS checkouts_meta,
        COALESCE(SUM(purchase_meta), 0)::text AS purchases_meta
      FROM meta_insights_hourly
      WHERE account_id = $1
        AND (date_hour AT TIME ZONE $3)::date BETWEEN $2::date AND $4::date
      GROUP BY 1
    `,
      [targetAccountId, range.from, env.APP_TIMEZONE, range.to]
    ),
    query<{
      date: string
      sales_hotmart: string
      revenue_hotmart: string
    }>(
      `
      SELECT
        (COALESCE(approved_at, order_created_at) AT TIME ZONE $3)::date::text AS date,
        COUNT(*) FILTER (WHERE LOWER(status) = 'approved')::text AS sales_hotmart,
        COALESCE(SUM(CASE WHEN LOWER(status) = 'approved' THEN net_value ELSE 0 END), 0)::text AS revenue_hotmart
      FROM hotmart_orders
      WHERE (COALESCE(approved_at, order_created_at) AT TIME ZONE $3)::date BETWEEN $1::date AND $2::date
      GROUP BY 1
    `,
      [range.from, range.to, env.APP_TIMEZONE]
    ),
  ])

  const metaMap = new Map<
    string,
    { date: string; spend_meta: string; checkouts_meta: string; purchases_meta: string }
  >(metaRows.rows.map((row) => [row.date, row] as const))
  const hotmartMap = new Map<string, { date: string; sales_hotmart: string; revenue_hotmart: string }>(
    hotmartRows.rows.map((row) => [row.date, row] as const)
  )
  const dates = eachDate(range.from, range.to)

  await withTransaction(async (client) => {
    for (const date of dates) {
      const meta = metaMap.get(date)
      const hotmart = hotmartMap.get(date)
      const spendMeta = toNumber(meta?.spend_meta)
      const checkoutsMeta = toNumber(meta?.checkouts_meta)
      const purchasesMeta = toNumber(meta?.purchases_meta)
      const salesHotmart = toNumber(hotmart?.sales_hotmart)
      const revenueHotmart = toNumber(hotmart?.revenue_hotmart)

      const cpaReal = salesHotmart > 0 ? spendMeta / salesHotmart : null
      const roasReal = spendMeta > 0 ? revenueHotmart / spendMeta : null

      await client.query(
        `
          INSERT INTO daily_facts (
            date,
            account_id,
            spend_meta,
            checkouts_meta,
            purchases_meta,
            sales_hotmart,
            revenue_hotmart,
            cpa_real,
            roas_real,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
          ON CONFLICT (date, account_id)
          DO UPDATE SET
            spend_meta = EXCLUDED.spend_meta,
            checkouts_meta = EXCLUDED.checkouts_meta,
            purchases_meta = EXCLUDED.purchases_meta,
            sales_hotmart = EXCLUDED.sales_hotmart,
            revenue_hotmart = EXCLUDED.revenue_hotmart,
            cpa_real = EXCLUDED.cpa_real,
            roas_real = EXCLUDED.roas_real,
            updated_at = NOW()
        `,
        [
          date,
          targetAccountId,
          spendMeta,
          checkoutsMeta,
          purchasesMeta,
          salesHotmart,
          revenueHotmart,
          cpaReal,
          roasReal,
        ]
      )
    }
  })

  return dates.length
}

export async function upsertAlert(input: {
  type: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  entityType?: string | null
  entityId?: string | null
}) {
  const { rows } = await query<{ id: number }>(
    `
      INSERT INTO alerts (
        type,
        severity,
        title,
        description,
        entity_type,
        entity_id,
        status,
        first_seen_at,
        last_seen_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'open', NOW(), NOW(), NOW())
      ON CONFLICT (type, entity_type, entity_id, status)
      DO UPDATE SET
        severity = EXCLUDED.severity,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        last_seen_at = NOW(),
        updated_at = NOW()
      RETURNING id
    `,
    [
      input.type,
      input.severity,
      input.title,
      input.description,
      input.entityType ?? "",
      input.entityId ?? "",
    ]
  )

  return rows[0].id
}

export async function resolveAlert(type: string, entityType?: string | null, entityId?: string | null) {
  await query(
    `
      UPDATE alerts
      SET status = 'closed', resolved_at = NOW(), updated_at = NOW()
      WHERE type = $1
        AND entity_type = $2
        AND entity_id = $3
        AND status = 'open'
    `,
    [type, entityType ?? "", entityId ?? ""]
  )
}

export async function getOpenAlertsByType(type: string) {
  const { rows } = await query<{
    id: number
    entity_type: string
    entity_id: string
  }>(
    `
      SELECT id, entity_type, entity_id
      FROM alerts
      WHERE type = $1
        AND status = 'open'
    `,
    [type]
  )

  return rows
}
