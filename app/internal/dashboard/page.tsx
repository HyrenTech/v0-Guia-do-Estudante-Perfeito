import { fmtCurrency, fmtNumber } from "@/app/internal/_components/format"
import {
  EmptyState,
  InternalCard,
  InternalTable,
  KpiItem,
  StatusPill,
} from "@/app/internal/_components/internal-ui"
import { getDashboardSnapshot, resolveDateRange } from "@/lib/data/queries"

export const runtime = "nodejs"

export default async function InternalDashboardPage() {
  const range = resolveDateRange({}, 30)

  try {
    const snapshot = await getDashboardSnapshot(range)
    const kpis = snapshot.kpis

    return (
      <div className="space-y-6">
        <InternalCard title="KPIs (30 dias)" subtitle={`${range.from} até ${range.to}`}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <KpiItem label="Gasto" value={fmtCurrency(kpis.spend_meta)} />
            <KpiItem label="Checkouts Meta" value={fmtNumber(kpis.checkouts_meta)} />
            <KpiItem label="Purchases Meta" value={fmtNumber(kpis.purchases_meta)} />
            <KpiItem label="Vendas Hotmart" value={fmtNumber(kpis.sales_hotmart)} />
            <KpiItem label="Receita Hotmart" value={fmtCurrency(kpis.revenue_hotmart)} />
            <KpiItem label="CPA Real" value={kpis.cpa_real ? fmtCurrency(kpis.cpa_real) : "-"} />
          </div>
        </InternalCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <InternalCard title="Top Campanhas" subtitle="Ordenado por gasto">
            {snapshot.topCampaigns.length === 0 ? (
              <EmptyState message="Sem dados de campanha para o período." />
            ) : (
              <InternalTable headers={["Campanha", "Status", "Gasto", "Checkouts", "CTR"]}>
                {snapshot.topCampaigns.map((row: any) => (
                  <tr key={row.platform_campaign_id}>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-3">{fmtCurrency(row.spend)}</td>
                    <td className="px-4 py-3">{fmtNumber(row.checkouts)}</td>
                    <td className="px-4 py-3">{fmtNumber(row.ctr, 2)}%</td>
                  </tr>
                ))}
              </InternalTable>
            )}
          </InternalCard>

          <InternalCard title="Alertas Abertos" subtitle="Regras automáticas da Fase 1">
            {snapshot.openAlerts.length === 0 ? (
              <EmptyState message="Nenhum alerta aberto no momento." />
            ) : (
              <div className="space-y-3">
                {snapshot.openAlerts.map((alert: any) => (
                  <article key={alert.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium text-zinc-100">{alert.title}</h3>
                      <StatusPill status={alert.severity} />
                    </div>
                    <p className="text-sm text-zinc-300">{alert.description}</p>
                    <p className="mt-2 text-xs text-zinc-500">Último evento: {new Date(alert.last_seen_at).toLocaleString("pt-BR")}</p>
                  </article>
                ))}
              </div>
            )}
          </InternalCard>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <InternalCard title="Erro de carregamento">
        <p className="text-sm text-rose-300">{error instanceof Error ? error.message : "Falha ao carregar dashboard interno."}</p>
      </InternalCard>
    )
  }
}
