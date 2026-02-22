import { apiError, apiSuccess } from "@/lib/http/api-response"
import { getKpis, resolveDateRange } from "@/lib/data/queries"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = resolveDateRange({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    })

    const data = await getKpis(range)
    return apiSuccess(data, undefined, { range })
  } catch (error) {
    return apiError("Falha ao consultar KPIs", 400, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
