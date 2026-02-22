import { apiError, apiSuccess } from "@/lib/http/api-response"
import { getAlerts } from "@/lib/data/queries"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = (searchParams.get("status") ?? "open").toLowerCase()

    if (!["open", "closed", "all"].includes(status)) {
      return apiError("Filtro de status inválido", 400)
    }

    const data = await getAlerts(status as "open" | "closed" | "all")
    return apiSuccess(data, undefined, { status })
  } catch (error) {
    return apiError("Falha ao consultar alertas", 400, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
