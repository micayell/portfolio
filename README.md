# Interactive Portfolio (Next.js, Three.js, Notion CMS)

<div align="center">
  <p>
    <strong><a href="[https://your-portfolio-url.com](https://gukkaebi-portfolio-e9xl83hmf-gukkaebi.vercel.app/)" target="_blank">Live Demo</a></strong>
  </p>
</div>

<br/>

이 프로젝트는 Next.js 기반으로 제작된 인터랙티브 포트폴리오 웹사이트입니다. 정적인 정보 제공을 넘어, `react-three-fiber`를 활용한 3D 프로젝트 갤러리와 Notion API를 연동한 AI 챗봇을 통해 사용자 상호작용을 강화하는 데 중점을 두었습니다. 모든 프로젝트 데이터와 이력서는 Notion 데이터베이스를 통해 동적으로 관리됩니다.

---

## 주요 기능

-   **인터랙티브 3D 갤러리**: `react-three-fiber`와 `drei`를 사용하여 프로젝트를 3D 공간에 전시하고, 사용자가 직접 탐색하며 둘러볼 수 있는 환경을 제공합니다.
-   **AI 챗봇 어시스턴트**: 포트폴리오에 대한 정보를 대화형으로 제공하는 AI 챗봇을 구현했습니다. Next.js API Route와 Vercel AI SDK를 활용했습니다.
-   **Notion 기반 Headless CMS**: 프로젝트, 이력서, 기술 스택 등 웹사이트의 모든 콘텐츠를 Notion 데이터베이스에서 관리합니다. 이를 통해 코드 수정 없이 실시간으로 콘텐츠 업데이트가 가능합니다.
-   **반응형 디자인**: 데스크톱부터 모바일 기기까지 모든 화면 크기에서 최적의 사용자 경험을 제공하도록 설계되었습니다.
-   **테마 전환**: 사용자의 시스템 설정에 따라 다크/라이트 모드를 자동으로 적용하며, 수동 전환도 지원합니다.
-   **동적 애니메이션**: `framer-motion`을 활용하여 페이지 전환과 컴포넌트 표시에 부드럽고 직관적인 애니메이션을 적용했습니다.

---

## 기술 스택

| Category      | Technologies                                                                                             |
| :------------ | :------------------------------------------------------------------------------------------------------- |
| **Frontend**  | `Next.js`, `React`, `TypeScript`, `Tailwind CSS`                                                         |
| **3D**        | `Three.js`, `React Three Fiber`, `Drei`, `Maath`                                                         |
| **Animation** | `Framer Motion`, `@use-gesture/react`                                                                    |
| **Backend**   | `Next.js API Routes`, `Vercel AI SDK`                                                                    |
| **CMS**       | `Notion API`                                                                                             |
| **Deployment**| `Vercel`                                                                                                 |
| **Analytics** | `@vercel/analytics`                                                                                      |

---

## 핵심 구현 및 문제 해결

개발 과정에서 마주한 주요 문제들과 이를 해결하기 위해 적용한 기술적인 접근 방식입니다.

### 1. Notion을 Headless CMS로 활용한 동적 콘텐츠 관리

**문제 인식:** 포트폴리오 콘텐츠(프로젝트, 이력 등)를 업데이트할 때마다 코드를 수정하고 다시 배포하는 과정의 비효율성을 개선하고자 했습니다.

**해결 방안:** Notion을 Headless CMS로 도입하여 콘텐츠와 코드를 분리했습니다.

-   **Notion API 연동**: `src/lib/notion.ts`에 Notion API와 통신하는 로직을 모듈화하여 재사용성을 높였습니다. Notion 데이터베이스 ID와 API 키만으로 콘텐츠를 가져올 수 있도록 설계했습니다.
-   **데이터 파서 구현**: Notion API가 반환하는 복잡한 Block 구조의 데이터를 프론트엔드에서 사용하기 쉬운 JSON 형태로 변환하는 파서를 직접 구현했습니다. 특히, 중첩된 블록(들여쓰기, 컬럼 등)을 재귀적으로 탐색하여 원본 문서의 계층 구조를 유지했습니다.
-   **성능 최적화 (SSG)**: `getStaticProps` (App Router의 `generateStaticParams`)를 활용하여 빌드 시점에 Notion 데이터를 가져와 정적 페이지로 생성했습니다. 이를 통해 빠른 페이지 로딩 속도(FCP)와 우수한 SEO 점수를 확보했습니다.

