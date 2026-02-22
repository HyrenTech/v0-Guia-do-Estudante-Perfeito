import { EmptyState, InternalCard, InternalTable, StatusPill } from "@/app/internal/_components/internal-ui"
import { getSyncStatus } from "@/lib/data/queries"
import { pingIntegrations } from "@/lib/services/sync"

export const runtime = "nodejs"

export default async function InternalIntegrationsPage() {
  try {
    const [syncStatus, integrations] = await Promise.all([getSyncStatus(), pingIntegrations()])

    return (
      <div className="space-y-6">
        <InternalCard title="Status das Integrações" subtitle="Verificação de credenciais e conectividade básica">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-zinc-300">Meta Marketing API</p>
              <div className="mt-2">
                <StatusPill status={integrations.meta ? "connected" : "disconnected"} />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-zinc-300">Hotmart</p>
              <div className="mt-2">
                <StatusPill status={integrations.hotmart ? "connected" : "disconnected"} />
              </div>
            </div>
          </div>
        </InternalCard>

        <InternalCard title="Último Sync por Fonte">
          {syncStatus.bySource.length === 0 ? (
            <EmptyState message="Nenhum sync executado ainda." />
          ) : (
            <InternalTable headers={["Fonte", "Status", "Registros", "Finalizado", "Erro"]}>
              {syncStatus.bySource.map((row: any) => (
                <tr key={row.source}>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3">{row.records_upserted}</td>
                  <td className="px-4 py-3">{row.finished_at ? new Date(row.finished_at).toLocaleString("pt-BR") : "-"}</td>
                  <td className="px-4 py-3 text-rose-300">{row.error_message ?? "-"}</td>
                </tr>
              ))}
            </InternalTable>
          )}
        </InternalCard>

        <InternalCard title="Execuções Recentes">
          {syncStatus.recentRuns.length === 0 ? (
            <EmptyState message="Sem execuções registradas." />
          ) : (
            <InternalTable headers={["ID", "Fonte", "Status", "Início", "Fim", "Registros"]}>
              {syncStatus.recentRuns.map((row: any) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3">{new Date(row.started_at).toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3">{row.finished_at ? new Date(row.finished_at).toLocaleString("pt-BR") : "-"}</td>
                  <td className="px-4 py-3">{row.records_upserted}</td>
                </tr>
              ))}
            </InternalTable>
          )}
        </InternalCard>
      </div>
    )
  } catch (error) {
    return (
      <InternalCard title="Erro de carregamento">
        <p className="text-sm text-rose-300">{error instanceof Error ? error.message : "Falha ao carregar integrações."}</p>
      </InternalCard>
    )
  }
}
