import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import { IconBell, IconMenu } from "./Icons";

const PAGE_TITLES = {
  "/": "대시보드",
  "/ledger": "상세 원장",
  "/calendar": "금융 캘린더",
  "/rebalancing": "리밸런싱",
  "/simulator": "목표 시뮬레이터",
  "/settings": "설정",
  "/admin": "관리자 페이지",
};

export default function Header({ onMenu }) {
  const { pathname } = useLocation();
  const { taxIncluded, setTaxIncluded, alarms } = useFinance();
  const [alarmOpen, setAlarmOpen] = useState(false);
  const alarmRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    function handlePointerDown(event) {
      if (!alarmRef.current?.contains(event.target)) {
        setAlarmOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setAlarmOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink lg:hidden"
          aria-label="메뉴 열기"
        >
          <IconMenu />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] tracking-[0.16em] text-muted">SEUM</p>
          <h1 id={titleId} className="truncate text-lg font-semibold">
            {PAGE_TITLES[pathname] ?? "세움"}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={taxIncluded}
            onClick={() => setTaxIncluded((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-1.5 pl-3 text-xs sm:text-sm"
          >
            <span className="text-muted">{taxIncluded ? "세금 포함" : "세금 미포함"}</span>
            <span
              className={`relative h-6 w-11 rounded-full transition ${taxIncluded ? "bg-pine" : "bg-stone-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  taxIncluded ? "left-5" : "left-0.5"
                }`}
              />
            </span>
          </button>

          <div className="relative" ref={alarmRef}>
            <button
              type="button"
              aria-label={`만기 알림 ${alarms.length}건`}
              aria-expanded={alarmOpen}
              aria-controls="maturity-alarm-panel"
              onClick={() => setAlarmOpen((open) => !open)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink"
            >
              <IconBell />
              {alarms.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-loss px-1 text-[11px] font-semibold text-white">
                  {alarms.length}
                </span>
              )}
            </button>

            {alarmOpen && (
              <div
                id="maturity-alarm-panel"
                role="region"
                aria-label="예금 만기 알림"
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-line bg-white p-3 shadow-lg"
              >
                <p className="px-2 py-1 text-sm font-semibold">만기 알림</p>
                <p className="px-2 pb-2 text-xs text-muted">예금 만기 3일 전과 1일 전만 표시합니다.</p>
                {alarms.length === 0 ? (
                  <p className="rounded-xl bg-paper px-3 py-4 text-sm text-muted">다가오는 만기 알림이 없습니다.</p>
                ) : (
                  <ul className="space-y-2">
                    {alarms.map((alarm) => (
                      <li key={alarm.id} className="rounded-xl bg-paper px-3 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{alarm.name}</p>
                            <p className="mt-0.5 text-xs text-muted">{alarm.institution}</p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                              alarm.days === 1 ? "bg-loss/10 text-loss" : "bg-gold-soft text-gold"
                            }`}
                          >
                            만기 {alarm.days}일 전
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted">만기일 {alarm.maturityDate}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <Link
            to="/admin"
            className="hidden rounded-xl bg-pine px-3 py-2.5 text-sm font-medium text-white sm:inline-flex"
          >
            관리자페이지 입장
          </Link>
          <Link
            to="/admin"
            aria-label="관리자페이지 입장"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-pine text-sm font-semibold text-white sm:hidden"
          >
            관
          </Link>
        </div>
      </div>
    </header>
  );
}
