import React, { useState } from 'react';
import {
  Bell, Share2, ShieldAlert, TrendingUp, Wallet, Calendar,
  PieChart, Sliders, Settings, Moon, Sun, Download, Plus,
  X, Building2, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Info, Filter, Search, RefreshCw, ChevronLeft, ChevronRight, Clock,
  Scale, AlertTriangle, ArrowRightLeft, Sparkles, Target, Zap, Flame, Award
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// 초기 더미 데이터 (주식, 예금, 부동산)[cite: 1]
const INITIAL_ASSETS = [
  { id: 1, category: '주식', name: '삼성전자 외 4종', buyPrice: 45000000, evalPrice: 54200000, marketPrice: 55100000, taxRate: 0.22, targetDate: '2026-11-20' },
  { id: 2, category: '예금', name: 'KB Star 정기예금', buyPrice: 30000000, evalPrice: 31140000, marketPrice: 31140000, taxRate: 0.154, dDay: 3, targetDate: '2026-11-25' },
  { id: 3, category: '예금', name: '신한 쏠편한 정기예금', buyPrice: 20000000, evalPrice: 20780000, marketPrice: 20780000, taxRate: 0.154, dDay: 1, targetDate: '2026-11-23' },
  { id: 4, category: '부동산', name: '오피스텔 지분 투자', buyPrice: 80000000, evalPrice: 88500000, marketPrice: 90000000, taxRate: 0.30, targetDate: '2026-11-15' },
];

// 금융 캘린더 기본 일정 더미 데이터 (배당금, 이자 수취, 월세, 카드 결제일 등)
const INITIAL_CALENDAR_EVENTS = [
  { id: 'CE-1', date: '2026-11-05', name: '강남 오피스텔 월세 입금', category: '부동산', flowType: 'income', amount: 650000, memo: '11월분 임대수익 정산' },
  { id: 'CE-2', date: '2026-11-12', name: 'KB Star 정기예금 월이자', category: '예금', flowType: 'income', amount: 105000, memo: '11월차 월이자 계좌 입금' },
  { id: 'CE-3', date: '2026-11-14', name: '삼성전자 3분기 배당금', category: '주식', flowType: 'income', amount: 361000, memo: '보유 500주 분기 배당금 입금' },
  { id: 'CE-4', date: '2026-11-20', name: '삼성전자 분기 배당락일', category: '주식', flowType: 'neutral', amount: 0, memo: '4분기 배당권리 기준일' },
  { id: 'CE-5', date: '2026-11-27', name: '신용카드 대금 결제일', category: '지출', flowType: 'expense', amount: 1850000, memo: '10월 사용분 자동 결제' },
  { id: 'CE-6', date: '2026-11-30', name: '주택청약 및 연금저축 자동이체', category: '저축', flowType: 'expense', amount: 500000, memo: '월 정기 저축성 이체' },
];

// 오늘 가장 이자가 높은 은행 추천 데이터[cite: 1]
const TOP_BANKS = [
  { rank: 1, bank: 'SBI저축은행', product: '정기예금 (12개월)', rate: '4.20%', type: '2금융권', tag: '최고금리' },
  { rank: 2, bank: '다올저축은행', product: 'Fi 리볼빙 정기예금', rate: '4.10%', type: '2금융권', tag: '인기' },
  { rank: 3, bank: 'SC제일은행', product: 'e-그린세이브예금', rate: '3.85%', type: '1금융권', tag: '시중은행 1위' },
];

// 상세 원장 거래 내역 더미 데이터 (주식, 예금, 부동산 매수/매도 및 배당/이자 수취)
const INITIAL_LEDGER_TRANSACTIONS = [
  {
    id: 'TX-20261114-01',
    date: '2026-11-14',
    category: '주식',
    type: '배당',
    name: '삼성전자 (005930)',
    amount: 361000,
    unitPrice: null,
    quantity: '500주',
    tax: 55590, // 배당소득세 (15.4%)
    settledAmount: 305410,
    memo: '2026년 3분기 정기배당금 지급',
    status: '완료'
  },
  {
    id: 'TX-20261112-02',
    date: '2026-11-12',
    category: '예금',
    type: '이자',
    name: 'KB Star 정기예금',
    amount: 105000,
    unitPrice: null,
    quantity: '연 4.2%',
    tax: 16170, // 이자소득세 (15.4%)
    settledAmount: 88830,
    memo: '11월차 정기 월이자 입금',
    status: '완료'
  },
  {
    id: 'TX-20261110-03',
    date: '2026-11-10',
    category: '주식',
    type: '매수',
    name: '현대차 (005380)',
    amount: 5200000,
    unitPrice: 260000,
    quantity: '20주',
    tax: 1250, // 매수 거래수수료
    settledAmount: 5201250,
    memo: '가치주 포트폴리오 추가 분할 매수',
    status: '완료'
  },
  {
    id: 'TX-20261105-04',
    date: '2026-11-05',
    category: '부동산',
    type: '이자',
    name: '강남 오피스텔 지분 투자',
    amount: 650000,
    unitPrice: null,
    quantity: '1개 호실 (지분 25%)',
    tax: 65000, // 원천징수/부가세
    settledAmount: 585000,
    memo: '11월 임대차 월세 배당 정산금',
    status: '완료'
  },
  {
    id: 'TX-20261028-05',
    date: '2026-10-28',
    category: '주식',
    type: '매도',
    name: 'SK하이닉스 (000660)',
    amount: 9800000,
    unitPrice: 196000,
    quantity: '50주',
    tax: 17640, // 증권거래세 및 수수료
    settledAmount: 9782360,
    memo: '목표가 달성 차익 실현 (수익률 28%)',
    status: '완료'
  },
  {
    id: 'TX-20261020-06',
    date: '2026-10-20',
    category: '예금',
    type: '매수',
    name: '신한 쏠편한 정기예금',
    amount: 20000000,
    unitPrice: null,
    quantity: '1년 만기 (연 3.85%)',
    tax: 0,
    settledAmount: 20000000,
    memo: '단기 여유자금 안정형 정기예금 신규 예치',
    status: '완료'
  },
  {
    id: 'TX-20261015-07',
    date: '2026-10-15',
    category: '부동산',
    type: '매수',
    name: '판교 오피스 공모 리츠',
    amount: 15000000,
    unitPrice: 5000,
    quantity: '3,000주',
    tax: 3000,
    settledAmount: 15003000,
    memo: '상업용 우량 오피스 지분 분산 투자',
    status: '완료'
  },
  {
    id: 'TX-20260930-08',
    date: '2026-09-30',
    category: '예금',
    type: '매도',
    name: '하나 하나의정기예금',
    amount: 10000000,
    unitPrice: null,
    quantity: '12개월 만기',
    tax: 0,
    settledAmount: 10000000,
    memo: '예금 만기 도래에 따른 원금 자동 해지 회수',
    status: '완료'
  },
  {
    id: 'TX-20260930-09',
    date: '2026-09-30',
    category: '예금',
    type: '이자',
    name: '하나 하나의정기예금',
    amount: 400000,
    unitPrice: null,
    quantity: '만기 이자 정산',
    tax: 61600, // 15.4%
    settledAmount: 338400,
    memo: '정기예금 만기 이자 수취',
    status: '완료'
  },
  {
    id: 'TX-20260915-10',
    date: '2026-09-15',
    category: '부동산',
    type: '매도',
    name: '마포 원룸 개발 펀드',
    amount: 30000000,
    unitPrice: null,
    quantity: '지분 청산',
    tax: 750000, // 양도/운용 청산세
    settledAmount: 29250000,
    memo: 'PF 사업장 준공 및 분양 완료에 따른 투자금 회수',
    status: '완료'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [includeTax, setIncludeTax] = useState(false); // 세금 포함/미포함 토글[cite: 1]
  const [darkMode, setDarkMode] = useState(false); // 다크 모드 토글[cite: 1]
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);
  const [selectedAssetPopup, setSelectedAssetPopup] = useState(null); // 그래프 클릭 Layer Popup[cite: 1]
  const [showShareModal, setShowShareModal] = useState(false); // 이미지 공유 모달[cite: 1]
  const [isAdminModal, setIsAdminModal] = useState(false); // 관리자 페이지 모달[cite: 1]
  const [showAddModal, setShowAddModal] = useState(false); // 새 자산 추가 모달[cite: 1]

  // 자산 목록 및 상세 원장 거래 내역 상태 관리
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [ledgerTransactions, setLedgerTransactions] = useState(INITIAL_LEDGER_TRANSACTIONS);

  // 새 자산 등록 모달 폼 상태
  const [newAssetCategory, setNewAssetCategory] = useState('주식');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetBuyPrice, setNewAssetBuyPrice] = useState('');
  const [newAssetEvalPrice, setNewAssetEvalPrice] = useState('');
  const [newAssetDate, setNewAssetDate] = useState(new Date().toISOString().split('T')[0]);

  // 목표 시뮬레이터 상태[cite: 1]
  const [targetAmount, setTargetAmount] = useState(300000000);
  const [monthlySave, setMonthlySave] = useState(2000000);
  const [years, setYears] = useState(5);

  // 상세 원장(Ledger) 필터 및 검색 상태
  const [ledgerCategory, setLedgerCategory] = useState('전체'); // '전체' | '주식' | '예금' | '부동산'
  const [ledgerType, setLedgerType] = useState('전체'); // '전체' | '매수' | '매도' | '이자/배당'
  const [ledgerSearch, setLedgerSearch] = useState('');

  // 새 자산 추가 핸들러
  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAssetName.trim()) {
      alert('자산명을 입력해 주세요.');
      return;
    }
    const buy = Number(newAssetBuyPrice);
    const evalPrice = Number(newAssetEvalPrice);
    if (isNaN(buy) || buy <= 0) {
      alert('올바른 매입금액을 입력해 주세요.');
      return;
    }
    if (isNaN(evalPrice) || evalPrice <= 0) {
      alert('올바른 현재 평가금액을 입력해 주세요.');
      return;
    }

    // 선택 날짜와 오늘 날짜 기준 D-day 계산
    let calculatedDDay = undefined;
    if (newAssetDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(newAssetDate);
      target.setHours(0, 0, 0, 0);
      const diffTime = target - today;
      calculatedDDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const taxRate = newAssetCategory === '주식' ? 0.22 : newAssetCategory === '예금' ? 0.154 : 0.30;

    const newAsset = {
      id: Date.now(),
      category: newAssetCategory,
      name: newAssetName.trim(),
      buyPrice: buy,
      evalPrice: evalPrice,
      marketPrice: evalPrice,
      taxRate: taxRate,
      targetDate: newAssetDate,
      dDay: newAssetCategory === '예금' ? calculatedDDay : undefined,
    };

    // 1. 자산 목록에 추가
    setAssets((prev) => [newAsset, ...prev]);

    // 2. 상세 원장 거래 내역에 '매수' 항목 자동 추가
    const newTxId = `TX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
    const newTx = {
      id: newTxId,
      date: newAssetDate || new Date().toISOString().split('T')[0],
      category: newAssetCategory,
      type: '매수',
      name: newAssetName.trim(),
      amount: buy,
      unitPrice: null,
      quantity: newAssetCategory === '예금' ? '정기 예치' : '신규 편입',
      tax: 0,
      settledAmount: buy,
      memo: `${newAssetCategory} 신규 자산 포트폴리오 편입 (매수)`,
      status: '완료',
    };
    setLedgerTransactions((prev) => [newTx, ...prev]);

    // 폼 초기화 및 모달 닫기
    setNewAssetName('');
    setNewAssetBuyPrice('');
    setNewAssetEvalPrice('');
    setNewAssetDate(new Date().toISOString().split('T')[0]);
    setShowAddModal(false);
  };

  // 세금 반영 여부에 따른 자산 계산[cite: 1]
  const calculatedAssets = assets.map((item) => {
    const rawProfit = item.evalPrice - item.buyPrice;
    const taxAmount = includeTax && rawProfit > 0 ? Math.round(rawProfit * item.taxRate) : 0;
    const finalEvalPrice = item.evalPrice - taxAmount;
    const profit = finalEvalPrice - item.buyPrice;
    const returnRate = ((profit / item.buyPrice) * 100).toFixed(2);
    return { ...item, finalEvalPrice, profit, returnRate, taxAmount };
  });

  // 최상단 포트폴리오 총합 지표 계산[cite: 1]
  const totalBuy = calculatedAssets.reduce((acc, cur) => acc + cur.buyPrice, 0);
  const totalEval = calculatedAssets.reduce((acc, cur) => acc + cur.finalEvalPrice, 0);
  const totalProfit = totalEval - totalBuy;
  const totalReturnRate = totalBuy > 0 ? ((totalProfit / totalBuy) * 100).toFixed(2) : '0.00';

  // 만기 임박 알람 필터링 (예금 중 D-3 ~ D-Day 범위)[cite: 1]
  const alarms = assets.filter((a) => {
    if (a.category !== '예금') return false;
    return typeof a.dDay === 'number' && a.dDay >= 0 && a.dDay <= 3;
  });

  // 목표 시뮬레이터 예상 달성 금액 계산 (연 5% 복리 가정)[cite: 1]
  const estimatedFutureValue = Math.round(
    totalEval * Math.pow(1.05, years) + monthlySave * 12 * ((Math.pow(1.05, years) - 1) / 0.05)
  );
  const achievementRate = Math.min(100, Math.round((estimatedFutureValue / targetAmount) * 100));

  // 차트 데이터[cite: 1]
  const chartData = calculatedAssets.map((a) => ({
    name: a.name,
    평가금액: Math.round(a.finalEvalPrice / 10000),
    시장가격: Math.round(a.marketPrice / 10000),
    raw: a,
  }));

  const formatWon = (num) => new Intl.NumberFormat('ko-KR').format(num) + '원';

  // 금융 캘린더 상태 관리
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 10, 1)); // 2026년 11월 기준
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-11-23');
  const [calendarEvents, setCalendarEvents] = useState(INITIAL_CALENDAR_EVENTS);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // 일정 직접 추가 폼 상태
  const [newEventName, setNewEventName] = useState('');
  const [newEventFlowType, setNewEventFlowType] = useState('income'); // 'income' | 'expense' | 'neutral'
  const [newEventCategory, setNewEventCategory] = useState('예금');
  const [newEventAmount, setNewEventAmount] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-11-23');
  const [newEventMemo, setNewEventMemo] = useState('');

  // 캘린더 월 이동 함수
  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };
  const goToday = () => {
    setCalendarDate(new Date(2026, 10, 1));
    setSelectedCalendarDate('2026-11-22');
  };

  // 자산 목록(assets) 기반 캘린더 실시간 연동 일정 생성
  const assetCalendarEvents = assets
    .filter((a) => a.targetDate)
    .map((a) => {
      let flowType = 'income';
      let amount = a.finalEvalPrice || a.evalPrice;
      let label = a.name;
      if (a.category === '예금') {
        label = `[만기] ${a.name}`;
        flowType = 'income';
      } else if (a.category === '주식') {
        label = `[배당락] ${a.name}`;
        flowType = 'neutral';
        amount = 0;
      } else if (a.category === '부동산') {
        label = `[정산] ${a.name}`;
        flowType = 'income';
      }
      return {
        id: `ASSET-EVT-${a.id}`,
        date: a.targetDate,
        name: label,
        category: a.category,
        flowType: flowType,
        amount: amount,
        memo: `${a.category} 보유 자산 일정 자동 연동`,
        isAsset: true,
      };
    });

  // 전체 통합 캘린더 이벤트 (사용자 직접 등록 일정 + 자산 연동 일정)
  const allCalendarEvents = [...calendarEvents, ...assetCalendarEvents];

  // 새 금융 일정 추가 핸들러
  const handleAddCalendarEvent = (e) => {
    e.preventDefault();
    if (!newEventName.trim()) {
      alert('일정명을 입력해 주세요.');
      return;
    }
    const amt = newEventFlowType === 'neutral' ? 0 : Number(newEventAmount);
    if (newEventFlowType !== 'neutral' && (isNaN(amt) || amt < 0)) {
      alert('올바른 금액을 입력해 주세요.');
      return;
    }

    const newEvt = {
      id: `CE-${Date.now()}`,
      date: newEventDate,
      name: newEventName.trim(),
      category: newEventCategory,
      flowType: newEventFlowType,
      amount: amt,
      memo: newEventMemo.trim() || `${newEventCategory} 금융 일정`,
    };

    setCalendarEvents((prev) => [...prev, newEvt]);
    setSelectedCalendarDate(newEventDate);
    setNewEventName('');
    setNewEventAmount('');
    setNewEventMemo('');
    setShowAddEventModal(false);
  };

  // 캘린더 날짜 계산
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth(); // 0-based
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0(일) ~ 6(토)
  const lastDayDate = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonthLastDate = new Date(calYear, calMonth, 0).getDate();

  // 월간 총 예상 유입 / 유출 통계 계산 (해당 월 YYYY-MM)
  const currentMonthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
  const currentMonthEvents = allCalendarEvents.filter((ev) => ev.date && ev.date.startsWith(currentMonthPrefix));
  const monthTotalIncome = currentMonthEvents
    .filter((ev) => ev.flowType === 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);
  const monthTotalExpense = currentMonthEvents
    .filter((ev) => ev.flowType === 'expense')
    .reduce((acc, cur) => acc + cur.amount, 0);
  const monthNetFlow = monthTotalIncome - monthTotalExpense;

  // 선택된 날짜의 이벤트 목록
  const selectedDateEvents = allCalendarEvents.filter((ev) => ev.date === selectedCalendarDate);

  // 상세 원장(Ledger) 필터링 및 통계 계산 로직
  const filteredTransactions = ledgerTransactions.filter((tx) => {
    // 자산 카테고리 필터 (전체 / 주식 / 예금 / 부동산)
    if (ledgerCategory !== '전체' && tx.category !== ledgerCategory) {
      return false;
    }
    // 거래 유형 필터 (전체 / 매수 / 매도 / 이자·배당)
    if (ledgerType === '이자/배당') {
      if (tx.type !== '이자' && tx.type !== '배당') return false;
    } else if (ledgerType !== '전체' && tx.type !== ledgerType) {
      return false;
    }
    // 검색어 필터 (종목/상품명, 메모, 거래ID)
    if (ledgerSearch.trim() !== '') {
      const q = ledgerSearch.trim().toLowerCase();
      const matchName = tx.name.toLowerCase().includes(q);
      const matchMemo = tx.memo.toLowerCase().includes(q);
      const matchId = tx.id.toLowerCase().includes(q);
      if (!matchName && !matchMemo && !matchId) return false;
    }
    return true;
  });

  // 상세 원장 집계 지표
  const ledgerBuyTotal = filteredTransactions
    .filter((tx) => tx.type === '매수')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const ledgerSellTotal = filteredTransactions
    .filter((tx) => tx.type === '매도')
    .reduce((acc, cur) => acc + (includeTax ? cur.settledAmount : cur.amount), 0);

  const ledgerIncomeTotal = filteredTransactions
    .filter((tx) => tx.type === '이자' || tx.type === '배당')
    .reduce((acc, cur) => acc + (includeTax ? cur.settledAmount : cur.amount), 0);

  const ledgerTaxTotal = filteredTransactions
    .reduce((acc, cur) => acc + cur.tax, 0);

  // 포트폴리오 리밸런싱 목표 비중 상태 (%)
  const [targetRatios, setTargetRatios] = useState({
    주식: 40,
    예금: 40,
    부동산: 20,
  });

  // 자산군별 현재 평가금액 계산
  const stockEval = calculatedAssets.filter((a) => a.category === '주식').reduce((acc, cur) => acc + cur.finalEvalPrice, 0);
  const depositEval = calculatedAssets.filter((a) => a.category === '예금').reduce((acc, cur) => acc + cur.finalEvalPrice, 0);
  const realEstateEval = calculatedAssets.filter((a) => a.category === '부동산').reduce((acc, cur) => acc + cur.finalEvalPrice, 0);

  const stockRatio = totalEval > 0 ? (stockEval / totalEval) * 100 : 0;
  const depositRatio = totalEval > 0 ? (depositEval / totalEval) * 100 : 0;
  const realEstateRatio = totalEval > 0 ? (realEstateEval / totalEval) * 100 : 0;

  // 목표 비중 총합
  const totalTargetRatio = targetRatios.주식 + targetRatios.예금 + targetRatios.부동산;

  // 각 자산군별 리밸런싱 진단 데이터
  const rebalancingData = [
    {
      category: '주식',
      currentEval: stockEval,
      currentRatio: Number(stockRatio.toFixed(1)),
      targetRatio: targetRatios.주식,
      targetEval: Math.round(totalEval * (targetRatios.주식 / 100)),
      gapAmount: stockEval - Math.round(totalEval * (targetRatios.주식 / 100)),
      gapRatio: Number((stockRatio - targetRatios.주식).toFixed(1)),
      color: '#8b5cf6',
    },
    {
      category: '예금',
      currentEval: depositEval,
      currentRatio: Number(depositRatio.toFixed(1)),
      targetRatio: targetRatios.예금,
      targetEval: Math.round(totalEval * (targetRatios.예금 / 100)),
      gapAmount: depositEval - Math.round(totalEval * (targetRatios.예금 / 100)),
      gapRatio: Number((depositRatio - targetRatios.예금).toFixed(1)),
      color: '#f59e0b',
    },
    {
      category: '부동산',
      currentEval: realEstateEval,
      currentRatio: Number(realEstateRatio.toFixed(1)),
      targetRatio: targetRatios.부동산,
      targetEval: Math.round(totalEval * (targetRatios.부동산 / 100)),
      gapAmount: realEstateEval - Math.round(totalEval * (targetRatios.부동산 / 100)),
      gapRatio: Number((realEstateRatio - targetRatios.부동산).toFixed(1)),
      color: '#14b8a6',
    },
  ];

  // 리밸런싱 필요 여부 판정 (편차 절대값 5% 이상)
  const needsRebalancing = rebalancingData.some((item) => Math.abs(item.gapRatio) >= 5);
  const maxGapItem = [...rebalancingData].sort((a, b) => Math.abs(b.gapRatio) - Math.abs(a.gapRatio))[0];
  const totalAdjustAmount = Math.round(rebalancingData.reduce((acc, cur) => acc + Math.abs(cur.gapAmount), 0) / 2);

  // 리밸런싱 비교 차트 데이터
  const rebalancingChartData = rebalancingData.map((d) => ({
    name: d.category,
    '현재 비중(%)': d.currentRatio,
    '목표 비중(%)': d.targetRatio,
  }));

  // 복리 기반 목표 달성 시뮬레이터 전용 상태
  const [simTargetAmount, setSimTargetAmount] = useState(500000000); // 기본 목표: 5억원
  const [simMonthlySave, setSimMonthlySave] = useState(2000000);   // 기본 월 저축: 200만원
  const [simYears, setSimYears] = useState(10);                   // 기본 기간: 10년
  const [simAnnualRate, setSimAnnualRate] = useState(7.0);        // 기본 연 수익률: 7.0%
  const [customInitialAmount, setCustomInitialAmount] = useState(null); // null이면 totalEval 실시간 연동

  const effectiveInitialAmount = customInitialAmount !== null ? customInitialAmount : totalEval;
  const simMonthlyRate = (simAnnualRate / 100) / 12;

  // 연도별 복리 성장 곡선 데이터셋 생성 (월복리 산식)
  const simCurveData = [];
  let targetReachedYear = null;

  for (let y = 0; y <= simYears; y++) {
    const m = y * 12;
    let futureVal = effectiveInitialAmount;
    if (simMonthlyRate > 0) {
      futureVal = Math.round(
        effectiveInitialAmount * Math.pow(1 + simMonthlyRate, m) +
        (m > 0 ? simMonthlySave * ((Math.pow(1 + simMonthlyRate, m) - 1) / simMonthlyRate) : 0)
      );
    } else {
      futureVal = Math.round(effectiveInitialAmount + simMonthlySave * m);
    }
    const totalContributed = Math.round(effectiveInitialAmount + simMonthlySave * m);
    const compoundProfit = Math.max(0, futureVal - totalContributed);

    if (y > 0 && futureVal >= simTargetAmount && targetReachedYear === null) {
      targetReachedYear = y;
    }

    simCurveData.push({
      yearLabel: y === 0 ? '시작' : `${y}년후`,
      year: y,
      '총 납입원금': Math.round(totalContributed / 10000), // 만원 단위
      '복리 평가자산': Math.round(futureVal / 10000),     // 만원 단위
      rawContributed: totalContributed,
      rawFutureValue: futureVal,
      rawCompoundProfit: compoundProfit,
    });
  }

  const finalSimPoint = simCurveData[simCurveData.length - 1];
  const finalFutureValue = finalSimPoint ? finalSimPoint.rawFutureValue : 0;
  const finalContributed = finalSimPoint ? finalSimPoint.rawContributed : 0;
  const finalCompoundProfit = finalSimPoint ? finalSimPoint.rawCompoundProfit : 0;
  const simAchievementRate = simTargetAmount > 0 ? Math.min(300, Math.round((finalFutureValue / simTargetAmount) * 100)) : 0;
  const compoundProfitRatio = finalFutureValue > 0 ? Math.round((finalCompoundProfit / finalFutureValue) * 100) : 0;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 좌측 사이드바 메뉴[cite: 1] */}
      <aside className={`w-64 border-r p-5 flex flex-col justify-between hidden md:flex ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600 mb-8">
            <Wallet className="w-7 h-7" />
            <span>FinMaster Pro</span>
          </div>
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: '대시보드', icon: TrendingUp },
              { id: 'ledger', label: '상세 원장', icon: Wallet },
              { id: 'calendar', label: '금융 캘린더', icon: Calendar },
              { id: 'rebalancing', label: '리밸런싱', icon: PieChart },
              { id: 'simulator', label: '목표 시뮬레이터', icon: Sliders },
              { id: 'settings', label: '설정', icon: Settings },
            ].map((menu) => {
              const Icon = menu.icon;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveTab(menu.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === menu.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {menu.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 하단 유틸리티 버튼[cite: 1] */}
        <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> 새 자산 추가
          </button>
          <button
            onClick={() => alert('자산 장부 데이터가 Excel(.csv) 파일로 다운로드됩니다.')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition"
          >
            <Download className="w-4 h-4 text-blue-600" /> 엑셀 내보내기
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-medium"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            {darkMode ? '라이트 모드 전환' : '다크 모드 전환'}
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 상단 내비게이션 바[cite: 1] */}
        <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">통합 재정관리 플랫폼</h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">실시간 연동중</span>
          </div>

          <div className="flex items-center gap-4">
            {/* 세금 포함/미포함 토글 스위치[cite: 1] */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
              <span className="text-xs font-medium">{includeTax ? '세후(세금 차감)' : '세전(세금 미포함)'}</span>
              <button
                onClick={() => setIncludeTax(!includeTax)}
                className={`w-10 h-5 rounded-full transition p-0.5 ${includeTax ? 'bg-blue-600' : 'bg-slate-400'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${includeTax ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* 만기 임박 알람 센터 아이콘[cite: 1] */}
            <div className="relative">
              <button
                onClick={() => setShowAlarmMenu(!showAlarmMenu)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 relative"
              >
                <Bell className="w-5 h-5" />
                {(alarms.length + (needsRebalancing ? 1 : 0)) > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {alarms.length + (needsRebalancing ? 1 : 0)}
                  </span>
                )}
              </button>

              {showAlarmMenu && (
                <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border p-4 z-30 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm">알림 센터</span>
                    <button onClick={() => setShowAlarmMenu(false)}><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2">
                    {needsRebalancing && (
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 text-xs">
                        <div className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1">
                          <Scale className="w-4 h-4" /> 자산 비중 리밸런싱 권고!
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                          목표 비중 대비 <strong>{maxGapItem.category}</strong> 자산 편차가 {maxGapItem.gapRatio > 0 ? `+${maxGapItem.gapRatio}` : maxGapItem.gapRatio}%p 발생했습니다.
                        </p>
                      </div>
                    )}
                    {alarms.map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-xs">
                        <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <ShieldAlert className="w-4 h-4" /> 예금 만기 {a.dDay === 0 ? '당일(D-Day)' : `${a.dDay}일 전`} 알림!
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                          <strong>{a.name}</strong> 상품이 {a.dDay === 0 ? '오늘' : `${a.dDay}일 후`} 만기됩니다. 재예치 금리를 확인하세요.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 관리자페이지 입장 버튼[cite: 1] */}
            <button
              onClick={() => setIsAdminModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-white dark:bg-blue-600 text-xs font-semibold hover:opacity-90 transition"
            >
              관리자페이지 입장
            </button>
          </div>
        </header>

        {/* 본문 콘텐츠 (선택된 탭에 따른 분기) */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {/* 1. 대시보드 탭 */}
            {activeTab === 'dashboard' && (
              <>
                {/* 1. 최상단 핵심 지표 카드 & 이미지 공유하기 버튼[cite: 1] */}
                <section className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
                    <div>
                      <h2 className="text-base font-bold">포트폴리오 핵심 요약</h2>
                      <p className="text-xs text-slate-500">기준: {includeTax ? '예상 세금 차감 후 순수익 기준' : '세전 평가금액 기준'}</p>
                    </div>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
                    >
                      <Share2 className="w-4 h-4" /> 이미지 공유하기
                    </button>
                  </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <span className="text-xs text-slate-500">총 매입금액</span>
                            <div className="text-xl font-bold mt-1">{formatWon(totalBuy)}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <span className="text-xs text-slate-500">총 평가금액</span>
                            <div className="text-xl font-bold mt-1 text-blue-600">{formatWon(totalEval)}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <span className="text-xs text-slate-500">총 평가 손익</span>
                            <div className="text-xl font-bold mt-1 text-emerald-600">+{formatWon(totalProfit)}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-blue-600 text-white">
                            <span className="text-xs text-blue-100">총 포트폴리오 수익률</span>
                            <div className="text-2xl font-extrabold mt-1 flex items-center gap-1">
                              +{totalReturnRate}% <ArrowUpRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 2. 자산별 성과 요약 테이블 & 평가금액 vs 시장가격 비교 그래프[cite: 1] */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 자산 형태별 성과 요약 테이블[cite: 1] */}
                        <section className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-base">자산별 성과 요약</h3>
                            <button
                              onClick={() => setShowAddModal(true)}
                              className="text-xs flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                            >
                              <Plus className="w-3.5 h-3.5" /> 새 자산 추가
                            </button>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                                  <th className="py-2.5">자산구분 / 종목명</th>
                                  <th className="py-2.5 text-right">매입금액</th>
                                  <th className="py-2.5 text-right">평가금액</th>
                                  <th className="py-2.5 text-right">수익률</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {calculatedAssets.map((item) => (
                                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                                    <td className="py-3">
                                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-medium mr-2">
                                        {item.category}
                                      </span>
                                      <span className="font-semibold">{item.name}</span>
                                    </td>
                                    <td className="py-3 text-right text-slate-500">{formatWon(item.buyPrice)}</td>
                                    <td className="py-3 text-right font-semibold">{formatWon(item.finalEvalPrice)}</td>
                                    <td className="py-3 text-right font-bold text-emerald-600">+{item.returnRate}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </section>

                        {/* 평가금액 vs 시장가격 비교 그래프 (클릭 시 Layer Popup)[cite: 1] */}
                        <section className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="font-bold text-base">평가금액 vs 시장가격 비교</h3>
                              <p className="text-xs text-slate-500">그래프 막대를 클릭하면 상세 분석 팝업이 열립니다 (단위: 만원)</p>
                            </div>
                            <Info className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={chartData}
                                onClick={(data) => {
                                  if (data && data.activePayload && data.activePayload[0]) {
                                    setSelectedAssetPopup(data.activePayload[0].payload.raw);
                                  }
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="평가금액" fill="#2563eb" radius={[4, 4, 0, 0]} cursor="pointer" />
                                <Bar dataKey="시장가격" fill="#10b981" radius={[4, 4, 0, 0]} cursor="pointer" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </section>
                      </div>

              {/* 3. 하단 스마트 자산 배분 리포트 & 오늘 가장 이자가 높은 은행 추천 & 목표 시뮬레이터[cite: 1] */ }
                            < div className = "grid grid-cols-1 lg:grid-cols-3 gap-6" >
                            {/* 오늘 가장 이자가 높은 은행 추천[cite: 1] */ }
                            < section className = {`lg:col-span-2 p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-blue-600" />
                              <h3 className="font-bold text-base">스마트 자산 배분 리포트 & 오늘 가장 이자가 높은 은행 추천</h3>
                            </div>
                            <span className="text-xs text-blue-600 font-semibold">금리 실시간 비교</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-800 dark:text-blue-200 mb-4">
                            💡 <strong>AI 진단:</strong> 현재 예금 만기 도래 예정 금액(5,000만원)을 아래 최고금리 상품으로 갈아탈 경우 연간 약 <strong>32만원의 추가 이자 수익</strong>이 기대됩니다.
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {TOP_BANKS.map((bank) => (
                              <div key={bank.rank} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{bank.tag}</span>
                                  <span className="text-xs text-slate-400">{bank.type}</span>
                                </div>
                                <div className="font-bold text-sm">{bank.bank}</div>
                                <div className="text-xs text-slate-500 mb-3">{bank.product}</div>
                                <div className="text-xl font-extrabold text-blue-600">연 {bank.rate}</div>
                              </div>
                            ))}
                    </div>
                  </section>

                  {/* 인터랙티브 목표 달성 시뮬레이터[cite: 1] */}
                  <section className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-bold text-base mb-1">목표 달성 시뮬레이터</h3>
                    <p className="text-xs text-slate-500 mb-4">연평균 5% 복리 수익률 기준 예측</p>

                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>목표 자산</span>
                          <strong className="text-blue-600">{formatWon(targetAmount)}</strong>
                        </div>
                        <input
                          type="range" min="100000000" max="1000000000" step="50000000"
                          value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>월 추가 저축액</span>
                          <strong>{formatWon(monthlySave)}</strong>
                        </div>
                        <input
                          type="range" min="500000" max="10000000" step="500000"
                          value={monthlySave} onChange={(e) => setMonthlySave(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>투자 기간</span>
                          <strong>{years}년 후</strong>
                        </div>
                        <input
                          type="range" min="1" max="20" step="1"
                          value={years} onChange={(e) => setYears(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    <div className="mt-5 p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{years}년 후 예상 자산</span>
                        <span className="font-bold text-emerald-600">달성률 {achievementRate}%</span>
                      </div>
                      <div className="text-lg font-extrabold">{formatWon(estimatedFutureValue)}</div>
                    </div>
                  </section>
                </div>
          </>
          )}

              {/* 2. 상세 원장(Ledger) 탭 */}
              {activeTab === 'ledger' && (
                <div className="space-y-6">
                  {/* 상단 타이틀 & 엑셀 내보내기/거래추가 */}
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-blue-600" /> 상세 거래 원장
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        주식 매수·매도 및 배당, 예금 가입·해지 및 이자, 부동산 투자 및 임대료 정산 내역을 통합 조회합니다.
                      </p>
                    </div>
                <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert('상세 원장 데이터가 Excel(.csv) 파일로 내보내기 되었습니다.')}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                    <Download className="w-3.5 h-3.5 text-blue-600" /> 원장 엑셀 다운로드
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> 새 자산 추가
                  </button>
                </div>
              </div>

              {/* 상세 원장 핵심 통계 요약 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>누적 매수/투자 총액</span>
                    <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600">지출/투자</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{formatWon(ledgerBuyTotal)}</div>
                  <p className="text-[11px] text-slate-400 mt-1">주식 매입, 예금 예치, 부동산 투자금</p>
                </div>

                <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>누적 매도/회수 총액</span>
                    <span className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">원금회수</span>
                  </div>
                  <div className="text-xl font-bold">{formatWon(ledgerSellTotal)}</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {includeTax ? '예상 세금/수수료 차감 후 실 수령액' : '세전 총 매도/해지 금액'}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>이자 및 배당 수취액</span>
                    <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600">현금흐름</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-600">+{formatWon(ledgerIncomeTotal)}</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {includeTax ? '배당소득세(15.4%) 차감 후 순입금' : '세전 총 배당·이자 발생액'}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>조회 건수 / 원천세</span>
                    <span className="p-1 rounded bg-amber-50 dark:bg-amber-900/40 text-amber-600">통계</span>
                  </div>
                  <div className="text-xl font-bold">{filteredTransactions.length}건</div>
                  <p className="text-[11px] text-slate-400 mt-1">원천징수 및 거래세: {formatWon(ledgerTaxTotal)}</p>
                </div>
              </div>

                      {/* 자산별 필터 & 거래유형 필터 & 검색 필터 카드 */}
                      <section className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} space-y-4`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* 자산 분류 필터 버튼 그룹 */}
                          <div>
                            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                              <Filter className="w-3.5 h-3.5 text-blue-600" /> 자산 구분 필터
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {['전체', '주식', '예금', '부동산'].map((cat) => {
                                const count = cat === '전체'
                                  ? ledgerTransactions.length
                                  : ledgerTransactions.filter((t) => t.category === cat).length;
                                return (
                                  <button
                                    key={cat}
                                    onClick={() => setLedgerCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${ledgerCategory === cat
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : darkMode
                                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      }`}
                                  >
                                    <span>{cat}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${ledgerCategory === cat
                                        ? 'bg-blue-700 text-white'
                                        : darkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
                                      }`}>
                                      {count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                              {/* 거래 유형 필터 버튼 그룹 */}
                              <div>
                                <div className="text-xs font-semibold text-slate-500 mb-2">거래 유형 필터</div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {['전체', '매수', '매도', '이자/배당'].map((type) => (
                                    <button
                                      key={type}
                                      onClick={() => setLedgerType(type)}
                                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${ledgerType === type
                                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                                          : darkMode
                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                                {/* 검색 바 및 필터 리셋 */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                                  <div className="relative w-full sm:w-96">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                      type="text"
                                      placeholder="종목명, 상품명, 비고, 거래ID 검색..."
                                      value={ledgerSearch}
                                      onChange={(e) => setLedgerSearch(e.target.value)}
                                      className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                          ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                        }`}
                                    />
                                    {ledgerSearch && (
                                      <button
                                        onClick={() => setLedgerSearch('')}
                                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>

                                  {(ledgerCategory !== '전체' || ledgerType !== '전체' || ledgerSearch !== '') && (
                                    <button
                                      onClick={() => {
                                        setLedgerCategory('전체');
                                        setLedgerType('전체');
                                        setLedgerSearch('');
                                      }}
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" /> 필터 초기화
                                    </button>
                                  )}
                                </div>
                                </section>

                                {/* 상세 거래 내역 테이블 */}
                                <section className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                      <thead>
                                        <tr className={`border-b text-slate-500 font-semibold ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                          <th className="py-3 px-4">거래일시 / ID</th>
                                          <th className="py-3 px-3">자산구분</th>
                                          <th className="py-3 px-3">거래유형</th>
                                          <th className="py-3 px-4">종목 및 상품명</th>
                                          <th className="py-3 px-4 text-right">수량 / 상세조건</th>
                                          <th className="py-3 px-4 text-right">거래금액</th>
                                          <th className="py-3 px-4 text-right">세금 / 수수료</th>
                                          <th className="py-3 px-4 text-right">실 정산금액</th>
                                          <th className="py-3 px-4">적요 및 비고</th>
                                          <th className="py-3 px-3 text-center">상태</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                        {filteredTransactions.length === 0 ? (
                                          <tr>
                                            <td colSpan="10" className="py-12 text-center text-slate-400">
                                              <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                              <p className="font-semibold text-sm">해당 조건에 맞는 거래 내역이 없습니다.</p>
                                              <p className="text-xs mt-1">자산 구분 필터 또는 검색어를 변경해 보세요.</p>
                                            </td>
                                          </tr>
                                        ) : (
                                          filteredTransactions.map((tx) => {
                                            // 자산 카테고리별 뱃지 스타일
                                            let categoryBadgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
                                            if (tx.category === '주식') {
                                              categoryBadgeClass = 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
                                            } else if (tx.category === '예금') {
                                              categoryBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
                                            } else if (tx.category === '부동산') {
                                              categoryBadgeClass = 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800';
                                            }

                                            // 거래 유형별 뱃지 및 금액 스타일
                                            let typeBadgeClass = 'bg-slate-100 text-slate-700';
                                            let amountClass = 'font-semibold text-slate-900 dark:text-slate-100';
                                            let amountPrefix = '';

                                            if (tx.type === '매수') {
                                              typeBadgeClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold';
                                              amountClass = 'font-bold text-blue-600 dark:text-blue-400';
                                              amountPrefix = '-';
                                            } else if (tx.type === '매도') {
                                              typeBadgeClass = 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 font-bold';
                                              amountClass = 'font-bold text-slate-900 dark:text-slate-100';
                                              amountPrefix = '+';
                                            } else if (tx.type === '이자' || tx.type === '배당') {
                                              typeBadgeClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 font-bold';
                                              amountClass = 'font-bold text-emerald-600 dark:text-emerald-400';
                                              amountPrefix = '+';
                                            }

                                            const displaySettled = includeTax ? tx.settledAmount : tx.amount;

                                            return (
                                              <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                                                {/* 거래일시 & ID */}
                                                <td className="py-3 px-4">
                                                  <div className="font-semibold">{tx.date}</div>
                                                  <div className="text-[10px] text-slate-400 font-mono">{tx.id}</div>
                                                </td>

                                                {/* 자산구분 */}
                                                <td className="py-3 px-3">
                                                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${categoryBadgeClass}`}>
                                                    {tx.category}
                                                  </span>
                                                </td>

                                                {/* 거래유형 */}
                                                <td className="py-3 px-3">
                                                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${typeBadgeClass}`}>
                                                    {tx.type}
                                                  </span>
                                                </td>

                                                {/* 종목 및 상품명 */}
                                                <td className="py-3 px-4">
                                                  <div className="font-semibold text-sm">{tx.name}</div>
                                                  {tx.unitPrice && (
                                                    <div className="text-[11px] text-slate-400">
                                                      단가: {formatWon(tx.unitPrice)}
                                                    </div>
                                                  )}
                                                </td>

                                                {/* 수량 / 상세조건 */}
                                                <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-300 font-medium">
                                                  {tx.quantity || '-'}
                                                </td>

                                                {/* 거래금액 */}
                                                <td className="py-3 px-4 text-right font-semibold">
                                                  {formatWon(tx.amount)}
                                                </td>

                                                {/* 세금 / 수수료 */}
                                                <td className="py-3 px-4 text-right">
                                                  {tx.tax > 0 ? (
                                                    <span className="text-rose-500 font-medium">-{formatWon(tx.tax)}</span>
                                                  ) : (
                                                    <span className="text-slate-400">비과세</span>
                                                  )}
                                                </td>

                                                {/* 실 정산금액 */}
                                                <td className={`py-3 px-4 text-right ${amountClass}`}>
                                                  {amountPrefix}{formatWon(displaySettled)}
                                                </td>

                                                {/* 비고 / 메모 */}
                                                <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={tx.memo}>
                                                  {tx.memo}
                                                </td>

                                                {/* 상태 */}
                                                <td className="py-3 px-3 text-center">
                                                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                                                    <CheckCircle2 className="w-3 h-3" /> {tx.status}
                                                  </span>
                                                </td>
                                              </tr>
                                            );
                                          })
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* 하단 요약 카운터 바 */}
                                  <div className={`px-4 py-3 border-t flex flex-wrap items-center justify-between text-xs text-slate-500 ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <span>
                                      총 <strong>{filteredTransactions.length}</strong>건의 내역이 표시 중입니다.
                                      {includeTax && <span className="text-blue-600 ml-2">(세후 정산금액 적용 중)</span>}
                                    </span>
                                    <span>
                                      정렬 기준: 최신 거래일자 순
                                    </span>
                                  </div>
                                </section>
                              </div>
          )}

                              {/* 3. 금융 캘린더(Calendar) 탭 */}
                              {activeTab === 'calendar' && (
                                <div className="space-y-6">
                                  {/* 상단 타이틀 & 조작 바 */}
                                  <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                      <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Calendar className="w-6 h-6 text-blue-600" /> 금융 캘린더 & 현금흐름 스케줄러
                                      </h2>
                                      <p className="text-xs text-slate-500 mt-1">
                                        보유 자산의 예금 만기일, 주식 배당락일, 이자 수취일 및 정기 지출 일정을 실시간 통합 조회합니다.
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
                                        <button
                                          onClick={prevMonth}
                                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                                          title="이전 달"
                                        >
                                          <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="px-3 text-xs font-bold min-w-24 text-center">
                                          {calYear}년 {calMonth + 1}월
                                        </span>
                                        <button
                                          onClick={nextMonth}
                                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                                          title="다음 달"
                                        >
                                          <ChevronRight className="w-4 h-4" />
                                        </button>
                                      </div>

                                      <button
                                        onClick={goToday}
                                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
                                      >
                                        오늘
                                      </button>

                                      <button
                                        onClick={() => {
                                          setNewEventDate(selectedCalendarDate);
                                          setShowAddEventModal(true);
                                        }}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> 새 일정 추가
                                      </button>
                                    </div>
                                  </div>

                                  {/* 월간 현금흐름 요약 지표 카드 */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>{calMonth + 1}월 예상 유입액</span>
                                        <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600">입금/만기</span>
                                      </div>
                                      <div className="text-xl font-bold text-emerald-600">+{formatWon(monthTotalIncome)}</div>
                                      <p className="text-[11px] text-slate-400 mt-1">예금 만기, 배당금, 이자, 월세 수취</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>{calMonth + 1}월 예상 유출액</span>
                                        <span className="p-1 rounded bg-rose-50 dark:bg-rose-900/40 text-rose-600">지출/납입</span>
                                      </div>
                                      <div className="text-xl font-bold text-rose-500">-{formatWon(monthTotalExpense)}</div>
                                      <p className="text-[11px] text-slate-400 mt-1">카드 대금, 대출 이자, 정기 저축</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>{calMonth + 1}월 순 현금흐름</span>
                                        <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600">정산</span>
                                      </div>
                                      <div className={`text-xl font-bold ${monthNetFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-500'}`}>
                                        {monthNetFlow >= 0 ? '+' : ''}{formatWon(monthNetFlow)}
                                      </div>
                                      <p className="text-[11px] text-slate-400 mt-1">예상 유입액 - 예상 유출액</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>{calMonth + 1}월 금융 이벤트</span>
                                        <span className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">건수</span>
                                      </div>
                                      <div className="text-xl font-bold">{currentMonthEvents.length}건</div>
                                      <p className="text-[11px] text-slate-400 mt-1">자산 연동 일정 및 사용자 등록 일정</p>
                                    </div>
                                  </div>

                                  {/* 메인 2단 레이아웃 (월간 캘린더 그리드 + 선택 일자 상세 패널) */}
                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* 1. 월간 캘린더 그리드 (2열 분량) */}
                                    <div className={`lg:col-span-2 p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      {/* 요일 헤더 */}
                                      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs mb-2">
                                        <span className="text-rose-500 py-1">일</span>
                                        <span className="text-slate-600 dark:text-slate-400 py-1">월</span>
                                        <span className="text-slate-600 dark:text-slate-400 py-1">화</span>
                                        <span className="text-slate-600 dark:text-slate-400 py-1">수</span>
                                        <span className="text-slate-600 dark:text-slate-400 py-1">목</span>
                                        <span className="text-slate-600 dark:text-slate-400 py-1">금</span>
                                        <span className="text-blue-500 py-1">토</span>
                                      </div>

                                      {/* 날짜 그리드 */}
                                      <div className="grid grid-cols-7 gap-1">
                                        {/* 이전 달 날짜들 */}
                                        {Array.from({ length: firstDayIndex }).map((_, idx) => {
                                          const dayNum = prevMonthLastDate - firstDayIndex + 1 + idx;
                                          return (
                                            <div
                                              key={`prev-${idx}`}
                                              className="min-h-24 p-1.5 rounded-xl border border-transparent opacity-30 text-xs select-none"
                                            >
                                              <span className="font-semibold text-slate-400">{dayNum}</span>
                                            </div>
                                          );
                                        })}

                                        {/* 당월 날짜들 */}
                                        {Array.from({ length: lastDayDate }).map((_, idx) => {
                                          const dayNum = idx + 1;
                                          const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                          const isToday = dateStr === '2026-11-22';
                                          const isSelected = dateStr === selectedCalendarDate;
                                          const dayOfWeek = (firstDayIndex + idx) % 7;
                                          const isSunday = dayOfWeek === 0;
                                          const isSaturday = dayOfWeek === 6;

                                          // 해당 날짜 이벤트 필터링
                                          const dayEvts = allCalendarEvents.filter((e) => e.date === dateStr);

                                          return (
                                            <div
                                              key={`current-${dayNum}`}
                                              onClick={() => setSelectedCalendarDate(dateStr)}
                                              className={`min-h-24 p-1.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                                isSelected
                                                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 ring-2 ring-blue-500/40 shadow-sm'
                                                  : darkMode
                                                  ? 'border-slate-700/80 bg-slate-800/60 hover:bg-slate-700/50'
                                                  : 'border-slate-100 bg-white hover:bg-slate-50'
                                              }`}
                                            >
                                              <div className="flex justify-between items-center">
                                                <span
                                                  className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                                                    isToday
                                                      ? 'bg-blue-600 text-white'
                                                      : isSunday
                                                      ? 'text-rose-500'
                                                      : isSaturday
                                                      ? 'text-blue-500'
                                                      : 'text-slate-700 dark:text-slate-200'
                                                  }`}
                                                >
                                                  {dayNum}
                                                </span>
                                                {dayEvts.length > 0 && (
                                                  <span className="text-[10px] font-bold text-slate-400">
                                                    {dayEvts.length}건
                                                  </span>
                                                )}
                                              </div>

                                              {/* 일정 요약 뱃지 목록 */}
                                              <div className="space-y-1 my-1">
                                                {dayEvts.slice(0, 2).map((ev) => {
                                                  let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
                                                  if (ev.category === '예금' || ev.name.includes('[만기]')) {
                                                    badgeStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200/60';
                                                  } else if (ev.flowType === 'income') {
                                                    badgeStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200/60';
                                                  } else if (ev.flowType === 'expense') {
                                                    badgeStyle = 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border border-rose-200/60';
                                                  } else if (ev.flowType === 'neutral') {
                                                    badgeStyle = 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200/60';
                                                  }

                                                  return (
                                                    <div
                                                      key={ev.id}
                                                      className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${badgeStyle}`}
                                                      title={`${ev.name} (${formatWon(ev.amount)})`}
                                                    >
                                                      {ev.name}
                                                    </div>
                                                  );
                                                })}
                                                {dayEvts.length > 2 && (
                                                  <div className="text-[9px] text-slate-400 font-bold px-1">
                                                    +{dayEvts.length - 2}개 더보기
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}

                                        {/* 다음 달 날짜 채우기 */}
                                        {(() => {
                                          const totalCells = firstDayIndex + lastDayDate;
                                          const nextDaysCount = (7 - (totalCells % 7)) % 7;
                                          return Array.from({ length: nextDaysCount }).map((_, idx) => (
                                            <div
                                              key={`next-${idx}`}
                                              className="min-h-24 p-1.5 rounded-xl border border-transparent opacity-30 text-xs select-none"
                                            >
                                              <span className="font-semibold text-slate-400">{idx + 1}</span>
                                            </div>
                                          ));
                                        })()}
                                      </div>
                                    </div>

                                    {/* 2. 우측 선택 일자 상세 현금흐름 & 신규 일정 등록 패널 */}
                                    <div className="space-y-4">
                                      {/* 선택 일자 헤더 카드 */}
                                      <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                          <div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                                              <Clock className="w-3.5 h-3.5 text-blue-600" /> 일자별 상세 일정
                                            </div>
                                            <h3 className="text-lg font-bold mt-0.5">
                                              {selectedCalendarDate}
                                            </h3>
                                          </div>
                                          <button
                                            onClick={() => {
                                              setNewEventDate(selectedCalendarDate);
                                              setShowAddEventModal(true);
                                            }}
                                            className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                          >
                                            <Plus className="w-3.5 h-3.5" /> 일정 추가
                                          </button>
                                        </div>

                                        {/* 선택 날짜의 일정 목록 */}
                                        <div className="space-y-2.5">
                                          {selectedDateEvents.length === 0 ? (
                                            <div className="py-10 text-center text-slate-400">
                                              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                              <p className="font-medium text-xs">예정된 금융 일정이 없습니다.</p>
                                              <p className="text-[11px] mt-1 text-slate-400">우측 상단 '+ 일정 추가' 버튼으로 새 일정을 등록해 보세요.</p>
                                            </div>
                                          ) : (
                                            selectedDateEvents.map((evt) => {
                                              let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
                                              if (evt.category === '예금' || evt.name.includes('[만기]')) {
                                                badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
                                              } else if (evt.flowType === 'income') {
                                                badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
                                              } else if (evt.flowType === 'expense') {
                                                badgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
                                              }

                                              return (
                                                <div
                                                  key={evt.id}
                                                  className={`p-3 rounded-xl border transition ${
                                                    darkMode ? 'bg-slate-700/50 border-slate-600/80' : 'bg-slate-50 border-slate-200/80'
                                                  }`}
                                                >
                                                  <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                                                      {evt.category}
                                                    </span>
                                                    {evt.flowType === 'income' && (
                                                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                                                        +{formatWon(evt.amount)}
                                                      </span>
                                                    )}
                                                    {evt.flowType === 'expense' && (
                                                      <span className="text-xs font-bold text-rose-500 flex items-center gap-0.5">
                                                        -{formatWon(evt.amount)}
                                                      </span>
                                                    )}
                                                    {evt.flowType === 'neutral' && (
                                                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                                        권리일정
                                                      </span>
                                                    )}
                                                  </div>
                                                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                                    {evt.name}
                                                  </div>
                                                  {evt.memo && (
                                                    <p className="text-[11px] text-slate-400 mt-1">
                                                      {evt.memo}
                                                    </p>
                                                  )}
                                                  {evt.isAsset && (
                                                    <div className="mt-1 text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                                                      <CheckCircle2 className="w-3 h-3" /> 보유 자산 실시간 연동됨
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })
                                          )}
                                        </div>
                                      </div>

                                      {/* 캘린더 안내 카드 */}
                                      <div className={`p-4 rounded-2xl border text-xs ${darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-blue-50/60 border-blue-100 text-slate-600'}`}>
                                        <div className="font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                                          <Info className="w-4 h-4" /> 스마트 캘린더 연동 팁
                                        </div>
                                        <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400">
                                          <li>좌측 사이드바의 <strong>'새 자산 추가'</strong>로 등록한 예금·주식 만기일은 캘린더에 자동 반영됩니다.</li>
                                          <li>해당 날짜를 클릭하면 상세 패널에서 당일 입출금 내역을 즉시 확인할 수 있습니다.</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 4. 자산 배분 리밸런싱(Rebalancing) 탭 */}
                              {activeTab === 'rebalancing' && (
                                <div className="space-y-6">
                                  {/* 상단 타이틀 & 설명 */}
                                  <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                      <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Scale className="w-6 h-6 text-blue-600" /> 자산 배분 리밸런싱 & 포트폴리오 진단
                                      </h2>
                                      <p className="text-xs text-slate-500 mt-1">
                                        보유 자산의 현재 비중을 진단하고, 목표 비중과 비교하여 매수·매도 추천 금액을 자동으로 산출합니다.
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                        진단 기준: 편차 ±5%p
                                      </span>
                                    </div>
                                  </div>

                                  {/* 상단 진단 배너 (경고 or 최적) */}
                                  {needsRebalancing ? (
                                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
                                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                      <div className="text-xs">
                                        <div className="font-bold text-sm text-amber-800 dark:text-amber-300">
                                          포트폴리오 리밸런싱 권고: 자산 비중 불균형 감지
                                        </div>
                                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                                          현재 <strong>{maxGapItem.category}</strong> 자산 비중이 목표 대비 <strong>{maxGapItem.gapRatio > 0 ? `+${maxGapItem.gapRatio}` : maxGapItem.gapRatio}%p</strong> 벌어져 허용 편차(±5%p)를 초과했습니다. 초과 자산을 일부 매도하여 부족한 자산을 추가 매수/예치할 것을 권장합니다.
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-start gap-3 shadow-sm">
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                      <div className="text-xs">
                                        <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                                          포트폴리오 최적 균형 유지 중
                                        </div>
                                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                                          모든 자산군이 목표 비중 대비 ±5%p 이내로 설정되어 있어 안정적인 자산 배분 균형을 유지하고 있습니다.
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* 핵심 지표 요약 카드 */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>총 포트폴리오 자산</span>
                                        <span className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">기준금액</span>
                                      </div>
                                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatWon(totalEval)}</div>
                                      <p className="text-[11px] text-slate-400 mt-1">세후 실시간 평가금액 합계</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>최대 비중 편차 자산</span>
                                        <span className="p-1 rounded bg-purple-50 dark:bg-purple-900/40 text-purple-600">편차</span>
                                      </div>
                                      <div className="text-xl font-bold">
                                        {maxGapItem.category} <span className={maxGapItem.gapRatio > 0 ? 'text-rose-500 text-base' : 'text-blue-500 text-base'}>({maxGapItem.gapRatio > 0 ? `+${maxGapItem.gapRatio}` : maxGapItem.gapRatio}%p)</span>
                                      </div>
                                      <p className="text-[11px] text-slate-400 mt-1">목표 대비 가장 큰 차이를 보이는 자산</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>총 리밸런싱 필요액</span>
                                        <span className="p-1 rounded bg-amber-50 dark:bg-amber-900/40 text-amber-600">조정규모</span>
                                      </div>
                                      <div className="text-xl font-bold text-amber-600 dark:text-amber-400">약 {formatWon(totalAdjustAmount)}</div>
                                      <p className="text-[11px] text-slate-400 mt-1">목표 달성을 위한 포트폴리오 이동 총액</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>포트폴리오 상태</span>
                                        <span className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">진단</span>
                                      </div>
                                      <div className={`text-xl font-bold flex items-center gap-1.5 ${needsRebalancing ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                        {needsRebalancing ? '리밸런싱 권장' : '최적 배분 상태'}
                                      </div>
                                      <p className="text-[11px] text-slate-400 mt-1">{needsRebalancing ? '일부 자산 매수/매도 권장' : '현재 비중 유지 적합'}</p>
                                    </div>
                                  </div>

                                  {/* 메인 2단 레이아웃 (목표 비중 설정 & 비교 차트 + 매수·매도 가이드 카드) */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* 1. 좌측: 목표 비중 설정 & 비교 차트 */}
                                    <div className={`p-6 rounded-2xl border shadow-sm space-y-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div>
                                        <div className="flex justify-between items-center mb-1">
                                          <h3 className="font-bold text-base flex items-center gap-2">
                                            <Sliders className="w-4 h-4 text-blue-600" /> 목표 자산 배분 비중 설정
                                          </h3>
                                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${totalTargetRatio === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}`}>
                                            합계: {totalTargetRatio}% {totalTargetRatio === 100 ? '(정상)' : '(100% 필요)'}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-500">슬라이더를 조절하거나 추천 프리셋을 선택해 목표 비중을 맞추세요.</p>
                                      </div>

                                      {/* 프리셋 버튼 그룹 */}
                                      <div>
                                        <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 추천 포트폴리오 프리셋
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                          {[
                                            { label: '안정 방어형', ratios: { 주식: 20, 예금: 60, 부동산: 20 }, desc: '20:60:20' },
                                            { label: '균형 중립형', ratios: { 주식: 40, 예금: 40, 부동산: 20 }, desc: '40:40:20' },
                                            { label: '성장 공격형', ratios: { 주식: 60, 예금: 20, 부동산: 20 }, desc: '60:20:20' },
                                            { label: '올웨더 분산', ratios: { 주식: 30, 예금: 50, 부동산: 20 }, desc: '30:50:20' },
                                          ].map((preset) => (
                                            <button
                                              key={preset.label}
                                              onClick={() => setTargetRatios(preset.ratios)}
                                              className={`p-2.5 rounded-xl border text-left transition ${
                                                targetRatios.주식 === preset.ratios.주식 &&
                                                targetRatios.예금 === preset.ratios.예금 &&
                                                targetRatios.부동산 === preset.ratios.부동산
                                                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 ring-2 ring-blue-500/30'
                                                  : darkMode
                                                  ? 'border-slate-700 hover:bg-slate-700/50'
                                                  : 'border-slate-200 hover:bg-slate-50'
                                              }`}
                                            >
                                              <div className="font-bold text-xs">{preset.label}</div>
                                              <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* 슬라이더 컨트롤러 */}
                                      <div className="space-y-4 pt-2">
                                        {[
                                          { key: '주식', color: 'accent-purple-600', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
                                          { key: '예금', color: 'accent-amber-600', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
                                          { key: '부동산', color: 'accent-teal-600', badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
                                        ].map((asset) => (
                                          <div key={asset.key} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs">
                                              <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${asset.badge}`}>
                                                {asset.key}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className="text-slate-400 text-[11px]">
                                                  현재 {rebalancingData.find((d) => d.category === asset.key)?.currentRatio}%
                                                </span>
                                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                                  목표 {targetRatios[asset.key]}%
                                                </span>
                                              </div>
                                            </div>
                                            <input
                                              type="range"
                                              min="0"
                                              max="100"
                                              step="5"
                                              value={targetRatios[asset.key]}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setTargetRatios((prev) => ({ ...prev, [asset.key]: val }));
                                              }}
                                              className={`w-full ${asset.color}`}
                                            />
                                          </div>
                                        ))}
                                      </div>

                                      {/* Recharts 현재 비중 vs 목표 비중 비교 막대 그래프 */}
                                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                                        <div className="text-xs font-semibold text-slate-500 mb-3 flex items-center justify-between">
                                          <span>현재 비중 vs 목표 비중 비교 시각화 (%)</span>
                                          <span className="text-[11px] text-slate-400">단위: %</span>
                                        </div>
                                        <div className="h-56 w-full">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={rebalancingChartData}>
                                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                                              <Tooltip />
                                              <Legend wrapperStyle={{ fontSize: '11px' }} />
                                              <Bar dataKey="현재 비중(%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                              <Bar dataKey="목표 비중(%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                          </ResponsiveContainer>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 2. 우측: 자산군별 매수·매도 가이드 카드 */}
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-base flex items-center gap-2">
                                          <ArrowRightLeft className="w-5 h-5 text-blue-600" /> 자산군별 맞춤 리밸런싱 가이드
                                        </h3>
                                        <span className="text-xs text-slate-400 font-medium">행동 권고</span>
                                      </div>

                                      {/* 카드 목록 */}
                                      <div className="space-y-3.5">
                                        {rebalancingData.map((item) => {
                                          const isOver = item.gapRatio > 0;
                                          const isSignificantlyOver = item.gapRatio >= 5;
                                          const isSignificantlyUnder = item.gapRatio <= -5;
                                          const isBalanced = Math.abs(item.gapRatio) < 5;

                                          return (
                                            <div
                                              key={item.category}
                                              className={`p-5 rounded-2xl border transition-all shadow-sm ${
                                                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                              }`}
                                            >
                                              <div className="flex justify-between items-start mb-3">
                                                <div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-bold text-base">{item.category}</span>
                                                    <span className="text-xs text-slate-400">
                                                      현재 {formatWon(item.currentEval)}
                                                    </span>
                                                  </div>
                                                  <div className="text-xs text-slate-500 mt-0.5">
                                                    목표 금액: {formatWon(item.targetEval)} ({item.targetRatio}%)
                                                  </div>
                                                </div>

                                                {/* 추천 행동 뱃지 */}
                                                <div>
                                                  {isSignificantlyOver && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 flex items-center gap-1">
                                                      <ArrowDownRight className="w-3.5 h-3.5" /> 일부 매도 권장
                                                    </span>
                                                  )}
                                                  {isSignificantlyUnder && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1">
                                                      <ArrowUpRight className="w-3.5 h-3.5" /> 추가 매수 권장
                                                    </span>
                                                  )}
                                                  {isBalanced && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center gap-1">
                                                      <CheckCircle2 className="w-3.5 h-3.5" /> 균형 유지
                                                    </span>
                                                  )}
                                                </div>
                                              </div>

                                              {/* 비중 비교 프로그레스 바 */}
                                              <div className="space-y-1.5 my-3">
                                                <div className="flex justify-between text-xs">
                                                  <span className="text-slate-500">현재 비중: <strong>{item.currentRatio}%</strong></span>
                                                  <span className={isOver ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                                                    편차: {item.gapRatio > 0 ? `+${item.gapRatio}` : item.gapRatio}%p
                                                  </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
                                                  <div
                                                    className="h-full bg-blue-600 rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, item.currentRatio)}%` }}
                                                  />
                                                </div>
                                              </div>

                                              {/* 조정 가이드 박스 */}
                                              <div className={`p-3 rounded-xl text-xs ${
                                                isSignificantlyOver
                                                  ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-200 border border-rose-200/60 dark:border-rose-800/40'
                                                  : isSignificantlyUnder
                                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200 border border-blue-200/60 dark:border-blue-800/40'
                                                  : 'bg-slate-50 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300'
                                              }`}>
                                                <div className="font-bold flex items-center justify-between">
                                                  <span>권장 조정 금액:</span>
                                                  <span className="text-sm">
                                                    {item.gapAmount > 0
                                                      ? `${formatWon(item.gapAmount)} 매도`
                                                      : item.gapAmount < 0
                                                      ? `${formatWon(Math.abs(item.gapAmount))} 매수/예치`
                                                      : '조정 불필요'}
                                                  </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                                  {item.category === '주식' && isSignificantlyOver && '주식 비중이 과열되었습니다. 수익률이 높은 종목을 분할 매도하여 안전자산으로 회수하세요.'}
                                                  {item.category === '주식' && isSignificantlyUnder && '주식 비중이 낮습니다. 저평가 우량주나 배당주로 점진적 분할 매수를 고려하세요.'}
                                                  {item.category === '예금' && isSignificantlyUnder && '안전자산 버퍼가 부족합니다. 최고금리 정기예금(연 4.2%)에 추가 예치하세요.'}
                                                  {item.category === '예금' && isSignificantlyOver && '예금 비중이 높습니다. 만기 도래 시 고수익 분산 투자 상품으로 자금을 이동하세요.'}
                                                  {item.category === '부동산' && isSignificantlyOver && '부동산 자산 편중도가 높습니다. 유동성 확보를 위해 지분 및 펀드 회수를 검토하세요.'}
                                                  {item.category === '부동산' && isSignificantlyUnder && '상업용 공모 리츠 등을 통해 정기적인 임대 배당 현금흐름을 확보하세요.'}
                                                  {isBalanced && '목표 비중과 부합합니다. 현재의 배분 포트폴리오를 유지하세요.'}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 5. 복리 기반 목표 달성 시뮬레이터(Simulator) 탭 */}
                              {activeTab === 'simulator' && (
                                <div className="space-y-6">
                                  {/* 상단 타이틀 & 설명 */}
                                  <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                      <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Target className="w-6 h-6 text-blue-600" /> 복리 기반 목표 달성 시뮬레이터
                                      </h2>
                                      <p className="text-xs text-slate-500 mt-1">
                                        현재 보유 자산과 월 저축액, 연평균 복리 수익률을 바탕으로 미래 자산 규모와 목표 달성 시점을 정밀 예측합니다.
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 text-amber-500" /> 월 복리(Monthly Compound) 적용 중
                                      </span>
                                    </div>
                                  </div>

                                  {/* 목표 프리셋 원클릭 설정 바 */}
                                  <div className={`p-4 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                                      <Award className="w-4 h-4 text-amber-500" /> 목표 자산 원클릭 프리셋
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                      {[
                                        { label: '내집 마련 (5억)', target: 500000000, desc: '수도권 내집 마련 자금', icon: '🏠' },
                                        { label: '은퇴 자금 (10억)', target: 1000000000, desc: '안정적인 노후 생활비', icon: '🏖️' },
                                        { label: '경제적 자유 (20억)', target: 2000000000, desc: '파이어족(FIRE) 조기 은퇴', icon: '🚀' },
                                        { label: '목돈 1억 만들기', target: 100000000, desc: '종잣돈(시드머니) 형성', icon: '💰' },
                                      ].map((preset) => (
                                        <button
                                          key={preset.label}
                                          onClick={() => setSimTargetAmount(preset.target)}
                                          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                                            simTargetAmount === preset.target
                                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 ring-2 ring-blue-500/30 shadow-sm'
                                              : darkMode
                                              ? 'border-slate-700 hover:bg-slate-700/50'
                                              : 'border-slate-200 hover:bg-slate-50'
                                          }`}
                                        >
                                          <span className="text-xl">{preset.icon}</span>
                                          <div>
                                            <div className="font-bold text-xs">{preset.label}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 핵심 결과 지표 요약 카드 */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>{simYears}년 후 최종 예상 자산</span>
                                        <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600">미래가치</span>
                                      </div>
                                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatWon(finalFutureValue)}</div>
                                      <p className="text-[11px] text-slate-400 mt-1">원금 + 복리 누적 총 자산</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>누적 복리 수익금</span>
                                        <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600">수익금</span>
                                      </div>
                                      <div className="text-xl font-bold text-emerald-600">+{formatWon(finalCompoundProfit)}</div>
                                      <p className="text-[11px] text-slate-400 mt-1">전체 자산 중 {compoundProfitRatio}%가 복리 이자!</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>총 납입 원금</span>
                                        <span className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">원금합계</span>
                                      </div>
                                      <div className="text-xl font-bold">{formatWon(finalContributed)}</div>
                                      <p className="text-[11px] text-slate-400 mt-1">초기 시작 자산 + 월 저축 누적</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>목표 달성률</span>
                                        <span className="p-1 rounded bg-amber-50 dark:bg-amber-900/40 text-amber-600">달성도</span>
                                      </div>
                                      <div className="text-xl font-bold text-emerald-600">{simAchievementRate}%</div>
                                      <p className="text-[11px] text-slate-400 mt-1">
                                        {targetReachedYear !== null
                                          ? `약 ${targetReachedYear}년 후(${calYear + targetReachedYear}년) 목표 달성 예상!`
                                          : '기간 내 추가 저축 필요'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* 메인 2단 레이아웃 (좌측: 설정 슬라이더 + 우측: Recharts AreaChart & AI 리포트) */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* 1. 좌측: 시뮬레이션 파라미터 컨트롤러 */}
                                    <div className={`p-6 rounded-2xl border shadow-sm space-y-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                      <div>
                                        <h3 className="font-bold text-base flex items-center gap-2 mb-1">
                                          <Sliders className="w-4 h-4 text-blue-600" /> 시뮬레이션 파라미터 정밀 설정
                                        </h3>
                                        <p className="text-xs text-slate-500">각 요소를 슬라이더로 조절하여 목표 달성 시점의 변화를 실시간으로 확인하세요.</p>
                                      </div>

                                      {/* 시작 원금 (보유 자산 실시간 연동) */}
                                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            시작 원금 (초기 자산)
                                            {customInitialAmount === null && (
                                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                                                보유자산 자동연동
                                              </span>
                                            )}
                                          </span>
                                          {customInitialAmount !== null ? (
                                            <button
                                              onClick={() => setCustomInitialAmount(null)}
                                              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                              <RefreshCw className="w-3 h-3" /> 보유자산 복원
                                            </button>
                                          ) : (
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                              {formatWon(totalEval)}
                                            </span>
                                          )}
                                        </div>
                                        {customInitialAmount !== null ? (
                                          <input
                                            type="number"
                                            step="1000000"
                                            value={customInitialAmount}
                                            onChange={(e) => setCustomInitialAmount(Number(e.target.value))}
                                            className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                                              darkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                                            }`}
                                          />
                                        ) : (
                                          <button
                                            onClick={() => setCustomInitialAmount(totalEval)}
                                            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                                          >
                                            직접 시작 원금 수정하기
                                          </button>
                                        )}
                                      </div>

                                      {/* 목표 금액 슬라이더 */}
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="font-semibold text-slate-700 dark:text-slate-300">목표 자산 금액</span>
                                          <strong className="text-blue-600 dark:text-blue-400 text-sm">{formatWon(simTargetAmount)}</strong>
                                        </div>
                                        <input
                                          type="range"
                                          min="50000000"
                                          max="3000000000"
                                          step="50000000"
                                          value={simTargetAmount}
                                          onChange={(e) => setSimTargetAmount(Number(e.target.value))}
                                          className="w-full accent-blue-600"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                          <span>5,000만원</span>
                                          <span>10억원</span>
                                          <span>20억원</span>
                                          <span>30억원</span>
                                        </div>
                                      </div>

                                      {/* 투자 기간 슬라이더 */}
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="font-semibold text-slate-700 dark:text-slate-300">투자 기간</span>
                                          <strong className="text-blue-600 dark:text-blue-400 text-sm">{simYears}년 후 ({calYear + simYears}년)</strong>
                                        </div>
                                        <input
                                          type="range"
                                          min="1"
                                          max="30"
                                          step="1"
                                          value={simYears}
                                          onChange={(e) => setSimYears(Number(e.target.value))}
                                          className="w-full accent-blue-600"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                          <span>1년</span>
                                          <span>10년</span>
                                          <span>20년</span>
                                          <span>30년</span>
                                        </div>
                                      </div>

                                      {/* 월 추가 납입액 슬라이더 */}
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="font-semibold text-slate-700 dark:text-slate-300">월 추가 저축/납입액</span>
                                          <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{formatWon(simMonthlySave)}</strong>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="10000000"
                                          step="100000"
                                          value={simMonthlySave}
                                          onChange={(e) => setSimMonthlySave(Number(e.target.value))}
                                          className="w-full accent-emerald-600"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                          <span>0원</span>
                                          <span>200만원</span>
                                          <span>500만원</span>
                                          <span>1,000만원</span>
                                        </div>
                                      </div>

                                      {/* 예상 연평균 수익률 슬라이더 & 추천 칩 */}
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="font-semibold text-slate-700 dark:text-slate-300">예상 연평균 수익률</span>
                                          <strong className="text-purple-600 dark:text-purple-400 text-sm">연 {simAnnualRate.toFixed(1)}%</strong>
                                        </div>
                                        <input
                                          type="range"
                                          min="1"
                                          max="20"
                                          step="0.5"
                                          value={simAnnualRate}
                                          onChange={(e) => setSimAnnualRate(Number(e.target.value))}
                                          className="w-full accent-purple-600"
                                        />
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                          {[
                                            { label: '예금형 (4%)', rate: 4.0 },
                                            { label: '배당/리츠 (6%)', rate: 6.0 },
                                            { label: '시장 평균 (8%)', rate: 8.0 },
                                            { label: '성장형 (12%)', rate: 12.0 },
                                          ].map((chip) => (
                                            <button
                                              key={chip.label}
                                              onClick={() => setSimAnnualRate(chip.rate)}
                                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                                                simAnnualRate === chip.rate
                                                  ? 'bg-purple-600 text-white'
                                                  : darkMode
                                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                              }`}
                                            >
                                              {chip.label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* 2. 우측: Recharts 자산 성장 곡선 차트 & AI 재정 진단 리포트 */}
                                    <div className="space-y-5">
                                      {/* AreaChart 복리 성장 곡선 */}
                                      <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                        <div className="flex justify-between items-center mb-4">
                                          <div>
                                            <h3 className="font-bold text-base flex items-center gap-2">
                                              <TrendingUp className="w-4 h-4 text-blue-600" /> 연도별 자산 성장 곡선 (복리 효과)
                                            </h3>
                                            <p className="text-xs text-slate-500">총 납입 원금과 복리 수익금의 자산 증식 추이 (단위: 만원)</p>
                                          </div>
                                          <div className="text-xs font-bold text-rose-500 flex items-center gap-1">
                                            <div className="w-3 h-0.5 border-t-2 border-dashed border-rose-500" /> 목표: {formatWon(simTargetAmount)}
                                          </div>
                                        </div>

                                        <div className="h-64 w-full">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={simCurveData}>
                                              <defs>
                                                <linearGradient id="colorFuture" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                                                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                                                </linearGradient>
                                                <linearGradient id="colorContributed" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                                                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                                                </linearGradient>
                                              </defs>
                                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                              <XAxis dataKey="yearLabel" tick={{ fontSize: 11 }} />
                                              <YAxis tick={{ fontSize: 11 }} />
                                              <Tooltip />
                                              <Legend wrapperStyle={{ fontSize: '11px' }} />
                                              <ReferenceLine
                                                y={Math.round(simTargetAmount / 10000)}
                                                stroke="#ef4444"
                                                strokeDasharray="4 4"
                                              />
                                              <Area
                                                type="monotone"
                                                dataKey="총 납입원금"
                                                stroke="#64748b"
                                                fillOpacity={1}
                                                fill="url(#colorContributed)"
                                              />
                                              <Area
                                                type="monotone"
                                                dataKey="복리 평가자산"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorFuture)"
                                              />
                                            </AreaChart>
                                          </ResponsiveContainer>
                                        </div>
                                      </div>

                                      {/* AI 재정 인사이트 진단 리포트 */}
                                      <div className={`p-5 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-blue-50/70 border-blue-100'}`}>
                                        <div className="flex items-center gap-2 font-bold text-sm text-blue-700 dark:text-blue-300">
                                          <Zap className="w-4 h-4 text-amber-500" /> AI 재정 인사이트 & 목표 달성 분석
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                          <div className="flex items-start gap-2">
                                            <span className="text-blue-600 font-bold shrink-0">1.</span>
                                            <p>
                                              <strong>복리의 가속 효과:</strong> {simYears}년 동안 누적되는 총 자산({formatWon(finalFutureValue)}) 중 <strong>{compoundProfitRatio}%({formatWon(finalCompoundProfit)})</strong>가 순수 복리 수익으로 발생합니다.
                                            </p>
                                          </div>
                                          <div className="flex items-start gap-2">
                                            <span className="text-blue-600 font-bold shrink-0">2.</span>
                                            <p>
                                              {targetReachedYear !== null ? (
                                                <span>
                                                  <strong>목표 조기 달성:</strong> 현재 페이스를 유지할 경우 계획보다 빠른 <strong>약 {targetReachedYear}년 후({calYear + targetReachedYear}년)</strong>에 목표 금액({formatWon(simTargetAmount)})을 달성할 수 있습니다!
                                                </span>
                                              ) : (
                                                <span>
                                                  <strong>달성 전략 조언:</strong> {simYears}년 후 예상 자산이 목표 금액의 {simAchievementRate}% 수준입니다. 월 납입액을 <strong>50만원 추가 증액</strong>하거나 연 수익률을 <strong>1.5%p 상향</strong>하면 목표 달성이 가능합니다.
                                                </span>
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 6. 기타 탭 (설정 등) */}
                              {activeTab !== 'dashboard' && activeTab !== 'ledger' && activeTab !== 'calendar' && activeTab !== 'rebalancing' && activeTab !== 'simulator' && (
                                <div className={`p-12 text-center rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center mx-auto mb-4">
                                    <Wallet className="w-6 h-6" />
                                  </div>
                            <h3 className="text-lg font-bold mb-1">
                              {activeTab === 'settings' && '시스템 설정'}
                              {' 화면 준비 중입니다.'}
                            </h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                              현재 대시보드, 상세 원장, 금융 캘린더, 자산 리밸런싱, 목표 시뮬레이터 메뉴가 활성화되어 있습니다.
                            </p>
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => setActiveTab('dashboard')}
                                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                              >
                                대시보드로 이동
                              </button>
                              <button
                                onClick={() => setActiveTab('simulator')}
                                className="px-4 py-2 rounded-xl bg-slate-800 text-white dark:bg-blue-600 text-xs font-semibold hover:opacity-90 transition"
                              >
                                시뮬레이터로 이동
                              </button>
                            </div>
                          </div>
          )}
                        </main>
                    </div>

                    {/* 그래프 클릭 시 열리는 상세 Layer Popup[cite: 1] */}
                    {selectedAssetPopup && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg">{selectedAssetPopup.name} 상세 분석</h4>
                            <button onClick={() => setSelectedAssetPopup(null)}><X className="w-5 h-5" /></button>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-slate-500">자산 분류</span>
                              <span className="font-semibold">{selectedAssetPopup.category}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-slate-500">초기 매입금액</span>
                              <span>{formatWon(selectedAssetPopup.buyPrice)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-slate-500">현재 평가금액 ({includeTax ? '세후' : '세전'})</span>
                              <span className="font-bold text-blue-600">{formatWon(selectedAssetPopup.finalEvalPrice)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-slate-500">실시간 시장가치</span>
                              <span className="font-bold text-emerald-600">{formatWon(selectedAssetPopup.marketPrice)}</span>
                            </div>
                            {includeTax && (
                              <div className="flex justify-between py-2 text-red-500 text-xs">
                                <span>예상 차감 세금</span>
                                <span>-{formatWon(selectedAssetPopup.taxAmount)}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedAssetPopup(null)}
                            className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
                          >
                            확인
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 이미지 공유하기 미리보기 모달[cite: 1] */}
                    {showShareModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-base">포트폴리오 수익률 이미지 카드 공유</h4>
                            <button onClick={() => setShowShareModal(false)}><X className="w-5 h-5" /></button>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-3">
                            <div className="text-xs opacity-80">FinMaster Pro 공식 수익률 인증</div>
                            <div className="text-3xl font-extrabold">+{totalReturnRate}%</div>
                            <div className="text-sm">총 평가손익: +{formatWon(totalProfit)}</div>
                            <div className="pt-3 border-t border-white/20 text-xs flex justify-between">
                              <span>총 자산 규모: {formatWon(totalEval)}</span>
                              <span>{new Date().toLocaleDateString('ko-KR')}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => { alert('포트폴리오 인증 카드 이미지가 저장되었습니다!'); setShowShareModal(false); }}
                            className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> 이미지 저장 및 클립보드 복사
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 관리자 페이지 콘솔 모달[cite: 1] */}
                    {isAdminModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg">시스템 관리자 콘솔 (Admin)</h4>
                            <button onClick={() => setIsAdminModal(false)}><X className="w-5 h-5" /></button>
                          </div>
                          <p className="text-xs text-slate-500 mb-4">금리 API 연동 상태, 세율 기준 및 사용자 데이터 동기화를 관리합니다.</p>
                          <div className="space-y-2 text-xs">
                            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 flex justify-between">
                              <span>은행연합회/저축은행 고금리 API</span>
                              <span className="text-emerald-600 font-bold">정상 (200 OK)</span>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 flex justify-between">
                              <span>이자소득세 기본 세율 설정</span>
                              <span className="font-bold">15.4% (지방소득세 포함)</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsAdminModal(false)}
                            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-sm"
                          >
                            대시보드로 돌아가기
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 새 자산 추가 모달 창 */}
                    {showAddModal && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all ${darkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" /> 새 자산 추가 등록
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">포트폴리오에 신규 자산을 등록하고 실시간 성과를 추적합니다.</p>
                            </div>
                            <button
                              onClick={() => setShowAddModal(false)}
                              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={handleAddAsset} className="space-y-4 text-xs">
                            {/* 1. 자산 유형 선택 */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                자산 유형 선택
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {['주식', '예금', '부동산'].map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setNewAssetCategory(cat)}
                                    className={`py-2 px-3 rounded-xl font-bold transition text-center ${
                                      newAssetCategory === cat
                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                                        : darkMode
                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">
                                기준 적용 세율: {newAssetCategory === '주식' ? '양도소득세 22%' : newAssetCategory === '예금' ? '이자소득세 15.4%' : '부동산 종합세 30%'}
                              </p>
                            </div>

                            {/* 2. 자산명 */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                자산명 / 종목명 <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={newAssetName}
                                onChange={(e) => setNewAssetName(e.target.value)}
                                placeholder={
                                  newAssetCategory === '주식'
                                    ? '예: 삼성전자, 현대차, 테슬라'
                                    : newAssetCategory === '예금'
                                    ? '예: KB국민 정기예금, 토스뱅크 파킹통장'
                                    : '예: 강남 아파트, 판교 오피스텔 지분'
                                }
                                className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  darkMode
                                    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                              />
                            </div>

                            {/* 3. 매입금액 */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                  매입금액 (원) <span className="text-rose-500">*</span>
                                </label>
                                {newAssetBuyPrice && (
                                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                                    {formatWon(Number(newAssetBuyPrice) || 0)}
                                  </span>
                                )}
                              </div>
                              <input
                                type="number"
                                required
                                min="1000"
                                step="1000"
                                value={newAssetBuyPrice}
                                onChange={(e) => setNewAssetBuyPrice(e.target.value)}
                                placeholder="예: 30000000"
                                className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  darkMode
                                    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                              />
                            </div>

                            {/* 4. 현재 평가금액 */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="font-semibold text-slate-700 dark:text-slate-300">
                                  현재 평가금액 (원) <span className="text-rose-500">*</span>
                                </label>
                                {newAssetEvalPrice && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    {formatWon(Number(newAssetEvalPrice) || 0)}
                                  </span>
                                )}
                              </div>
                              <input
                                type="number"
                                required
                                min="1000"
                                step="1000"
                                value={newAssetEvalPrice}
                                onChange={(e) => setNewAssetEvalPrice(e.target.value)}
                                placeholder="예: 32000000"
                                className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  darkMode
                                    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                              />
                            </div>

                            {/* 5. 기준일 / 만기일 */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                {newAssetCategory === '예금' ? '예금 만기일' : '기준일 / 취득일'} <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="date"
                                required
                                value={newAssetDate}
                                onChange={(e) => setNewAssetDate(e.target.value)}
                                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  darkMode
                                    ? 'bg-slate-900/60 border-slate-700 text-slate-100'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                              />
                              {newAssetCategory === '예금' && newAssetDate && (() => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const target = new Date(newAssetDate);
                                target.setHours(0, 0, 0, 0);
                                const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
                                if (diffDays >= 0 && diffDays <= 3) {
                                  return (
                                    <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                      <ShieldAlert className="w-3.5 h-3.5" />
                                      만기 {diffDays === 0 ? '당일(D-Day)' : `${diffDays}일 전`}으로 설정되어 상단 알람 센터에 자동 표시됩니다.
                                    </div>
                                  );
                                }
                                return (
                                  <p className="text-[11px] text-slate-400 mt-1">
                                    오늘 기준 만기까지 {diffDays > 0 ? `${diffDays}일 남음` : `${Math.abs(diffDays)}일 경과됨`}
                                  </p>
                                );
                              })()}
                            </div>

                            {/* 예상 손익 미리보기 바 */}
                            {newAssetBuyPrice && newAssetEvalPrice && Number(newAssetBuyPrice) > 0 && (
                              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex justify-between items-center text-xs">
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400">예상 평가 손익: </span>
                                  <strong className={Number(newAssetEvalPrice) >= Number(newAssetBuyPrice) ? 'text-emerald-600' : 'text-rose-500'}>
                                    {Number(newAssetEvalPrice) >= Number(newAssetBuyPrice) ? '+' : ''}
                                    {formatWon(Number(newAssetEvalPrice) - Number(newAssetBuyPrice))}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-slate-500 dark:text-slate-400">예상 수익률: </span>
                                  <strong className={Number(newAssetEvalPrice) >= Number(newAssetBuyPrice) ? 'text-emerald-600' : 'text-rose-500'}>
                                    {Number(newAssetEvalPrice) >= Number(newAssetBuyPrice) ? '+' : ''}
                                    {(((Number(newAssetEvalPrice) - Number(newAssetBuyPrice)) / Number(newAssetBuyPrice)) * 100).toFixed(2)}%
                                  </strong>
                                </div>
                              </div>
                            )}

                            {/* 등록 & 취소 버튼 */}
                            <div className="pt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                              >
                                취소
                              </button>
                              <button
                                type="submit"
                                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-4 h-4" /> 자산 등록하기
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* 신규 금융 일정 직접 등록 모달 창 */}
                    {showAddEventModal && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all ${darkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="font-bold text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" /> 신규 금융 일정 등록
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">캘린더에 현금 유입·유출 일정이나 중요 금융 이벤트를 추가합니다.</p>
                            </div>
                            <button
                              onClick={() => setShowAddEventModal(false)}
                              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={handleAddCalendarEvent} className="space-y-4 text-xs">
                            {/* 1. 구분 선택 (현금 유입 / 유출 / 권리) */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                일정 유형 / 현금흐름 방향 <span className="text-rose-500">*</span>
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setNewEventFlowType('income')}
                                  className={`py-2 px-2.5 rounded-xl font-bold transition text-center flex items-center justify-center gap-1 ${
                                    newEventFlowType === 'income'
                                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                                      : darkMode
                                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" /> 유입 (+)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewEventFlowType('expense')}
                                  className={`py-2 px-2.5 rounded-xl font-bold transition text-center flex items-center justify-center gap-1 ${
                                    newEventFlowType === 'expense'
                                      ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20'
                                      : darkMode
                                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  <ArrowDownRight className="w-3.5 h-3.5" /> 유출 (-)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewEventFlowType('neutral')}
                                  className={`py-2 px-2.5 rounded-xl font-bold transition text-center flex items-center justify-center gap-1 ${
                                    newEventFlowType === 'neutral'
                                      ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-500/20'
                                      : darkMode
                                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  권리/기준일
                                </button>
                              </div>
                            </div>

                            {/* 2. 카테고리 선택 */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                카테고리 분류
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {['예금', '주식', '부동산', '지출', '저축', '기타'].map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setNewEventCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg font-medium text-[11px] transition ${
                                      newEventCategory === cat
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : darkMode
                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 3. 일정명 */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                일정명 <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={newEventName}
                                onChange={(e) => setNewEventName(e.target.value)}
                                placeholder="예: 신용카드 결제일, 월세 수취, 아파트 관리비 등"
                                className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  darkMode
                                    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                              />
                            </div>

                            {/* 4. 금액 */}
                            {newEventFlowType !== 'neutral' && (
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    예상 금액 (원) <span className="text-rose-500">*</span>
                                  </label>
                                  {newEventAmount && (
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                                      {formatWon(Number(newEventAmount) || 0)}
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  step="1000"
                                  value={newEventAmount}
                                  onChange={(e) => setNewEventAmount(e.target.value)}
                                  placeholder="예: 500000"
                                  className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    darkMode
                                      ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                  }`}
                                />
                              </div>
                            )}

                            {/* 5. 날짜 */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                예정 일자 <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="date"
                                required
                                value={newEventDate}
                                onChange={(e) => setNewEventDate(e.target.value)}
                                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  darkMode
                                    ? 'bg-slate-900/60 border-slate-700 text-slate-100'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                              />
                            </div>

                            {/* 6. 메모 */}
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                비고 및 메모
                              </label>
                              <input
                                type="text"
                                value={newEventMemo}
                                onChange={(e) => setNewEventMemo(e.target.value)}
                                placeholder="추가 메모를 입력하세요 (선택)"
                                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  darkMode
                                    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                              />
                            </div>

                            {/* 등록 & 취소 버튼 */}
                            <div className="pt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => setShowAddEventModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                              >
                                취소
                              </button>
                              <button
                                type="submit"
                                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-4 h-4" /> 일정 등록하기
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                );
}