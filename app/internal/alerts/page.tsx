import { EmptyState, InternalCard, InternalTable, StatusPill } from "@/app/internal/_components/internal-ui"
import { getAlerts } from "@/lib/data/queries"

export const runtime = "nodejs"

export default async function InternalAlertsPage() {
  try {
    const rows = await getAlerts("all")

    return (
      <InternalCard title="Alertas" subtitle="Abertos e fechados, ordenados por severidade">
        {rows.length === 0 ? (
          <EmptyState message="Sem alertas registrados." />
        ) : (
          <InternalTable headers={["Tipo", "Severidade", "Status", "Descrição", "Última ocorrência"]}>
            {rows.map((row: any) => (
              <tr key={row.id}>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">
                  <StatusPill status={row.severity} />
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-3 text-zinc-300">{row.description}</td>
                <td className="px-4 py-3 text-zinc-300">{new Date(row.last_seen_at).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </InternalTable>
        )}
      </InternalCard>
    )
  } catch (error) {
    return (
      <InternalCard title="Erro de carregamento">
        <p className="text-sm text-rose-300">{error instanceof Error ? error.message : "Falha ao carregar alertas."}</p>
      </InternalCard>
    )
  }
}
