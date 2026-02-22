import { NextResponse } from "next/server"

import { getEnv } from "@/lib/config/env"
import { getLastDataTimestamp } from "@/lib/data/queries"

type ApiMeta = {
  timezone: string
  currency: string
  lastUpdatedAt: string | null
  [key: string]: unknown
}

type ApiEnvelope<T> = {
  data: T | null
  meta: ApiMeta
  error: { message: string; details?: unknown } | null
}

async function baseMeta(extra?: Partial<ApiMeta>): Promise<ApiMeta> {
  const env = getEnv()
  let lastUpdatedAt: string | null = null

  try {
    lastUpdatedAt = await getLastDataTimestamp()
  } catch {
    lastUpdatedAt = null
  }

  return {
    timezone: env.APP_TIMEZONE,
    currency: env.APP_CURRENCY,
    lastUpdatedAt,
    ...extra,
  }
}

export async function apiSuccess<T>(
  data: T,
  init?: ResponseInit,
  metaOverrides?: Partial<ApiMeta>
) {
  const payload: ApiEnvelope<T> = {
    data,
    meta: await baseMeta(metaOverrides),
    error: null,
  }

  return NextResponse.json(payload, init)
}

export async function apiError(
  message: string,
  status = 500,
  details?: unknown,
  metaOverrides?: Partial<ApiMeta>
) {
  const payload: ApiEnvelope<null> = {
    data: null,
    meta: await baseMeta(metaOverrides),
    error: { message, details },
  }

  return NextResponse.json(payload, { status })
}
