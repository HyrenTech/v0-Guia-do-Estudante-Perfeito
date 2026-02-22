import { getEnv, requireEnv } from "@/lib/config/env"

type MetaPagination<T> = {
  data: T[]
  paging?: {
    next?: string
    cursors?: {
      after?: string
    }
  }
}

type MetaAction = {
  action_type: string
  value: string
}

type MetaInsightsRow = {
  campaign_id?: string
  campaign_name?: string
  adset_id?: string
  adset_name?: string
  ad_id?: string
  ad_name?: string
  spend?: string
  impressions?: string
  clicks?: string
  cpm?: string
  cpc?: string
  ctr?: string
  date_start: string
  actions?: MetaAction[]
  hourly_stats_aggregated_by_advertiser_time_zone?: string
}

export type MetaCampaign = {
  id: string
  name: string
  status: string
  objective?: string
}

export type MetaAdSet = {
  id: string
  name: string
  status: string
  campaign_id: string
  daily_budget?: string
}

export type MetaAd = {
  id: string
  name: string
  status: string
  adset_id: string
  creative?: {
    object_type?: string
  }
}

export type NormalizedMetaInsight = {
  campaignId?: string
  campaignName?: string
  adSetId?: string
  adSetName?: string
  adId?: string
  adName?: string
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

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function parseMetaHour(dateStart: string, hourWindow?: string) {
  if (!hourWindow) {
    return `${dateStart}T00:00:00.000Z`
  }

  const hour = hourWindow.split(":")[0]
  const hourValue = Number(hour)

  if (!Number.isFinite(hourValue)) {
    return `${dateStart}T00:00:00.000Z`
  }

  const [year, month, day] = dateStart.split("-").map((part) => Number(part))
  const date = new Date(Date.UTC(year, month - 1, day, hourValue, 0, 0, 0))
  return date.toISOString()
}

function actionValue(actions: MetaAction[] | undefined, actionType: string) {
  if (!actions?.length) return 0
  return actions
    .filter((action) => action.action_type === actionType)
    .reduce((acc, action) => acc + toNumber(action.value), 0)
}

async function metaRequest<T>(endpointOrUrl: string, params?: URLSearchParams, attempt = 1): Promise<T> {
  const env = getEnv()
  const { META_ACCESS_TOKEN } = requireEnv(["META_ACCESS_TOKEN"])

  const url = endpointOrUrl.startsWith("http")
    ? endpointOrUrl
    : `${env.META_BASE_URL}/${env.META_API_VERSION}/${endpointOrUrl}?${params?.toString() ?? ""}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${META_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const body = await response.text()

    if (attempt < 4 && response.status >= 500) {
      await wait(400 * 2 ** (attempt - 1))
      return metaRequest<T>(endpointOrUrl, params, attempt + 1)
    }

    throw new Error(`Meta API error (${response.status}): ${body}`)
  }

  return response.json() as Promise<T>
}

async function paginate<T>(endpoint: string, params: URLSearchParams) {
  const data: T[] = []
  let nextUrl: string | null = null

  while (true) {
    const page: MetaPagination<T> = nextUrl
      ? await metaRequest<MetaPagination<T>>(nextUrl)
      : await metaRequest<MetaPagination<T>>(endpoint, params)

    data.push(...(page.data ?? []))

    if (!page.paging?.next) {
      break
    }

    nextUrl = page.paging.next
  }

  return data
}

function buildActPath(path: string) {
  const { META_AD_ACCOUNT_ID } = requireEnv(["META_AD_ACCOUNT_ID"])
  const normalized = META_AD_ACCOUNT_ID.startsWith("act_") ? META_AD_ACCOUNT_ID : `act_${META_AD_ACCOUNT_ID}`
  return `${normalized}/${path}`
}

export async function fetchMetaCampaigns() {
  const params = new URLSearchParams({
    fields: "id,name,status,objective",
    limit: "200",
  })

  return paginate<MetaCampaign>(buildActPath("campaigns"), params)
}

export async function fetchMetaAdSets() {
  const params = new URLSearchParams({
    fields: "id,name,status,campaign_id,daily_budget",
    limit: "500",
  })

  return paginate<MetaAdSet>(buildActPath("adsets"), params)
}

export async function fetchMetaAds() {
  const params = new URLSearchParams({
    fields: "id,name,status,adset_id,creative{object_type}",
    limit: "500",
  })

  return paginate<MetaAd>(buildActPath("ads"), params)
}

export async function fetchMetaInsights(range: { from: string; to: string }) {
  const params = new URLSearchParams({
    fields:
      "campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,spend,impressions,clicks,cpm,cpc,ctr,date_start,actions",
    level: "ad",
    limit: "500",
    breakdowns: "hourly_stats_aggregated_by_advertiser_time_zone",
    time_range: JSON.stringify({ since: range.from, until: range.to }),
  })

  const rows = await paginate<MetaInsightsRow>(buildActPath("insights"), params)

  return rows.map<NormalizedMetaInsight>((row) => ({
    campaignId: row.campaign_id,
    campaignName: row.campaign_name,
    adSetId: row.adset_id,
    adSetName: row.adset_name,
    adId: row.ad_id,
    adName: row.ad_name,
    dateHour: parseMetaHour(row.date_start, row.hourly_stats_aggregated_by_advertiser_time_zone),
    spend: toNumber(row.spend),
    impressions: toNumber(row.impressions),
    clicks: toNumber(row.clicks),
    cpm: toNumber(row.cpm),
    cpc: toNumber(row.cpc),
    ctr: toNumber(row.ctr),
    initiateCheckout: actionValue(row.actions, "offsite_conversion.fb_pixel_initiate_checkout"),
    purchaseMeta: actionValue(row.actions, "offsite_conversion.fb_pixel_purchase"),
  }))
}
