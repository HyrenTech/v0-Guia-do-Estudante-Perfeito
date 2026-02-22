import { apiError, apiSuccess } from "@/lib/http/api-response"
import { getTimeseries, resolveDateRange } from "@/lib/data/queries"

const allowedMetrics = new Set(["spend", "sales", "roas", "cpa"])

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = (searchParams.get("metric") ?? "spend").toLowerCase()

    if (!allowedMetrics.has(metric)) {
      return apiError("Métrica inválida", 400)
    }

    const range = resolveDateRange({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    })

    const data = await getTimeseries(range, metric as "spend" | "sales" | "roas" | "cpa")
    return apiSuccess(data, undefined, { range, metric })
  } catch (error) {
    return apiError("Falha ao consultar série temporal", 400, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
