import { useRef, useState } from "react";
import { domToBlob } from "modern-screenshot";
import { useFinance } from "../../context/FinanceContext";
import { formatKrw, formatPercent, formatSignedKrw, pnlClass } from "../../lib/format";
import { IconShare } from "../Icons";

export default function KpiSection() {
  const { totals, taxIncluded } = useFinance();
  const captureRef = useRef(null);
  const [shareState, setShareState] = useState("idle");

  const cards = [
    {
      label: "총 매입금액",
      value: formatKrw(totals.purchase),
      hint: `${totals.count}개 보유 자산`,
      tone: "text-ink",
    },
    {
      label: "총 평가금액",
      value: formatKrw(totals.valuation),
      hint: taxIncluded ? `세금 ${formatKrw(totals.tax)} 차감` : "세전 평가금액",
      tone: "text-ink",
    },
    {
      label: "총 평가 손익",
      value: formatSignedKrw(totals.pnl),
      hint: totals.pnl >= 0 ? "평가이익" : "평가손실",
      tone: pnlClass(totals.pnl),
    },
    {
      label: "총 포트폴리오 수익률",
      value: formatPercent(totals.returnRate),
      hint: taxIncluded ? "세금 반영 수익률" : "세전 수익률",
      tone: pnlClass(totals.returnRate),
    },
  ];

  async function shareSnapshot() {
    if (!captureRef.current || shareState === "working") return;
    setShareState("working");
    try {
      const blob = await domToBlob(captureRef.current, {
        backgroundColor: "#f3efe7",
        scale: 2,
        filter: (node) => !(node instanceof HTMLElement && node.dataset.excludeCapture === "true"),
      });
      const file = new File([blob], "seum-portfolio.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "세움 포트폴리오",
          text: "포트폴리오 현황 스냅샷",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
      }
      setShareState("done");
    } catch (error) {
      if (error?.name === "AbortError") {
        setShareState("idle");
        return;
      }
      setShareState("error");
    } finally {
      window.setTimeout(() => setShareState("idle"), 2200);
    }
  }

  const shareLabel = {
    idle: "이미지 공유하기",
    working: "이미지 만드는 중",
    done: "공유 준비 완료",
    error: "다시 시도해 주세요",
  }[shareState];

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.14em] text-gold">PORTFOLIO</p>
          <h2 className="mt-1 text-xl font-semibold">포트폴리오 현황</h2>
        </div>
        <button
          type="button"
          data-exclude-capture="true"
          onClick={shareSnapshot}
          disabled={shareState === "working"}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink disabled:opacity-60"
        >
          <IconShare />
          {shareLabel}
        </button>
      </div>

      <div ref={captureRef} className="rounded-3xl bg-paper p-1">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-line bg-white px-5 py-4">
              <p className="text-xs text-muted">{card.label}</p>
              <p className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums ${card.tone}`}>
                {card.value}
              </p>
              <p className="mt-2 text-xs text-muted">{card.hint}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
