const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const api = {
  // 자산 (Asset)
  getAssets: async () => {
    const res = await fetch(`${API_BASE_URL}/assets`);
    if (!res.ok) throw new Error('자산 목록을 불러오지 못했습니다.');
    return res.json();
  },
  createAsset: async (data) => {
    const res = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('자산을 등록하지 못했습니다.');
    return res.json();
  },
  updateAsset: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('자산을 수정하지 못했습니다.');
    return res.json();
  },
  deleteAsset: async (id) => {
    const res = await fetch(`${API_BASE_URL}/assets/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('자산을 삭제하지 못했습니다.');
    return true;
  },

  // 상세 원장 (Ledger)
  getLedger: async (category) => {
    const url = category && category !== '전체'
      ? `${API_BASE_URL}/ledger?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/ledger`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('원장 거래 내역을 불러오지 못했습니다.');
    return res.json();
  },
  createLedger: async (data) => {
    const res = await fetch(`${API_BASE_URL}/ledger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('원장 거래를 등록하지 못했습니다.');
    return res.json();
  },
  deleteLedger: async (id) => {
    const res = await fetch(`${API_BASE_URL}/ledger/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('원장 거래를 삭제하지 못했습니다.');
    return true;
  },

  // 금융 캘린더 (Calendar)
  getCalendar: async () => {
    const res = await fetch(`${API_BASE_URL}/calendar`);
    if (!res.ok) throw new Error('캘린더 일정을 불러오지 못했습니다.');
    return res.json();
  },
  createCalendar: async (data) => {
    const res = await fetch(`${API_BASE_URL}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('캘린더 일정을 등록하지 못했습니다.');
    return res.json();
  },
  deleteCalendar: async (id) => {
    const res = await fetch(`${API_BASE_URL}/calendar/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('캘린더 일정을 삭제하지 못했습니다.');
    return true;
  },

  // 리밸런싱 (Rebalancing)
  getRebalancing: async () => {
    const res = await fetch(`${API_BASE_URL}/rebalancing`);
    if (!res.ok) throw new Error('리밸런싱 목표 비중을 불러오지 못했습니다.');
    return res.json();
  },
  updateRebalancing: async (targets) => {
    const res = await fetch(`${API_BASE_URL}/rebalancing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targets),
    });
    if (!res.ok) throw new Error('리밸런싱 목표 비중을 저장하지 못했습니다.');
    return res.json();
  },

  // 목표 시뮬레이터 (Goals)
  getGoal: async () => {
    const res = await fetch(`${API_BASE_URL}/goals`);
    if (!res.ok) throw new Error('목표 시뮬레이터 설정을 불러오지 못했습니다.');
    return res.json();
  },
  updateGoal: async (data) => {
    const res = await fetch(`${API_BASE_URL}/goals`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('목표 시뮬레이터 설정을 저장하지 못했습니다.');
    return res.json();
  },
};
