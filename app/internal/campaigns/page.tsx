import { fmtCurrency, fmtNumber, fmtPercent } from "@/app/internal/_components/format"
import { EmptyState, InternalCard, InternalTable, StatusPill } from "@/app/internal/_components/internal-ui"
import { getCampaignStats, resolveDateRange } from "@/lib/data/queries"

export const runtime = "nodejs"

export default async function InternalCampaignsPage() {
  const range = resolveDateRange({}, 30)

  try {
    const rows = await getCampaignStats(range, "all")

    return (
      <InternalCard title="Campanhas" subtitle={`Período: ${range.from} até ${range.to}`}>
        {rows.length === 0 ? (
          <EmptyState message="Nenhuma campanha encontrada." />
        ) : (
          <InternalTable
            headers={[
              "Campanha",
              "Status",
              "Gasto",
              "Impressões",
              "Cliques",
              "CTR",
              "CPC",
              "Checkouts",
              "Purchase Meta",
            ]}
          >
            {rows.map((row: any) => (
              <tr key={row.platform_campaign_id}>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-3">{fmtCurrency(row.spend)}</td>
                <td className="px-4 py-3">{fmtNumber(row.impressions)}</td>
                <td className="px-4 py-3">{fmtNumber(row.clicks)}</td>
                <td className="px-4 py-3">{fmtPercent(row.ctr)}</td>
                <td className="px-4 py-3">{fmtCurrency(row.cpc)}</td>
                <td className="px-4 py-3">{fmtNumber(row.checkouts)}</td>
                <td className="px-4 py-3">{fmtNumber(row.purchases_meta)}</td>
              </tr>
            ))}
          </InternalTable>
        )}
      </InternalCard>
    )
  } catch (error) {
    return (
      <InternalCard title="Erro de carregamento">
        <p className="text-sm text-rose-300">{error instanceof Error ? error.message : "Falha ao carregar campanhas."}</p>
      </InternalCard>
    )
  }
}
