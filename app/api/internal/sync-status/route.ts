import { apiError, apiSuccess } from "@/lib/http/api-response"
import { getSyncStatus } from "@/lib/data/queries"
import { pingIntegrations } from "@/lib/services/sync"

export const runtime = "nodejs"

export async function GET() {
  try {
    const [data, integrations] = await Promise.all([getSyncStatus(), pingIntegrations()])

    return apiSuccess(data, undefined, { integrations })
  } catch (error) {
    return apiError("Falha ao consultar status de sincronização", 500, {
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
