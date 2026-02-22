import { getEnv, requireEnv } from "@/lib/config/env"
import { query, withTransaction } from "@/lib/data/db"
import {
  finishSyncRun,
  recomputeDailyFacts,
  startSyncRun,
  upsertAd,
  upsertAdSet,
  upsertCampaign,
  upsertHotmartOrder,
  upsertMetaInsight,
  upsertPlatformAccount,
  type SyncSource,
} from "@/lib/data/repository"
import { fetchHotmartOrders, type NormalizedHotmartEvent } from "@/lib/integrations/hotmart/client"
import { fetchMetaAdSets, fetchMetaAds, fetchMetaCampaigns, fetchMetaInsights } from "@/lib/integrations/meta/client"
import { runAlertEngine } from "@/lib/services/alerts"

type SyncWindow = {
  from: string
  to: string
}

const dayMs = 24 * 60 * 60 * 1000

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function getWindow(daysBack = 2): SyncWindow {
  const today = new Date()
  const to = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const from = new Date(to.getTime() - daysBack * dayMs)

  return {
    from: toDateKey(from),
    to: toDateKey(to),
  }
}

async function runWithSyncAudit<T>(source: SyncSource, work: () => Promise<T>) {
  const syncId = await startSyncRun(source)

  try {
    const result = await work()
    const count = typeof result === "number" ? result : 0
    await finishSyncRun(syncId, "success", count)
    return result
  } catch (error) {
    await finishSyncRun(syncId, "error", 0, error instanceof Error ? error.message : String(error))
    throw error
  }
}

export async function syncMeta(window: SyncWindow = getWindow(2)) {
  requireEnv(["META_ACCESS_TOKEN", "META_AD_ACCOUNT_ID"])
  const env = getEnv()

  return runWithSyncAudit("meta", async () => {
    const accountId = await upsertPlatformAccount({
      platform: "meta",
      platformAccountId: env.META_AD_ACCOUNT_ID!,
      name: env.META_ACCOUNT_NAME,
      currency: env.META_CURRENCY,
      timezone: env.APP_TIMEZONE,
    })

    const [campaigns, adSets, ads] = await Promise.all([
      fetchMetaCampaigns(),
      fetchMetaAdSets(),
      fetchMetaAds(),
    ])

    const campaignIdByPlatformId = new Map<string, number>()
    const adSetIdByPlatformId = new Map<string, number>()
    const adIdByPlatformId = new Map<string, number>()

    await withTransaction(async (client) => {
      for (const campaign of campaigns) {
        const campaignId = await upsertCampaign(
          { query: client.query.bind(client) },
          {
            platformCampaignId: campaign.id,
            accountId,
            name: campaign.name,
            status: campaign.status,
            objective: campaign.objective,
          }
        )
        campaignIdByPlatformId.set(campaign.id, campaignId)
      }

      for (const adSet of adSets) {
        const campaignId = campaignIdByPlatformId.get(adSet.campaign_id)
        if (!campaignId) continue

        const adSetId = await upsertAdSet(
          { query: client.query.bind(client) },
          {
            platformAdSetId: adSet.id,
            campaignId,
            name: adSet.name,
            status: adSet.status,
            dailyBudget: Number(adSet.daily_budget ?? 0),
          }
        )

        adSetIdByPlatformId.set(adSet.id, adSetId)
      }

      for (const ad of ads) {
        const adSetId = adSetIdByPlatformId.get(ad.adset_id)
        if (!adSetId) continue

        const adId = await upsertAd(
          { query: client.query.bind(client) },
          {
            platformAdId: ad.id,
            adSetId,
            name: ad.name,
            status: ad.status,
            creativeType: ad.creative?.object_type ?? null,
          }
        )

        adIdByPlatformId.set(ad.id, adId)
      }
    })

    const insights = await fetchMetaInsights(window)
    let upserts = 0

    await withTransaction(async (client) => {
      for (const item of insights) {
        if (!item.adId) continue

        const adId = adIdByPlatformId.get(item.adId)
        if (!adId) continue

        const campaignId = item.campaignId ? campaignIdByPlatformId.get(item.campaignId) : null
        const adSetId = item.adSetId ? adSetIdByPlatformId.get(item.adSetId) : null

        await upsertMetaInsight(
          { query: client.query.bind(client) },
          {
            accountId,
            campaignId,
            adSetId,
            adId,
            dateHour: item.dateHour,
            spend: item.spend,
            impressions: item.impressions,
            clicks: item.clicks,
            cpm: item.cpm,
            cpc: item.cpc,
            ctr: item.ctr,
            initiateCheckout: item.initiateCheckout,
            purchaseMeta: item.purchaseMeta,
          }
        )

        upserts += 1
      }
    })

    return upserts
  })
}

async function persistHotmartEvents(events: NormalizedHotmartEvent[]) {
  let upserts = 0

  for (const event of events) {
    await upsertHotmartOrder(event)
    upserts += 1
  }

  return upserts
}

export async function syncHotmart(window: SyncWindow = getWindow(2)) {
  return runWithSyncAudit("hotmart", async () => {
    const events = await fetchHotmartOrders(window)
    return persistHotmartEvents(events)
  })
}

export async function recomputeFacts(window: SyncWindow = getWindow(2)) {
  return runWithSyncAudit("daily_facts", async () => {
    return recomputeDailyFacts(window)
  })
}

export async function runHourlySync(window: SyncWindow = getWindow(2)) {
  return runWithSyncAudit("hourly_sync", async () => {
    const metaCount = await syncMeta(window)
    let hotmartCount = 0

    try {
      hotmartCount = await syncHotmart(window)
    } catch (error) {
      console.error("[sync] Hotmart sync skipped due to API error", error)
    }

    const dailyFactsCount = await recomputeFacts(window)
    const alertsCount = await runAlertEngine()

    return Number(metaCount) + Number(hotmartCount) + Number(dailyFactsCount) + Number(alertsCount)
  })
}

export async function runDailyReconciliation(window = getWindow(7)) {
  await syncMeta(window)

  try {
    await syncHotmart(window)
  } catch (error) {
    console.error("[sync] Daily reconciliation skipped Hotmart API due to error", error)
  }

  await recomputeFacts(window)
  await runAlertEngine()
}

export async function pingIntegrations() {
  const checks = {
    meta: false,
    hotmart: false,
  }

  try {
    const { rows } = await query<{ ok: number }>("SELECT 1 AS ok")
    if (!rows[0]?.ok) {
      throw new Error("database indisponível")
    }

    const env = getEnv()
    checks.meta = Boolean(env.META_ACCESS_TOKEN && env.META_AD_ACCOUNT_ID)
    checks.hotmart = Boolean(
      env.HOTMART_WEBHOOK_SECRET ||
        env.HOTMART_ACCESS_TOKEN ||
        env.HOTMART_BASIC_AUTH ||
        (env.HOTMART_CLIENT_ID && env.HOTMART_CLIENT_SECRET)
    )

    return checks
  } catch {
    return checks
  }
}
