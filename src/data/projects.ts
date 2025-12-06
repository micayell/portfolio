import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "개발자 포트폴리오",
    description: "Next.js 기반 정적 웹사이트",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    githubUrl: "https://github.com/micayell/portfolio",
    thumbnailUrl: "/images/portfolio/thumbnail.png",

    overview: {
      goal: "비용 없이 유지보수가 쉬운 나만의 포트폴리오 구축",
      background:
        "기존 노션 포트폴리오의 디자인적 한계를 극복하고, Next.js 학습 내용을 실제 결과물로 만들기 위함.",
      role: "Front-end 개발 및 UI/UX디자인 (100%)",
      period: "2025.11.25 - 진행 중",
      members: "1인 프로젝트",
    },

    skills: [
      {
        name: "Next.js",
        reason:
          "SEO 최적화와 Static Export 기능을 통해 별도 서버 없이 GitHub Pages 배포가 가능하여 선택",
      },
      {
        name: "TypeScript",
        reason:
          "타입 안정성을 통해 런타임 오류를 사전에 방지하고 코드 가독성을 향상시키기 위함",
      },
      {
        name: "Tailwind CSS",
        reason:
          "클래스명 고민 시간을 줄이고 일관된 디자인 시스템을 빠르게 구축하기 위함",
      },
    ],

    features: [
      {
        title: "다크 모드 지원",
        description:
          "사용자 시스템 설정에 따른 자동 테마 감지 및 수동 토글 기능 구현",
      },
      {
        title: "반응형 디자인",
        description: "모바일, 태블릿, 데스크탑 환경에 최적화된 UI/UX 제공",
      },
    ],

    troubleShooting: [
      {
        problem: "GitHub Pages 배포 시 이미지 경로 깨짐",
        solution:
          "Next.js의 basePath 설정을 환경변수로 분기 처리하여 로컬과 프로덕션 환경 모두 대응",
        result: "배포 후에도 이미지가 정상적으로 로딩되도록 개선",
      },
    ],
  },

  // ▼ PlatePay 프로젝트 수정
  {
    id: "platepay",
    title: "PlatePay",
    description: "차량 번호판 및 안면 인식 기반 간편 결제 서비스",
    tags: ["React Native", "React", "TypeScript", "Zustand"],
    githubUrl: "https://github.com/micayell/Plate-Pay",
    award: "자율 프로젝트 우수상",
    thumbnailUrl: "/images/platepay/thumbnail.png",
    figmaUrl:
      "https://www.figma.com/design/tJSVwWscnNN7JZKdNdP1Hy/PlatePay?node-id=0-1&p=f&t=DW6B2ZbWWdRBgy8w-0",
    overview: {
      goal: "차량 제조사/연식 무관, '빈손'으로 결제 가능한 범용 간편결제 솔루션 구축",
      background:
        "드라이브스루/주차장 결제 시의 불편함 해소 및 자동 결제 시스템 구현",
      role: "Frontend Developer (Mobile App, Web Kiosk) - 기여도 60%",
      period: "2025.08.25 - 2025.09.29",
      members: "6인 (Back 3, Front 2, AI 1)",
    },

    skills: [
      { name: "React Native", reason: "하이브리드 앱 개발 및 WebView 연동" },
      {
        name: "TypeScript",
        reason: "정적 타입 검사를 통한 결제 로직 안정성 확보",
      },
      { name: "Zustand", reason: "전역 상태 관리 (사용자 정보, 결제 상태 등)" },
      { name: "FCM", reason: "결제 알림 등 푸시 메시지 기능 구현" },
    ],

    features: [
      {
        title: "하이브리드 인증 시스템",
        description:
          "WebView 활용 OAuth 2.0 소셜 로그인(SSAFY, 카카오) 및 회원가입",
      },
      {
        title: "차량 등록 프로세스",
        description:
          "Codef API 및 카카오 인증 연동을 통한 실소유주 검증 및 차량 등록",
      },
      {
        title: "은행 채널계 프로세스",
        description: "1원 계좌 인증 시각화 및 은행 계좌 앱/키오스크 결제 구현",
      },
    ],

    troubleShooting: [
      {
        problem: "OAuth 로그인 시 WebView 쿠키/캐시 잔존 문제",
        solution: "WebView 세션 관리 로직 개선 및 로그아웃 시 클리어 처리",
        result: "보안성 강화 및 로그인/회원가입 UX 개선",
      },
      {
        problem: "React Native 라이브러리 의존성 충돌",
        solution: "버전 호환성 검토 및 의존성 정리",
        result: "개발 환경 안정화 및 빌드 오류 해결",
      },
      {
        problem: "백엔드 연동 이슈",
        solution: "RESTful API 연동을 통한 데이터 처리 로직 구현",
        result: "원활한 데이터 통신 및 서비스 기능 정상화",
      },
    ],
  },

  // ▼ SMARTWINDOW 프로젝트 수정
  {
    id: "smartwindow",
    title: "SMARTWINDOW",
    description: "창문형 디스플레이를 활용한 스마트 창문 시스템",
    tags: ["React Native", "TypeScript", "TanStack Query", "IoT"],
    githubUrl: "https://github.com/S13P31C101/smart-window",
    award: "특화 프로젝트 우수상",
    thumbnailUrl: "/images/smartwindow/thumbnail.png",
    figmaUrl:
      "https://www.figma.com/design/C48gQXKjWRSPIRSESz3Hy9/SMART_WINDOW?node-id=0-1&t=aJbPIdDlKUU1xwtS-1",

    overview: {
      goal: "창문의 물리적 제약(벽 뷰, 사생활 침해)을 디지털 기술로 해결하고 새로운 공간 경험 제공",
      background:
        "답답한 뷰 대신 개방감과 감성적인 뷰로 전환하고, 사용자와 공간이 상호작용하는 미래형 스마트 홈 디바이스 제시",
      role: "FE(APP) 개발(100%), BE 기능 일부 개발(OAuth, User, Token)",
      period: "2025.10.13 - 2025.11.20",
      members: "6인 (BE 1, APP 1, QT 2, HW 1, AI 1)",
    },

    skills: [
      {
        name: "React Native",
        reason: "모바일 앱 기반 창문 제어 인터페이스 구현",
      },
      {
        name: "TanStack Query",
        reason: "서버 상태 관리 및 데이터 캐싱 효율화",
      },
      {
        name: "BLE (Bluetooth)",
        reason: "스마트 윈도우 하드웨어와의 근거리 무선 통신 구현",
      },
      { name: "FCM", reason: "푸시 알림 서비스 연동" },
    ],

    features: [
      {
        title: "IoT 기기 제어",
        description: "BLE 통신 기반 스마트 윈도우 개폐 제어 및 상태 동기화",
      },
      {
        title: "생성형 AI 서비스",
        description:
          "촬영 이미지 기반 시간대별(밤/낮/노을) 분위기 변환 및 객체 제거",
      },
      {
        title: "스마트 알람",
        description: "하드웨어 타이머 연동을 통한 예약된 시간 작동 기능",
      },
      {
        title: "인증 및 알림",
        description: "OAuth 2.0(구글, 카카오, 네이버) 로그인 및 FCM 푸시 알림",
      },
    ],

    troubleShooting: [
      {
        problem: "앱과 임베디드 기기 간의 통신 프로토콜 정의 및 연동 난이도",
        solution: "HW-SW 인터페이스 최적화를 통해 IoT 서비스의 E2E 흐름 체득",
        result: "안정적인 기기 제어 및 상태 동기화 구현",
      },
      {
        problem: "React Native 버전 업그레이드 및 라이브러리 의존성 충돌",
        solution: "공식 문서 리딩을 통한 버전 호환성 검토 및 문제 해결",
        result: "개발 환경 안정화 및 빌드 성공",
      },
    ],
  },

  // ▼ YOLO Bring it 프로젝트 추가
  {
    id: "yolo-bring-it",
    title: "YOLO Bring it",
    description: "WebRTC 기반 실시간 화상 인터랙티브 게임 서비스",
    tags: ["React", "Three.js", "WebRTC", "Zustand"],
    githubUrl: "https://github.com/micayell/YOLO-Bring-it",
    thumbnailUrl: "/images/yolo-bring-it/thumbnail.png",
    figmaUrl:
      "https://www.figma.com/design/Fk2VmugN9SOsjehUwyvQgg/SSAFY%EA%B3%B5%ED%86%B5%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8--%EA%B9%80%EC%B0%BD%EC%A3%BC-?node-id=40-2&t=ydZmbW4YFXgxjjBR-1",

    overview: {
      goal: "화상 연결을 통해 친구들과 함께 즐기는 인터랙티브 게임 경험 제공",
      background: "비대면 환경에서도 실감 나는 소통과 재미를 제공하기 위함",
      role: "FrontEnd 개발, UX/UI 디자인",
      period: "2025.07.07 ~ 2025.08.18",
      members: "팀 프로젝트",
    },

    skills: [
      {
        name: "React & Three.js",
        reason: "웹 기반 3D 그래픽 및 인터랙티브 UI 구현",
      },
      {
        name: "WebRTC & Livekit",
        reason: "실시간 화상 통신 및 데이터 전송 구현",
      },
      { name: "Zustand", reason: "글로벌 상태 관리" },
    ],

    features: [
      {
        title: "AI 미니게임",
        description:
          "표정과 움직임으로 즐기는 인터랙티브 게임 (YOLOV8, DeepFace 활용)",
      },
      {
        title: "3D 캐릭터 & 커뮤니티",
        description: "개성 있는 3D 캐릭터 커스터마이징 및 랭킹/친구 시스템",
      },
    ],

    troubleShooting: [
      {
        problem: "복잡한 실시간 통신 아키텍처 구현 난이도",
        solution: "MSA 아키텍처 적용 및 Livekit 클라우드 활용",
        result: "안정적인 화상 통신 및 게임 데이터 동기화 구현",
      },
    ],
  },

  // ▼ BankInsight 프로젝트 추가
  {
    id: "bank-insight",
    title: "BankInsight",
    description: "AI 기반 금융 로보어드바이저 웹 애플리케이션",
    tags: ["Python", "Django", "Vue.js", "OpenAI"],
    githubUrl: "https://lab.ssafy.com/micayell98/final-pjt",
    thumbnailUrl: "/images/bank-insight/thumbnail.png",

    overview: {
      goal: "사용자 성향 분석 기반 맞춤형 금융 상품 추천 및 포트폴리오 제공",
      background:
        "복잡한 금융 상품 정보를 쉽게 비교하고 개인화된 추천을 받기 위함",
      role: "Backend 전담 (Django REST API, OpenAI 연동)",
      period: "2025.05.22 - 2025.05.28",
      members: "2인 (풀스택 개발)",
    },

    skills: [
      {
        name: "Django & DRF",
        reason: "RESTful API 서버 구축 및 금융 데이터 처리",
      },
      { name: "OpenAI API", reason: "챗봇 형태의 지능형 금융 상담 기능 구현" },
      { name: "Vue.js & Pinia", reason: "프론트엔드 구현 및 상태 관리 (협업)" },
    ],

    features: [
      {
        title: "AI 금융 상담 챗봇",
        description: "자연어 처리를 통한 금융 상품 추천 및 상담",
      },
      {
        title: "맞춤형 포트폴리오",
        description: "사용자 성향(공격/안전 등)에 따른 자산 구성 제안",
      },
      {
        title: "지도 기반 은행 검색",
        description: "위치 기반 주변 은행 찾기 서비스",
      },
    ],

    troubleShooting: [
      {
        problem: "단순 기능 구현을 넘어선 실질적 가치 제공 고민",
        solution: "사용자 중심 요구사항 재구성 및 외부 API(OpenAI) 적극 활용",
        result: "완성도 높은 금융 서비스 구현 및 문제 해결 역량 향상",
      },
    ],
  },
];
