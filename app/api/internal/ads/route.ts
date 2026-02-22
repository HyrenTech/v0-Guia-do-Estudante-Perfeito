import { apiError, apiSuccess } from "@/lib/http/api-response"
import { getAdStats, resolveDateRange } from "@/lib/data/queries"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = resolveDateRange({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    })

    const campaignId = searchParams.get("campaignId")
    const data = await getAdStats(range, campaignId)

    return apiSuccess(data, undefined, {
      range,
      campaignId,
    })
  } catch (error) {
    return apiError("Falha ao consultar anúncios", 400, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
