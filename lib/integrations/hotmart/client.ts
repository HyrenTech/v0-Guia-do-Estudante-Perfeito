import { createHmac } from "node:crypto"

import { getEnv } from "@/lib/config/env"

type UnknownRecord = Record<string, unknown>

type HotmartAuthResponse = {
  access_token?: string
  token_type?: string
  expires_in?: number
}

export type NormalizedHotmartEvent = {
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
}

const toNumber = (value: unknown) => {
  if (value === undefined || value === null) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function deepGet(object: unknown, path: string): unknown {
  if (!object || typeof object !== "object") return undefined

  const keys = path.split(".")
  let cursor: unknown = object

  for (const key of keys) {
    if (!cursor || typeof cursor !== "object") return undefined
    cursor = (cursor as UnknownRecord)[key]
  }

  return cursor
}

function firstString(object: unknown, paths: string[]) {
  for (const path of paths) {
    const value = deepGet(object, path)
    if (typeof value === "string" && value.trim()) return value
  }

  return null
}

function firstDate(object: unknown, paths: string[]) {
  const raw = firstString(object, paths)
  if (!raw) return null

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null

  return date.toISOString()
}

export function verifyHotmartWebhook(headers: Headers, rawBody: string) {
  const env = getEnv()
  if (!env.HOTMART_WEBHOOK_SECRET) return true

  const tokenHeader = headers.get("x-hotmart-hottok")
  if (tokenHeader && tokenHeader === env.HOTMART_WEBHOOK_SECRET) {
    return true
  }

  const signature = headers.get("x-hotmart-signature")
  if (!signature) return false

  const digestHex = createHmac("sha256", env.HOTMART_WEBHOOK_SECRET).update(rawBody).digest("hex")
  const digestBase64 = createHmac("sha256", env.HOTMART_WEBHOOK_SECRET).update(rawBody).digest("base64")

  return signature === digestHex || signature === digestBase64
}

export function normalizeHotmartEvent(payload: unknown): NormalizedHotmartEvent | null {
  const orderId = firstString(payload, [
    "id",
    "data.id",
    "purchase.transaction",
    "purchase.order.id",
    "order.id",
    "transaction",
  ])

  if (!orderId) return null

  const eventType = firstString(payload, ["event", "event_type", "type", "name"]) ?? "unknown_event"
  const status = (firstString(payload, ["status", "purchase.status", "order.status", "data.status"]) ?? "unknown")
    .trim()
    .toLowerCase()

  return {
    hotmartOrderId: orderId,
    eventType,
    status,
    orderCreatedAt: firstDate(payload, ["created_at", "purchase.date", "purchase.created_at", "order.created_at"]),
    approvedAt: firstDate(payload, ["approved_date", "purchase.approved_date", "approved_at"]),
    currency: firstString(payload, ["currency", "purchase.currency", "order.currency"]),
    grossValue: toNumber(
      deepGet(payload, "price.value") ?? deepGet(payload, "purchase.price.value") ?? deepGet(payload, "purchase.full_price")
    ),
    netValue: toNumber(
      deepGet(payload, "commission.value") ?? deepGet(payload, "purchase.net_value") ?? deepGet(payload, "purchase.price.value")
    ),
    productName: firstString(payload, ["product.name", "purchase.product.name", "offer.name"]),
    offerCode: firstString(payload, ["offer.code", "purchase.offer.code"]),
    buyerHash: firstString(payload, ["buyer.email", "purchase.buyer.email", "buyer.id"]),
    utmSource: firstString(payload, ["utm_source", "tracking.utm_source", "purchase.tracking.utm_source"]),
    utmMedium: firstString(payload, ["utm_medium", "tracking.utm_medium", "purchase.tracking.utm_medium"]),
    utmCampaign: firstString(payload, ["utm_campaign", "tracking.utm_campaign", "purchase.tracking.utm_campaign"]),
    utmContent: firstString(payload, ["utm_content", "tracking.utm_content", "purchase.tracking.utm_content"]),
    rawPayload: payload,
  }
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

let hotmartTokenCache:
  | {
      token: string
      expiresAt: number
    }
  | null = null

function toUtcMillis(day: string, endOfDay = false) {
  const suffix = endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z"
  const ms = Date.parse(`${day}${suffix}`)

  if (Number.isNaN(ms)) {
    throw new Error(`Faixa de data inválida para Hotmart: ${day}`)
  }

  return String(ms)
}

function getHotmartBasicAuthHeader() {
  const env = getEnv()

  if (env.HOTMART_BASIC_AUTH) {
    return env.HOTMART_BASIC_AUTH.startsWith("Basic ")
      ? env.HOTMART_BASIC_AUTH
      : `Basic ${env.HOTMART_BASIC_AUTH}`
  }

  if (env.HOTMART_CLIENT_ID && env.HOTMART_CLIENT_SECRET) {
    const encoded = Buffer.from(`${env.HOTMART_CLIENT_ID}:${env.HOTMART_CLIENT_SECRET}`).toString("base64")
    return `Basic ${encoded}`
  }

  return null
}

async function getHotmartAccessToken() {
  const env = getEnv()

  const basicAuth = getHotmartBasicAuthHeader()

  if (basicAuth) {
    if (hotmartTokenCache && Date.now() < hotmartTokenCache.expiresAt) {
      return hotmartTokenCache.token
    }

    const oauthUrl = new URL(env.HOTMART_OAUTH_URL)
    oauthUrl.searchParams.set("grant_type", "client_credentials")

    const response = await fetch(oauthUrl, {
      method: "POST",
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })

    const rawResponse = await response.text()
    const parsed = JSON.parse(rawResponse) as HotmartAuthResponse

    if (!response.ok) {
      const details = rawResponse.replace(/\s+/g, " ").slice(0, 300)
      throw new Error(`Hotmart Auth API error (${response.status}): ${details}`)
    }

    if (!parsed.access_token) {
      throw new Error("Hotmart Auth API não retornou access_token")
    }

    const expiresInSeconds = typeof parsed.expires_in === "number" ? parsed.expires_in : 3600
    hotmartTokenCache = {
      token: parsed.access_token,
      expiresAt: Date.now() + Math.max(60, expiresInSeconds - 60) * 1000,
    }

    return parsed.access_token
  }

  if (env.HOTMART_ACCESS_TOKEN) {
    return env.HOTMART_ACCESS_TOKEN
  }

  return null
}

function extractItems(payload: unknown) {
  if (isArray(payload)) return payload

  if (payload && typeof payload === "object") {
    const root = payload as UnknownRecord
    const candidates = [root.items, root.data, root.sales]

    for (const candidate of candidates) {
      if (isArray(candidate)) return candidate
    }
  }

  return []
}

function extractNextPageToken(payload: unknown) {
  if (!payload || typeof payload !== "object") return null
  const pageInfo = (payload as UnknownRecord).page_info
  if (!pageInfo || typeof pageInfo !== "object") return null
  const nextToken = (pageInfo as UnknownRecord).next_page_token

  return typeof nextToken === "string" && nextToken.trim() ? nextToken : null
}

export async function fetchHotmartOrders(range: { from: string; to: string }) {
  const env = getEnv()
  const accessToken = await getHotmartAccessToken()

  if (!accessToken) {
    return []
  }

  const items: unknown[] = []
  const startDate = toUtcMillis(range.from)
  const endDate = toUtcMillis(range.to, true)
  let pageToken: string | null = null
  let pageCount = 0

  do {
    const url = new URL(env.HOTMART_ORDERS_ENDPOINT, env.HOTMART_API_BASE_URL)
    url.searchParams.set("start_date", startDate)
    url.searchParams.set("end_date", endDate)
    url.searchParams.set("max_results", "200")
    url.searchParams.set("transaction_status", "APPROVED")
    if (pageToken) {
      url.searchParams.set("page_token", pageToken)
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const details = (await response.text()).replace(/\s+/g, " ").slice(0, 300)
      throw new Error(`Hotmart API error (${response.status}) [${url.toString()}]: ${details}`)
    }

    const body = (await response.json()) as unknown
    items.push(...extractItems(body))
    pageToken = extractNextPageToken(body)
    pageCount += 1
  } while (pageToken && pageCount < 20)

  if (pageToken && pageCount >= 20) {
    throw new Error("Hotmart API pagination limit atingido (20 páginas)")
  }
  return items.map(normalizeHotmartEvent).filter(Boolean) as NormalizedHotmartEvent[]
}
