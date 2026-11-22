import { useFinance } from "../../context/FinanceContext";
import { formatKrw, formatPercent, formatSignedKrw, pnlClass } from "../../lib/format";

export default function AssetSummaryTable() {
  const { assetSummary, totals, taxIncluded } = useFinance();

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.14em] text-gold">ALLOCATION</p>
          <h2 className="mt-1 text-xl font-semibold">자산 요약</h2>
        </div>
        <p className="text-sm text-muted">{taxIncluded ? "세금 포함 평가" : "세금 미포함 평가"}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-xs text-muted">
                <th className="px-5 py-3 font-medium">자산 형태</th>
                <th className="px-5 py-3 text-right font-medium">보유</th>
                <th className="px-5 py-3 text-right font-medium">매입금액</th>
                <th className="px-5 py-3 text-right font-medium">평가금액</th>
                <th className="px-5 py-3 text-right font-medium">평가손익</th>
                <th className="px-5 py-3 text-right font-medium">수익률</th>
              </tr>
            </thead>
            <tbody>
              {assetSummary.map((row) => (
                <tr key={row.type} className="border-b border-line/80 last:border-b-0">
                  <td className="px-5 py-4 font-medium">{row.label}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-muted">{row.count}</td>
                  <td className="px-5 py-4 text-right tabular-nums">{formatKrw(row.purchase)}</td>
                  <td className="px-5 py-4 text-right tabular-nums">{formatKrw(row.valuation)}</td>
                  <td className={`px-5 py-4 text-right tabular-nums ${pnlClass(row.pnl)}`}>
                    {formatSignedKrw(row.pnl)}
                  </td>
                  <td className={`px-5 py-4 text-right tabular-nums ${pnlClass(row.returnRate)}`}>
                    {formatPercent(row.returnRate)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-pine text-white">
                <td className="px-5 py-4 font-semibold">합계</td>
                <td className="px-5 py-4 text-right tabular-nums">{totals.count}</td>
                <td className="px-5 py-4 text-right tabular-nums">{formatKrw(totals.purchase)}</td>
                <td className="px-5 py-4 text-right tabular-nums">{formatKrw(totals.valuation)}</td>
                <td className="px-5 py-4 text-right tabular-nums">{formatSignedKrw(totals.pnl)}</td>
                <td className="px-5 py-4 text-right tabular-nums">{formatPercent(totals.returnRate)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
