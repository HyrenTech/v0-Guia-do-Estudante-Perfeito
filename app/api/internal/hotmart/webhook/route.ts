import { apiError, apiSuccess } from "@/lib/http/api-response"
import { normalizeHotmartEvent, verifyHotmartWebhook } from "@/lib/integrations/hotmart/client"
import { recomputeFacts } from "@/lib/services/sync"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()

    if (!verifyHotmartWebhook(request.headers, rawBody)) {
      return apiError("Assinatura do webhook inválida", 401)
    }

    const payload = JSON.parse(rawBody) as unknown
    const normalized = normalizeHotmartEvent(payload)

    if (!normalized) {
      return apiError("Evento Hotmart inválido", 400)
    }

    const { upsertHotmartOrder } = await import("@/lib/data/repository")
    await upsertHotmartOrder(normalized)

    // Atualiza agregados recentes para manter dashboard consistente.
    await recomputeFacts()

    return apiSuccess({ received: true })
  } catch (error) {
    return apiError("Falha ao processar webhook Hotmart", 500, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
