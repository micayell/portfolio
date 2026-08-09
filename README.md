# 포트폴리오 웹사이트

인터랙티브 3D 갤러리와 AI 어시스턴트가 결합된 모던한 포트폴리오 웹사이트입니다.

## 🚀 기술 스택

### 프론트엔드
- **Next.js 16** - React 기반 풀스택 프레임워크 (App Router)
- **React 19** - 최신 React 버전
- **TypeScript** - 타입 안전성 확보

### 3D 그래픽
- **Three.js** - WebGL 기반 3D 라이브러리
- **@react-three/fiber** - React용 Three.js 렌더러
- **@react-three/drei** - 유용한 Three.js 헬퍼 컴포넌트
- **@react-three/postprocessing** - 포스트 프로세싱 효과 (Bloom, SSAO 등)
- **maath** - 3D 수학 유틸리티

### UI/UX
- **Tailwind CSS 4** - 유틸리티 퍼스트 CSS 프레임워크
- **Framer Motion** - 강력한 애니메이션 라이브러리
- **Lucide React** - 아이콘 라이브러리
- **React Icons** - 브랜드 아이콘 (GitHub, LinkedIn 등)
- **Embla Carousel** - 터치 친화적 캐러셀
- **Next Themes** - 다크 모드 지원

### 데이터 & AI
- **Notion API** - 이력서, 프로젝트, 스킬 데이터 관리
- **Groq SDK** - 고성능 AI 추론 (LLM)
- **dotenv** - 환경 변수 관리

## 💡 주요 기능 및 문제 해결

### 1. 3D 인터랙티브 갤러리
**문제:** 일반적인 포트폴리오의 정적인 프로젝트 목록은 사용자의 관심을 끌기 어렵습니다.

**해결:** Three.js와 React Three Fiber를 활용하여 3D 공간에서 프로젝트를 탐색할 수 있는 인터랙티브 갤러리를 구현했습니다. 사용자는 마우스 드래그로 갤러리를 회전하고, 프로젝트를 클릭하여 상세 정보를 확인할 수 있습니다. 포스트 프로세싱 효과를 적용하여 시각적 품질을 높였습니다.

### 2. Notion과의 데이터 통합
**문제:** 포트폴리오 데이터를 업데이트할 때마다 코드를 수정하고 다시 배포해야 하는 번거로움이 있습니다.

**해결:** Notion을 CMS(Content Management System)로 활용하여 이력서, 프로젝트, 스킬 데이터를 동적으로 가져옵니다. Notion에서 데이터를 수정하면 자동으로 웹사이트에 반영되므로, 개발 지식 없이도 쉽 게 포트폴리오를 관리할 수 있습니다.

### 3. AI 기반 포트폴리오 어시스턴트
**문제:** 방문자가 원하는 정보를 빠르게 찾기 어렵고, 질문에 대한 답변을 제공할 수 없습니다.

**해결:** Groq SDK를 활용하여 AI 어시스턴트를 구현했습니다. 사용자의 질문에 실시간으로 답변하고, 관련 섹션으로 네비게이션을 제안합니다. 이로 인해 사용자 경험이 크게 개선되었습니다.

### 4. Vercel을 통한 안전한 배포
**문제:** API 키 노출 위험으로 인해 정적 사이트 배포에 제약이 있습니다.

**해결:** Vercel을 사용하여 서버리스 환경에서 API 라우트를 안전하게 실행합니다. 환경 변수는 서버 측에서만 접근 가능하므로 API 키 노출 위험이 없습니다.

### 5. 타입 안전성 확보
**문제:** JavaScript로 작성된 프로젝트는 런타임 에러가 발생하기 쉽습니다.

**해결:** 전체 프로젝트를 TypeScript로 마이그레이션하여 컴파일 타임에 타입 에러를 잡아냅니다. 특히 채팅 메시지, 액션 객체 등에 명확한 인터페이스를 정의하여 안정성을 높였습니다.

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
NOTION_PORTFOLIO_PAGE_ID=your_page_id
GROQ_API_KEY=your_groq_api_key

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 🚀 Vercel 배포

이 프로젝트는 Vercel에 배포되도록 설계되었습니다.

### 배포 방법

1. **Vercel 프로젝트 생성**
   ```bash
   npx vercel
   ```

2. **환경 변수 설정**
   Vercel 대시보드에서 다음 환경 변수를 추가하세요:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `NOTION_PORTFOLIO_PAGE_ID`
   - `GROQ_API_KEY`

3. **자동 배포**
   Git 리포지토리를 Vercel에 연결하면, `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다.

## 📂 프로젝트 구조

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API 라우트 (채팅, 데이터 fetching)
│   └── projects/    # 프로젝트 상세 페이지
├── components/      # React 컴포넌트
│   ├── canvas/      # 3D 씬 컴포넌트
│   └── ui/          # UI 컴포넌트
├── config/          # 설정 파일
├── data/            # 정적 데이터
├── hooks/           # 커스텀 훅
├── lib/             # 유틸리티 함수
└── types/           # TypeScript 타입 정의
```

## 🎨 주요 컴포넌트

- **GalleryScene** - 3D 프로젝트 갤러리
- **ChatInterface** - AI 어시스턴트 채팅 인터페이스
- **About** - 프로필 및 소개 섹션
- **Resume** - Notion에서 가져온 이력서
- **Skills** - 기술 스킬 목록
- **ProjectModal** - 프로젝트 상세 모달
