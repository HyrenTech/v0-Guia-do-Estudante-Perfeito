import { apiError, apiSuccess } from "@/lib/http/api-response"
import { validateCronSecret } from "@/lib/http/auth"
import { getWindow, runDailyReconciliation } from "@/lib/services/sync"

export const runtime = "nodejs"

export async function GET(request: Request) {
  if (!validateCronSecret(request)) {
    return apiError("Acesso negado", 401)
  }

  try {
    const window = getWindow(7)
    await runDailyReconciliation(window)

    return apiSuccess({ ok: true, window })
  } catch (error) {
    return apiError("Falha na reconciliação diária", 500, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
