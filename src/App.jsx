import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="ledger"
          element={
            <PlaceholderPage
              kicker="LEDGER"
              title="상세 원장"
              description="종목별 매입, 평가, 거래 이력을 펼쳐 보는 화면입니다. 다음 단계에서 원장 표를 연결합니다."
            />
          }
        />
        <Route
          path="calendar"
          element={
            <PlaceholderPage
              kicker="CALENDAR"
              title="금융 캘린더"
              description="예금 만기, 배당, 이자 지급일을 달력에서 확인하는 화면입니다."
            />
          }
        />
        <Route
          path="rebalancing"
          element={
            <PlaceholderPage
              kicker="REBALANCE"
              title="리밸런싱"
              description="목표 비중과 현재 비중을 비교하고 조정안을 만드는 화면입니다."
            />
          }
        />
        <Route
          path="simulator"
          element={
            <PlaceholderPage
              kicker="SIMULATOR"
              title="목표 시뮬레이터"
              description="목표 금액과 기간을 넣어 달성 경로를 시험하는 화면입니다."
            />
          }
        />
        <Route
          path="settings"
          element={
            <PlaceholderPage
              kicker="SETTINGS"
              title="설정"
              description="표시 통화, 세율 가정, 알림 시점을 바꾸는 화면입니다."
            />
          }
        />
        <Route path="admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
