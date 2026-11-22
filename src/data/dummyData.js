function isoDaysFromToday(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const ASSET_TYPES = [
  { id: "stock", label: "주식", taxRate: 0.22 },
  { id: "deposit", label: "예금", taxRate: 0.154 },
  { id: "realestate", label: "부동산", taxRate: 0.22 },
  { id: "bond", label: "채권", taxRate: 0.154 },
  { id: "fund", label: "펀드", taxRate: 0.154 },
  { id: "gold", label: "금", taxRate: 0.154 },
];

export const TAX_RATE_BY_TYPE = Object.fromEntries(
  ASSET_TYPES.map((type) => [type.id, type.taxRate]),
);

export const holdings = [
  {
    id: "sec-005930",
    type: "stock",
    name: "삼성전자",
    purchaseAmount: 48200000,
    marketValue: 53640000,
  },
  {
    id: "sec-000660",
    type: "stock",
    name: "SK하이닉스",
    purchaseAmount: 22000000,
    marketValue: 19800000,
  },
  {
    id: "etf-069500",
    type: "stock",
    name: "KODEX 200",
    purchaseAmount: 15500000,
    marketValue: 16740000,
  },
  {
    id: "dep-kb",
    type: "deposit",
    name: "KB국민 정기예금",
    institution: "KB국민은행",
    purchaseAmount: 30000000,
    marketValue: 30870000,
    maturityDate: isoDaysFromToday(1),
  },
  {
    id: "dep-shinhan",
    type: "deposit",
    name: "신한 첫거래 적금",
    institution: "신한은행",
    purchaseAmount: 8400000,
    marketValue: 8610000,
    maturityDate: isoDaysFromToday(3),
  },
  {
    id: "dep-kakao",
    type: "deposit",
    name: "카카오뱅크 파킹통장",
    institution: "카카오뱅크",
    purchaseAmount: 12000000,
    marketValue: 12180000,
    maturityDate: isoDaysFromToday(45),
  },
  {
    id: "re-mapo",
    type: "realestate",
    name: "마포 오피스텔",
    purchaseAmount: 210000000,
    marketValue: 228000000,
  },
  {
    id: "bond-ktb",
    type: "bond",
    name: "국고채 10년",
    purchaseAmount: 20000000,
    marketValue: 20420000,
  },
  {
    id: "fund-div",
    type: "fund",
    name: "글로벌 배당 펀드",
    purchaseAmount: 18000000,
    marketValue: 19260000,
  },
  {
    id: "gold-krx",
    type: "gold",
    name: "KRX 금",
    purchaseAmount: 6500000,
    marketValue: 7150000,
  },
];
