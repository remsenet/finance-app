import { NavLink } from "react-router-dom";
import {
  IconCalendar,
  IconDashboard,
  IconLedger,
  IconScale,
  IconSettings,
  IconTarget,
} from "./Icons";

const NAV_ITEMS = [
  { to: "/", label: "대시보드", icon: IconDashboard, end: true },
  { to: "/ledger", label: "상세 원장", icon: IconLedger },
  { to: "/calendar", label: "금융 캘린더", icon: IconCalendar },
  { to: "/rebalancing", label: "리밸런싱", icon: IconScale },
  { to: "/simulator", label: "목표 시뮬레이터", icon: IconTarget },
  { to: "/settings", label: "설정", icon: IconSettings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-pine/40 lg:hidden ${open ? "block" : "hidden"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-pine text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-base font-semibold text-pine">
            세
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">세움</p>
            <p className="text-[11px] text-white/55">종합 재정관리</p>
          </div>
        </div>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={isActive ? "text-gold" : "text-white/45"}>
                          <Icon />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="m-3 rounded-2xl bg-pine-700 px-4 py-3 text-xs leading-5 text-white/70">
          더미 포트폴리오 기준
          <p className="mt-1 text-white">주식 · 예금 · 부동산 · 채권 · 펀드 · 금</p>
        </div>
      </aside>
    </>
  );
}
