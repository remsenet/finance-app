import { createContext, useContext, useMemo, useState } from "react";
import { ASSET_TYPES, TAX_RATE_BY_TYPE, holdings as rawHoldings } from "../data/dummyData";
import { startOfDay } from "../lib/format";

const FinanceContext = createContext(null);

const TYPE_ORDER = new Map(ASSET_TYPES.map((type, index) => [type.id, index]));
const TYPE_LABEL = Object.fromEntries(ASSET_TYPES.map((type) => [type.id, type.label]));

export function FinanceProvider({ children }) {
  const [taxIncluded, setTaxIncluded] = useState(false);

  const holdings = useMemo(
    () =>
      rawHoldings.map((holding) => {
        const gain = holding.marketValue - holding.purchaseAmount;
        const tax = taxIncluded ? Math.max(gain, 0) * (TAX_RATE_BY_TYPE[holding.type] ?? 0) : 0;
        const valuation = holding.marketValue - tax;
        const pnl = valuation - holding.purchaseAmount;
        return {
          ...holding,
          typeLabel: TYPE_LABEL[holding.type],
          tax,
          valuation,
          pnl,
          returnRate: holding.purchaseAmount === 0 ? 0 : pnl / holding.purchaseAmount,
        };
      }),
    [taxIncluded],
  );

  const totals = useMemo(() => {
    const purchase = holdings.reduce((sum, holding) => sum + holding.purchaseAmount, 0);
    const valuation = holdings.reduce((sum, holding) => sum + holding.valuation, 0);
    const tax = holdings.reduce((sum, holding) => sum + holding.tax, 0);
    const pnl = valuation - purchase;
    return {
      purchase,
      valuation,
      tax,
      pnl,
      returnRate: purchase === 0 ? 0 : pnl / purchase,
      count: holdings.length,
    };
  }, [holdings]);

  const assetSummary = useMemo(() => {
    const grouped = new Map();
    for (const holding of holdings) {
      const current = grouped.get(holding.type) ?? {
        type: holding.type,
        label: holding.typeLabel,
        count: 0,
        purchase: 0,
        valuation: 0,
      };
      current.count += 1;
      current.purchase += holding.purchaseAmount;
      current.valuation += holding.valuation;
      grouped.set(holding.type, current);
    }

    return [...grouped.values()]
      .map((row) => ({
        ...row,
        pnl: row.valuation - row.purchase,
        returnRate: row.purchase === 0 ? 0 : (row.valuation - row.purchase) / row.purchase,
      }))
      .sort((a, b) => TYPE_ORDER.get(a.type) - TYPE_ORDER.get(b.type));
  }, [holdings]);

  const alarms = useMemo(() => {
    const today = startOfDay(new Date());
    return holdings
      .filter((holding) => holding.type === "deposit" && holding.maturityDate)
      .map((holding) => {
        const maturity = startOfDay(new Date(`${holding.maturityDate}T00:00:00`));
        const days = Math.round((maturity - today) / 86_400_000);
        return { ...holding, days };
      })
      .filter((holding) => holding.days === 1 || holding.days === 3)
      .sort((a, b) => a.days - b.days);
  }, [holdings]);

  const value = useMemo(
    () => ({
      taxIncluded,
      setTaxIncluded,
      holdings,
      totals,
      assetSummary,
      alarms,
    }),
    [taxIncluded, holdings, totals, assetSummary, alarms],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance는 FinanceProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
