-- ========================================================
-- 종합 재정관리 플랫폼 (Finance App) - PostgreSQL 스키마
-- ========================================================

-- 1. 자산 테이블 (assets)
CREATE TABLE IF NOT EXISTS assets (
    id BIGSERIAL PRIMARY KEY,
    asset_type VARCHAR(20) NOT NULL CHECK (asset_type IN ('STOCK', 'DEPOSIT', 'REAL_ESTATE')),
    category VARCHAR(20) NOT NULL, -- '주식', '예금', '부동산'
    name VARCHAR(100) NOT NULL,
    purchase_amount BIGINT NOT NULL CHECK (purchase_amount >= 0),
    current_value BIGINT NOT NULL CHECK (current_value >= 0),
    market_price BIGINT NOT NULL DEFAULT 0,
    tax_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.1540,
    interest_rate NUMERIC(5, 2) DEFAULT 0.00,
    target_date DATE,
    d_day INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 상세 원장 거래 내역 테이블 (ledger_transactions)
CREATE TABLE IF NOT EXISTS ledger_transactions (
    id VARCHAR(50) PRIMARY KEY,
    asset_id BIGINT REFERENCES assets(id) ON DELETE SET NULL,
    category VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('BUY', 'SELL', 'DIVIDEND', 'INTEREST')),
    type_display VARCHAR(20) NOT NULL, -- '매수', '매도', '배당', '이자'
    name VARCHAR(100) NOT NULL,
    amount BIGINT NOT NULL,
    unit_price BIGINT,
    quantity VARCHAR(50),
    tax BIGINT DEFAULT 0,
    settled_amount BIGINT NOT NULL,
    memo TEXT,
    status VARCHAR(20) DEFAULT '완료',
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 금융 캘린더 일정 테이블 (calendar_events)
CREATE TABLE IF NOT EXISTS calendar_events (
    id VARCHAR(50) PRIMARY KEY,
    asset_id BIGINT REFERENCES assets(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(20) NOT NULL, -- '부동산', '예금', '주식', '지출', '저축'
    flow_type VARCHAR(20) NOT NULL CHECK (flow_type IN ('income', 'expense', 'neutral')),
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('MATURITY', 'DIVIDEND', 'EXPENSE', 'INCOME', 'SAVING', 'INTEREST')),
    amount BIGINT DEFAULT 0,
    event_date DATE NOT NULL,
    memo TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 리밸런싱 목표 비중 테이블 (rebalancing_targets)
CREATE TABLE IF NOT EXISTS rebalancing_targets (
    id BIGSERIAL PRIMARY KEY,
    asset_type VARCHAR(20) UNIQUE NOT NULL CHECK (asset_type IN ('STOCK', 'DEPOSIT', 'REAL_ESTATE')),
    category VARCHAR(20) NOT NULL, -- '주식', '예금', '부동산'
    target_ratio NUMERIC(5, 2) NOT NULL CHECK (target_ratio >= 0 AND target_ratio <= 100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 목표 시뮬레이터 테이블 (goals)
CREATE TABLE IF NOT EXISTS goals (
    id BIGSERIAL PRIMARY KEY,
    goal_name VARCHAR(100) NOT NULL,
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    current_seed BIGINT NOT NULL DEFAULT 0,
    monthly_contribution BIGINT NOT NULL DEFAULT 0,
    expected_return_rate NUMERIC(5, 2) NOT NULL DEFAULT 6.00,
    duration_years INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 초기 데이터 (App.js와 동일한 초기값 등록)
-- ========================================================
-- 자산 초기 데이터
INSERT INTO assets (id, asset_type, category, name, purchase_amount, current_value, market_price, tax_rate, target_date, d_day) VALUES
(1, 'STOCK', '주식', '삼성전자 외 4종', 45000000, 54200000, 55100000, 0.2200, '2026-11-20', NULL),
(2, 'DEPOSIT', '예금', 'KB Star 정기예금', 30000000, 31140000, 31140000, 0.1540, '2026-11-25', 3),
(3, 'DEPOSIT', '예금', '신한 쏠편한 정기예금', 20000000, 20780000, 20780000, 0.1540, '2026-11-23', 1),
(4, 'REAL_ESTATE', '부동산', '오피스텔 지분 투자', 80000000, 88500000, 90000000, 0.3000, '2026-11-15', NULL)
ON CONFLICT (id) DO NOTHING;

-- 리밸런싱 초기 기본 비중 (균형 중립형 40:40:20)
INSERT INTO rebalancing_targets (asset_type, category, target_ratio) VALUES
('STOCK', '주식', 40.00),
('DEPOSIT', '예금', 40.00),
('REAL_ESTATE', '부동산', 20.00)
ON CONFLICT (asset_type) DO NOTHING;

-- 목표 시뮬레이터 초기 데이터 (내 집 마련 3억원)
INSERT INTO goals (id, goal_name, target_amount, current_seed, monthly_contribution, expected_return_rate, duration_years) VALUES
(1, '내 집 마련 (수도권 아파트)', 300000000, 100000000, 2000000, 6.00, 5)
ON CONFLICT (id) DO NOTHING;

-- 캘린더 초기 일정 등록
INSERT INTO calendar_events (id, asset_id, title, category, flow_type, event_type, amount, event_date, memo) VALUES
('CE-1', 4, '강남 오피스텔 월세 입금', '부동산', 'income', 'INCOME', 650000, '2026-11-05', '11월분 임대수익 정산'),
('CE-2', 2, 'KB Star 정기예금 월이자', '예금', 'income', 'INTEREST', 105000, '2026-11-12', '11월차 월이자 계좌 입금'),
('CE-3', 1, '삼성전자 3분기 배당금', '주식', 'income', 'DIVIDEND', 361000, '2026-11-14', '보유 500주 분기 배당금 입금'),
('CE-4', 1, '삼성전자 분기 배당락일', '주식', 'neutral', 'MATURITY', 0, '2026-11-20', '4분기 배당권리 기준일'),
('CE-5', NULL, '신용카드 대금 결제일', '지출', 'expense', 'EXPENSE', 1850000, '2026-11-27', '10월 사용분 자동 결제'),
('CE-6', NULL, '주택청약 및 연금저축 자동이체', '저축', 'expense', 'SAVING', 500000, '2026-11-30', '월 정기 저축성 이체')
ON CONFLICT (id) DO NOTHING;

-- 원장 초기 거래 내역 10건 등록
INSERT INTO ledger_transactions (id, asset_id, category, transaction_type, type_display, name, amount, unit_price, quantity, tax, settled_amount, memo, status, transaction_date) VALUES
('TX-20261114-01', 1, '주식', 'DIVIDEND', '배당', '삼성전자 (005930)', 361000, NULL, '500주', 55590, 305410, '2026년 3분기 정기배당금 지급', '완료', '2026-11-14'),
('TX-20261112-02', 2, '예금', 'INTEREST', '이자', 'KB Star 정기예금', 105000, NULL, '연 4.2%', 16170, 88830, '11월차 정기 월이자 입금', '완료', '2026-11-12'),
('TX-20261110-03', NULL, '주식', 'BUY', '매수', '현대차 (005380)', 5200000, 260000, '20주', 1250, 5201250, '가치주 포트폴리오 추가 분할 매수', '완료', '2026-11-10'),
('TX-20261105-04', 4, '부동산', 'INTEREST', '이자', '강남 오피스텔 지분 투자', 650000, NULL, '1개 호실 (지분 25%)', 65000, 585000, '11월 임대차 월세 배당 정산금', '완료', '2026-11-05'),
('TX-20261028-05', NULL, '주식', 'SELL', '매도', 'SK하이닉스 (000660)', 9800000, 196000, '50주', 17640, 9782360, '목표가 달성 차익 실현 (수익률 28%)', '완료', '2026-10-28'),
('TX-20261020-06', 3, '예금', 'BUY', '매수', '신한 쏠편한 정기예금', 20000000, NULL, '1년 만기 (연 3.85%)', 0, 20000000, '단기 여유자금 안정형 정기예금 신규 예치', '완료', '2026-10-20'),
('TX-20261015-07', NULL, '부동산', 'BUY', '매수', '판교 오피스 공모 리츠', 15000000, 5000, '3,000주', 3000, 15003000, '상업용 우량 오피스 지분 분산 투자', '완료', '2026-10-15'),
('TX-20260930-08', NULL, '예금', 'SELL', '매도', '하나 하나의정기예금', 10000000, NULL, '12개월 만기', 0, 10000000, '예금 만기 도래에 따른 원금 자동 해지 회수', '완료', '2026-09-30'),
('TX-20260930-09', NULL, '예금', 'INTEREST', '이자', '하나 하나의정기예금', 400000, NULL, '만기 이자 정산', 61600, 338400, '정기예금 만기 이자 수취', '완료', '2026-09-30'),
('TX-20260915-10', NULL, '부동산', 'SELL', '매도', '마포 원룸 개발 펀드', 30000000, NULL, '지분 청산', 750000, 29250000, 'PF 사업장 준공 및 분양 완료에 따른 투자금 회수', '완료', '2026-09-15')
ON CONFLICT (id) DO NOTHING;


-- 시퀀스 동기화 (초기 수동 ID 부여 후 자동증가 시퀀스를 최대 ID로 갱신)
SELECT setval(pg_get_serial_sequence('assets', 'id'), COALESCE(max(id), 1)) FROM assets;
SELECT setval(pg_get_serial_sequence('rebalancing_targets', 'id'), COALESCE(max(id), 1)) FROM rebalancing_targets;
SELECT setval(pg_get_serial_sequence('goals', 'id'), COALESCE(max(id), 1)) FROM goals;
