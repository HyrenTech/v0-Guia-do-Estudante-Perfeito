import { apiError, apiSuccess } from "@/lib/http/api-response"
import { validateCronSecret } from "@/lib/http/auth"
import { getWindow, runHourlySync } from "@/lib/services/sync"

export const runtime = "nodejs"

export async function GET(request: Request) {
  if (!validateCronSecret(request)) {
    return apiError("Acesso negado", 401)
  }

  try {
    const window = getWindow(2)
    const records = await runHourlySync(window)

    return apiSuccess({ ok: true, records, window })
  } catch (error) {
    return apiError("Falha no cron horário", 500, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
