# 💰 종합 재정관리 플랫폼 (Finance App)

개인 자산을 한눈에 파악하고, 세후 수익률 계산부터 고금리 예금 추천, 리밸런싱, 목표 자산 시뮬레이션까지 지원하는 올인원 웹 기반 재정관리 플랫폼입니다.

---

## ✨ 주요 기능 (Key Features)

- **통합 대시보드**: 총 매입금액, 총 평가금액, 평가 손익, 수익률 요약 카드 및 자산별 성과 비교 차트(Recharts BarChart)와 Layer Popup
- **스마트 알람 & 세금 토글**: 예금 만기 3일 전/1일 전 사전 알림 센터 및 이자소득세(15.4%)/양도소득세 즉시 반영 스위치
- **고금리 은행 추천**: 시중은행 및 저축은행 최고금리 정기예금/파킹통장 실시간 비교 및 가입 가이드
- **상세 원장 (Ledger)**: 주식/예금/부동산 거래 내역 실시간 검색, 카테고리/유형별 필터링, 월별 입출금 요약
- **금융 캘린더 (Calendar)**: 월별 만기일/이자수령일/배당일 자동 캘린더 매핑 및 일정 추가
- **자산 리밸런싱 (Rebalancing)**: 공격투자/안정투자 등 4종 프리셋, 목표 비중 슬라이더 조정 및 현재 비중 대비 차이 진단
- **목표 시뮬레이터 (Simulator)**: 내 집 마련/은퇴 자금 등 복리 계산기 엔진, 목표 달성 예측 차트 및 AI 재정 가이드
- **글로벌 유틸리티**: '새 자산 추가' 실시간 동기화 모달, 다크 모드 전환, 엑셀 내보내기 지원

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework & Library**: React, Tailwind CSS
- **Icons & Charts**: Lucide React (`lucide-react`), Recharts
- **State Management**: React Hooks (useState, useMemo)

### Backend & Infrastructure (Roadmap)
- **Backend API**: Java Spring Boot + 내장 Tomcat (`server/`)
- **Database**: PostgreSQL
- **DevOps & Deploy**: Git / GitHub, Docker, Docker Compose

---

## 🗂️ 프로젝트 디렉토리 구조 (Directory Structure)

```text
finance-app/
├── client/                     # React 프론트엔드 애플리케이션
│   ├── public/                 # 정적 리소스 (favicon, html, manifest 등)
│   ├── src/                    # 프론트엔드 핵심 소스
│   │   ├── App.js              # 통합 메인 애플리케이션 (1단계 전체 UI & 상태 로직)
│   │   ├── App.css             # 앱 전역 스타일
│   │   ├── index.js            # React 엔트리포인트
│   │   └── index.css           # Tailwind CSS 및 기본 폰트 설정
│   └── package.json            # 프론트엔드 의존성 설정
├── server/                     # Java Spring Boot REST API 서버 (구축 예정)
├── .gitignore                  # Git 버전 관리 제외 설정
├── AGENTS.md                   # AI 코딩 에이전트 개발 가이드 및 아키텍처 규칙
└── README.md                   # 프로젝트 통합 가이드 문서
```

---

## 🚀 단계별 개발 및 인프라 구축 로드맵

- [x] **1단계: 프론트엔드 기능 완성**
  - 대시보드, 상세 원장, 캘린더, 리밸런싱, 시뮬레이터, 자산 추가 모달 구현 및 로컬 테스트 완료
- [x] **2단계: 소스 코드 버전 관리**
  - Git 초기화, 커밋 작성자(`remsenet`) 설정 및 GitHub(`remsenet/finance-app`) 원격 저장소 연동
- [ ] **3단계: 데이터베이스 설계 및 스키마 구축**
  - `assets`, `ledger_transactions`, `notifications`, `goals` 테이블 설계 및 PostgreSQL 스키마 구축
- [ ] **4단계: 백엔드 API 서버 구축**
  - `server/` 폴더에 Spring Boot(내장 Tomcat) 기반 REST API 개발 및 React 프론트엔드 연동
- [ ] **5단계: 컨테이너화 및 클라우드 배포**
  - React(Nginx) + Spring Boot(Tomcat) + PostgreSQL `docker-compose.yml` 컨테이너 배포
