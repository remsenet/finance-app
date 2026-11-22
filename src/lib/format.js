const amount = new Intl.NumberFormat("ko-KR");

export function formatKrw(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}₩${amount.format(Math.abs(Math.round(value)))}`;
}

export function formatSignedKrw(value) {
  if (value === 0) return "₩0";
  const sign = value > 0 ? "+" : "-";
  return `${sign}₩${amount.format(Math.abs(Math.round(value)))}`;
}

export function formatPercent(rate) {
  const signed = `${rate > 0 ? "+" : ""}${(rate * 100).toFixed(2)}`;
  return `${signed}%`;
}

export function pnlClass(value) {
  if (value > 0) return "text-gain";
  if (value < 0) return "text-loss";
  return "text-muted";
}

export function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}
