import { apiError, apiSuccess } from "@/lib/http/api-response"
import { getCampaignStats, resolveDateRange } from "@/lib/data/queries"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = (searchParams.get("status") ?? "all").toLowerCase()

    if (!["active", "paused", "all"].includes(status)) {
      return apiError("Filtro de status inválido", 400)
    }

    const range = resolveDateRange({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    })

    const data = await getCampaignStats(range, status as "active" | "paused" | "all")
    return apiSuccess(data, undefined, { range, status })
  } catch (error) {
    return apiError("Falha ao consultar campanhas", 400, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
