import AssetSummaryTable from "../components/dashboard/AssetSummaryTable";
import KpiSection from "../components/dashboard/KpiSection";

export default function Dashboard() {
  const today = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    weekday: "long",
  }).format(new Date());

  return (
    <div>
      <p className="mb-6 text-sm text-muted">{today} 기준 더미 데이터</p>
      <KpiSection />
      <AssetSummaryTable />
    </div>
  );
}
