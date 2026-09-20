# Interactive 3D Portfolio

Next.js 16, React Three Fiber, Notion API, 그리고 AI(Groq)를 결합하여 만든 **인터랙티브 3D 포트폴리오**입니다.  
사용자는 정적인 텍스트를 읽는 대신 3D 공간을 탐색하고, 챗봇과 대화하며, 노션으로 실시간 업데이트되는 이력을 확인할 수 있습니다.

👉 **[Live Demo 방문하기](https://gukkaebi-portfolio.vercel.app/)**

---

## 🎯 설계 철학 (Macroscopic View)

이 프로젝트는 단순한 정보 나열을 넘어 **기술적 깊이와 사용자 경험(UX)의 융합**을 목표로 합니다.
프론트엔드 아키텍처부터 백엔드 데이터 파이프라인까지, 확장성과 유지보수성을 극대화하는 방향으로 설계되었습니다.

### 1. Feature-Sliced Design (FSD) 아키텍처 도입
- 도메인 주도 설계(DDD)에 기반한 **FSD (Feature-Sliced Design)** 구조를 채택하여 컴포넌트와 비즈니스 로직을 `src/features/` 하위에 도메인별(`resume`, `chat`, `projects` 등)로 완벽히 분리했습니다.
- Next.js의 `App Router (src/app/)`는 오직 라우팅 기점 역할만 수행하며, 프로젝트 규모가 커지더라도 높은 유지보수성과 결합도 최소화를 보장합니다.

### 2. 커스텀 블록 파서 & 실시간 CMS (Notion API)
- 포트폴리오의 모든 데이터(프로젝트, 이력서, 태그 등)는 **Notion을 Headless CMS로 활용**하여 관리됩니다.
- 별도의 외부 렌더링 라이브러리에 의존하지 않고, 자체 구축한 커스텀 파서(`notion.ts`)를 통해 노션의 복잡한 계층형 JSON 데이터를 React Component로 매핑합니다.

### 3. 물리 기반 3D 인터랙션 (R3F)
- 평면적인 갤러리를 넘어서, `React Three Fiber`를 이용한 3D 공간 구성을 통해 사용자에게 압도적이고 몰입감 있는 갤러리 뷰(Gallery Scene)를 제공합니다.

### 4. RAG 기반 맞춤형 AI 비서 직접 구축
- 사용자가 포트폴리오에 대해 묻거나 역량을 검증하기 위해 질문할 수 있도록 **자체 RAG 기반 AI 챗봇**을 탑재했습니다.
- Vercel AI SDK 등의 서드파티 래퍼(Wrapper)에 의존하지 않고, 백엔드 라우트(`route.ts`)에서 Groq API를 직접 컨트롤하며 프롬프트와 컨텍스트 주입 결가를 정밀하게 조정(Suggested Action 등)하여 반응형 챗봇 인터페이스를 설계했습니다.

---

## 🛠 Tech Stack

불필요한 서브 라이브러리를 걷어내고, 성능 최적화와 직관적인 개발 경험을 위해 가장 최신이자 강력한 프론트엔드 코어로 구성했습니다.

| Category | Core Technologies |
| :--- | :--- |
| **Core** | `Next.js 16 (App Router)`, `React 19`, `TypeScript` |
| **Style** | `Tailwind CSS v4` |
| **3D Engine** | `React Three Fiber` |
| **AI / NLP** | `Groq API (Llama-3)`, `RAG Architecture` |
| **Data / CMS**| `Notion API (Custom Parser)` |

---

## 📚 상세 기술 문서 안내

세부적인 기술 결정 배경과 깊이 있는 최적화/이슈 해결 과정은 아래 별도 문서로 분리하여 관리하고 있습니다.

- [**TECH.md**](./TECH.md) : 각 기술 스택 선정 이유, 경량화 전략 및 주요 개발 성과(FSD, 커스텀 파서 등)
- [**TROUBLESHOOTING.md**](./TROUBLESHOOTING.md) : 3D 렌더링 그림자 최적화 (O(N) ➡️ O(1)), AI 모델 종속성 탈피 및 파싱 방어, 비동기 프리로딩 등 주요 문제 해결 경험

---

## 🚀 Getting Started

1. **저장소 클론**
   ```bash
   git clone https://github.com/micayell/portfolio.git
   cd portfolio
   ```

2. **패키지 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정 (`.env.local`)**
   ```env
   # Notion (Headless CMS)
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_database_id
   NOTION_PORTFOLIO_PAGE_ID=your_portfolio_page_id

   # AI 설정
   GROQ_API_KEY=your_groq_api_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`에 접속하여 프로젝트를 확인할 수 있습니다.