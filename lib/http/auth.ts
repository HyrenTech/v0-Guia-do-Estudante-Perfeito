import { NextRequest } from "next/server"

import { getEnv } from "@/lib/config/env"

function unauthorizedResponse() {
  return new Response("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Internal", charset="UTF-8"',
    },
  })
}

function decodeBasicToken(encoded: string) {
  if (typeof atob === "function") {
    return atob(encoded)
  }

  const bufferCtor = (globalThis as { Buffer?: { from: (input: string, encoding: string) => { toString: (enc: string) => string } } })
    .Buffer

  if (bufferCtor) {
    return bufferCtor.from(encoded, "base64").toString("utf8")
  }

  throw new Error("Base64 decode indisponível")
}

export function validateBasicAuth(authHeader: string | null) {
  const env = getEnv()

  if (!env.INTERNAL_BASIC_AUTH_USER || !env.INTERNAL_BASIC_AUTH_PASSWORD) {
    return true
  }

  if (!authHeader?.startsWith("Basic ")) {
    return false
  }

  const encoded = authHeader.replace("Basic ", "")
  const decoded = decodeBasicToken(encoded)
  const [user, password] = decoded.split(":")

  return user === env.INTERNAL_BASIC_AUTH_USER && password === env.INTERNAL_BASIC_AUTH_PASSWORD
}

export function enforceBasicAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!validateBasicAuth(authHeader)) {
    return unauthorizedResponse()
  }

  return null
}

export function validateInternalSecret(request: Request) {
  const env = getEnv()

  if (!env.INTERNAL_SYNC_SECRET) {
    return false
  }

  const provided = request.headers.get("x-internal-sync-secret")
  return Boolean(provided && provided === env.INTERNAL_SYNC_SECRET)
}

export function validateCronSecret(request: Request) {
  const env = getEnv()

  if (!env.CRON_SECRET) {
    return false
  }

  const bearer = request.headers.get("authorization")
  const token = request.headers.get("x-cron-secret")

  if (token && token === env.CRON_SECRET) {
    return true
  }

  if (bearer?.startsWith("Bearer ")) {
    return bearer.replace("Bearer ", "") === env.CRON_SECRET
  }

  return false
}
