import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { enforceBasicAuth } from "@/lib/http/auth"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/internal/hotmart/webhook")) {
    return NextResponse.next()
  }

  const denied = enforceBasicAuth(request)
  if (denied) return denied

  return NextResponse.next()
}

export const config = {
  matcher: ["/internal/:path*", "/api/internal/:path*"],
}