**결과:** 외부 API를 활용한 서비스 통합 능력, 복잡한 데이터를 목적에 맞게 가공하는 능력, 그리고 웹 성능 최적화(SSG)에 대한 깊은 이해를 증명할 수 있었습니다.

### 2. `react-three-fiber`를 이용한 인터랙티브 3D 갤러리

**문제 인식:** 일반적인 2D 그리드 레이아웃은 사용자의 흥미를 유발하기에 한계가 있다고 판단하여, 더 몰입감 있는 경험을 제공하고자 했습니다.

**해결 방안:** `react-three-fiber`를 사용하여 3D 갤러리 공간을 구현했습니다.

-   **동적 객체 생성**: Notion에서 가져온 프로젝트 데이터를 기반으로 3D 공간에 액자(`Frame`)와 캡션을 동적으로 생성했습니다. 이미지 원본 비율에 따라 액자 크기가 자동으로 조절되도록 로직을 구현했습니다.
-   **반응형 3D 캔버스**: 모바일과 데스크톱 환경 모두에서 최적의 경험을 제공하기 위해 `useThree` 훅으로 뷰포트 너비를 감지했습니다. 모바일에서는 객체의 `scale`과 객체 간의 `gap`을 동적으로 줄여 화면에 맞게 렌더링했습니다.
-   **모바일 터치 인터랙션**: `react-use-gesture` 라이브러리를 도입하여, 모바일 사용자가 터치 드래그(스와이프)를 통해 직관적으로 갤러리를 탐색할 수 있도록 UX를 개선했습니다.

**결과:** Three.js와 같은 복잡한 라이브러리를 학습하고 실제 프로젝트에 적용하는 능력, 3D 공간에서의 사용자 인터랙션 및 반응형 디자인 구현 능력, 그리고 성능을 고려한 3D 렌더링 최적화 경험을 쌓았습니다.

### 3. AI 챗봇 어시스턴트 구현

**문제 인식:** 사용자가 포트폴리오에 대해 궁금한 점이 생겼을 때, 수동적으로 정보를 찾는 대신 즉각적인 답변을 얻을 수 있는 창구가 필요하다고 판단했습니다.

**해결 방안:** Vercel AI SDK와 Next.js API Route를 활용하여 AI 챗봇을 구현했습니다.

-   **서버리스 백엔드**: Next.js의 API Route를 사용하여 별도의 서버 없이 백엔드 로직을 구현했습니다. 사용자의 질문, 대화 기록, Notion에서 가져온 프로젝트/이력서 데이터를 함께 AI 모델에 전달하여 컨텍스트에 맞는 답변을 생성하도록 했습니다.
-   **스트리밍 응답**: Vercel AI SDK의 `StreamingTextResponse`를 사용하여, AI가 생성하는 답변을 실시간 스트리밍 형태로 프론트엔드에 전송했습니다. 이를 통해 사용자는 실제 대화처럼 즉각적인 피드백을 받을 수 있어 UX가 크게 향상되었습니다.
-   **제안 액션(Suggested Action)**: AI가 답변과 함께 특정 페이지로 이동을 제안하는 '액션'을 반환할 수 있도록 설계했습니다. 예를 들어, "프로젝트 보여줘"라는 질문에 프로젝트 갤러리로 바로 이동하는 버튼을 제공하여 사용자의 다음 행동을 유도했습니다.

**결과:** 서버리스 아키텍처(API Routes)에 대한 이해 및 활용 능력, AI SDK를 활용한 LLM 기반 서비스 개발 경험, 그리고 사용자 경험을 고려한 비동기 데이터 처리 및 인터페이스 설계 능력을 갖추게 되었습니다.

---

## 시작하기

1.  **저장소 복제**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **종속성 설치**
    ```bash
    npm install
    ```

3.  **환경 변수 설정**
    `.env.local` 파일을 생성하고 아래 내용을 작성합니다.
    ```env
    # Notion
    NOTION_API_KEY=
    NOTION_DATABASE_ID=
    NOTION_PORTFOLIO_PAGE_ID=

    # OpenAI (Optional)
    OPENAI_API_KEY=
    ```

4.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

    브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.
