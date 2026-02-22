import { apiError, apiSuccess } from "@/lib/http/api-response"
import { validateInternalSecret } from "@/lib/http/auth"
import { getWindow, runHourlySync } from "@/lib/services/sync"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!validateInternalSecret(request)) {
    return apiError("Acesso negado", 401)
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { from?: string; to?: string }

    const window = body.from && body.to ? { from: body.from, to: body.to } : getWindow(2)
    const total = await runHourlySync(window)

    return apiSuccess({ ok: true, records: total, window })
  } catch (error) {
    return apiError("Falha ao executar sincronização manual", 500, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
