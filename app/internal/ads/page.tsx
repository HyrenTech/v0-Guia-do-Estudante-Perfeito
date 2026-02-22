import { fmtCurrency, fmtNumber, fmtPercent } from "@/app/internal/_components/format"
import { EmptyState, InternalCard, InternalTable, StatusPill } from "@/app/internal/_components/internal-ui"
import { getAdStats, resolveDateRange } from "@/lib/data/queries"

export const runtime = "nodejs"

export default async function InternalAdsPage() {
  const range = resolveDateRange({}, 30)

  try {
    const rows = await getAdStats(range)

    return (
      <InternalCard title="Ranking de Anúncios" subtitle={`Período: ${range.from} até ${range.to}`}>
        {rows.length === 0 ? (
          <EmptyState message="Nenhum anúncio encontrado." />
        ) : (
          <InternalTable
            headers={[
              "Anúncio",
              "Campanha",
              "Status",
              "Gasto",
              "Checkouts",
              "Custo/Checkout",
              "CTR",
              "CPM",
            ]}
          >
            {rows.map((row: any) => (
              <tr key={row.platform_ad_id}>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.campaign_name}</td>
                <td className="px-4 py-3">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-3">{fmtCurrency(row.spend)}</td>
                <td className="px-4 py-3">{fmtNumber(row.checkouts)}</td>
                <td className="px-4 py-3">{fmtCurrency(row.cost_per_checkout)}</td>
                <td className="px-4 py-3">{fmtPercent(row.ctr)}</td>
                <td className="px-4 py-3">{fmtCurrency(row.cpm)}</td>
              </tr>
            ))}
          </InternalTable>
        )}
      </InternalCard>
    )
  } catch (error) {
    return (
      <InternalCard title="Erro de carregamento">
        <p className="text-sm text-rose-300">{error instanceof Error ? error.message : "Falha ao carregar anúncios."}</p>
      </InternalCard>
    )
  }
}
