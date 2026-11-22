# AGENTS.md - 종합 재정관리 플랫폼 개발 가이드

## 1. 프로젝트 개요
본 프로젝트는 주식, 예금, 부동산 등 다양한 자산을 통합 관리하고 고금리 은행 추천, 세금 반영, 리밸런싱, 목표 달성 시뮬레이션을 제공하는 웹 기반 재정관리 플랫폼입니다[cite: 1].

## 2. 기술 스택 (Tech Stack)
- **Frontend**: React, Tailwind CSS
- **Icons**: Lucide React (`lucide-react`)
- **Charts**: Recharts
- **Backend (추후 확장)**: Node.js, Express
- **Version Control**: Git / GitHub

## 3. 폴더 구조 규칙 (Directory Structure)
- `client/src/components/`: 공통 UI 컴포넌트 (Modal, Toggle, Header, Sidebar 등)[cite: 1]
- `client/src/context/`: 전역 상태 관리 (세금 포함/미포함 토글, 다크 모드, 만기 알람 목록)[cite: 1]
- `client/src/pages/`: 각 메뉴별 메인 화면 (Dashboard, Ledger, Calendar, Rebalancing, Simulator, Admin)[cite: 1]
- `client/src/services/`: API 통신 및 더미 데이터 (`mockData.js`)
- `client/src/utils/`: 금액 포맷팅(원화 표기), 세후 수익률 계산 로직

## 4. 코딩 컨벤션 (Coding Conventions)
- 모든 React 컴포넌트는 함수형 컴포넌트(Functional Component)와 Hooks를 사용합니다.
- 스타일링은 Tailwind CSS 유틸리티 클래스를 우선적으로 사용합니다.
- 백엔드 API 연동 전까지는 `mockData.js`의 더미 데이터를 활용해 화면이 즉시 렌더링되도록 구현합니다.
- 사용자에게 노출되는 모든 텍스트와 통화 단위(원, %)는 한국어로 작성합니다.

## 5. 백엔드 및 외부 서비스 인프라 확장 로드맵 (Infrastructure & Backend Roadmap)

### 5.1. 전체 시스템 아키텍처 목표
- **프론트엔드 (Frontend)**: React (`client/`) — 대시보드, 상세 원장, 금융 캘린더, 리밸런싱, 목표 시뮬레이터 UI
- **백엔드 API (Backend)**: Java Spring Boot + 내장 Tomcat (`server/`) — 비즈니스 로직, 인증, REST API 제공
- **데이터베이스 (Database)**: PostgreSQL — 사용자 계정, 자산 목록, 거래 원장, 만기 알람 데이터 영구 저장
- **형상 관리 및 배포 (DevOps)**: Git / GitHub (소스 코드 버전 관리) + Docker / Docker Compose (프론트·백엔드·DB 통합 컨테이너 배포)

### 5.2. 단계별 개발 및 인프라 구축 계획
1. **1단계 (프론트엔드 기능 완성)**:
   - '새 자산 추가' 모달, '금융 캘린더', '리밸런싱', '목표 시뮬레이터' UI 구현 및 로컬 화면 검증
2. **2단계 (소스 코드 버전 관리)**:
   - 최상위 폴더(`finance-app`) 기준 Git 저장소 관리 및 기능 완성 단위별 GitHub Commit & Push
3. **3단계 (데이터베이스 설계)**:
   - `assets`, `ledger_transactions`, `notifications`, `goals` 테이블 설계 및 PostgreSQL 스키마 구축
4. **4단계 (백엔드 API 서버 구축)**:
   - `server/` 폴더에 Spring Boot(내장 Tomcat) 기반 REST API 개발 및 React 프론트엔드 연동
5. **5단계 (컨테이너화 및 배포)**:
   - 프론트엔드(Nginx) · 백엔드(Tomcat) · DB(PostgreSQL) Dockerfile 및 `docker-compose.yml` 구성 후 클라우드 배포

### 5.3. 에이전트 작업 지침
- 앞으로 코드를 작성하거나 수정할 때는 위 아키텍처와 단계별 로드맵을 항상 기준으로 삼아 확장성을 고려해 구현합니다.
