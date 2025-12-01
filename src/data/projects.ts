import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "개발자 포트폴리오",
    description: "Next.js 기반 정적 웹사이트",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    thumbnailUrl: "/images/portfolio/thumbnail.png",
    
    overview: {
      goal: "비용 없이 유지보수가 쉬운 나만의 포트폴리오 구축",
      background: "기존 노션 포트폴리오의 디자인적 한계를 극복하고, Next.js 학습 내용을 실제 결과물로 만들기 위함.",
      role: "Front-end 개발 및 UI/UX디자인 (100%)",
      period: "2025.11.25 - 진행 중",
      members: "1인 프로젝트",
    },
    
    skills: [
      { name: "Next.js", reason: "SEO 최적화와 Static Export 기능을 통해 별도 서버 없이 GitHub Pages 배포가 가능하여 선택" },
      { name: "TypeScript", reason: "타입 안정성을 통해 런타임 오류를 사전에 방지하고 코드 가독성을 향상시키기 위함" },
      { name: "Tailwind CSS", reason: "클래스명 고민 시간을 줄이고 일관된 디자인 시스템을 빠르게 구축하기 위함" }
    ],
    
    features: [
      { title: "다크 모드 지원", description: "사용자 시스템 설정에 따른 자동 테마 감지 및 수동 토글 기능 구현" },
      { title: "반응형 디자인", description: "모바일, 태블릿, 데스크탑 환경에 최적화된 UI/UX 제공" }
    ],
    
    troubleShooting: [
      {
        problem: "GitHub Pages 배포 시 이미지 경로 깨짐",
        solution: "Next.js의 basePath 설정을 환경변수로 분기 처리하여 로컬과 프로덕션 환경 모두 대응",
        result: "배포 후에도 이미지가 정상적으로 로딩되도록 개선"
      }
    ]
  },
  
  // ▼ PlatePay 프로젝트 추가
  {
    id: "platepay",
    title: "PlatePay",
    description: "차량 번호판 및 안면 인식 기반 간편 결제 서비스",
    tags: ["React Native", "React", "TypeScript", "Zustand"],
    thumbnailUrl: "/images/platepay/thumbnail.png", 
    
    overview: {
      goal: "지갑/스마트폰 없이 '빈손'으로 결제 가능한 드라이브스루/주차장 통합 결제 플랫폼 구축",
      background: "드라이브스루/주차장 결제 시의 불편함과 안전 사고 위험을 해소하고 결제 시간을 단축하기 위함.",
      role: "Frontend Developer (Mobile App, Web Kiosk), UI/UX 디자인 - 기여도 60%",
      period: "2025.08.25 - 2025.09.29",
      members: "백엔드 3, 프론트 2, AI 1",
    },
    
    skills: [
      { name: "React Native", reason: "iOS/Android 동시 배포 생산성 및 Vision Camera 등 네이티브 모듈 활용 용이" },
      { name: "Zustand", reason: "Redux 대비 적은 보일러플레이트와 직관적인 API로 복잡한 상태 효율적 관리" },
      { name: "TypeScript", reason: "결제 정보 등 민감 데이터 처리를 위한 정적 타입 검사로 런타임 에러 방지" },
      { name: "face-api.js", reason: "서버 통신 없이 클라이언트(키오스크) 단에서 빠른 안면 인식 피드백 제공" }
    ],
    
    features: [
      { title: "앱: 사용자 친화적 기능", description: "OCR 기반 차량 등록, 도메인별 모듈화 설계, 소비 패턴 시각화(Skia)" },
      { title: "키오스크: 직관적 결제", description: "실시간 차량 조회(Debouncing), 웹캠 안면 인식 결제, 비밀번호 결제" }
    ],
    
    troubleShooting: [
      {
        problem: "백엔드 API 응답 포맷(DTO vs Primitive)의 불규칙한 변경으로 인한 잦은 에러",
        solution: "API 계층에 Adapter Pattern 및 방어 코드 적용, Mock Data 폴백 메커니즘 구축",
        result: "백엔드 수정 없이 프론트엔드 안정성 확보 및 성공적인 데모 시연"
      }
    ]
  },
  {
    id: "bankinsight",
    title: "BankInsight",
    description: "사용자 금융 성향 분석 기반 맞춤형 금융 상품 추천 및 자산 관리 서비스",
    tags: ["Vue.js", "Django", "Python", "OpenAI API"],
    thumbnailUrl: "/images/bank-insight/thumbnail.png", // 썸네일 이미지 경로 (추후 추가 필요)
    
    overview: {
      goal: "사용자 금융 프로필 및 데이터를 분석하여 최적의 금융 상품을 추천하고 정보 공유 커뮤니티 제공",
      background: "시중의 수많은 금융 상품을 일일이 비교하기 어렵고, 개별 자산 관리를 원하는 사용자들의 니즈를 충족시키기 위함",
      role: "BackEnd 및 FrontEnd 개발, UX/UI 디자인 (팀원 2명)",
      period: "2025.05.22 ~ 2025.05.28",
      members: "2인 프로젝트",
    },
    
    skills: [
      { name: "Vue.js", reason: "컴포넌트 기반의 직관적인 UI 구축과 SPA(Single Page Application) 개발을 위해 선택" },
      { name: "Django", reason: "Python 기반의 강력한 ORM과 보안 기능을 제공하여 안정적인 백엔드 API 서버 구축 용이" },
      { name: "Pinia", reason: "Vue.js 애플리케이션의 전역 상태 관리를 효율적으로 처리하기 위함" },
      { name: "OpenAI API", reason: "GPT-4o-mini 모델을 활용하여 개인 맞춤형 금융 상담 챗봇 기능을 구현하기 위해 도입" }
    ],
    
    features: [
      { title: "AI 금융 챗봇", description: "GPT-4o-mini 기반으로 개인 맞춤형 금융 상담 및 상품 추천 대화 기능 제공" },
      { title: "맞춤형 상품 추천", description: "사용자 금융 정보 및 유사 사용자/연령대 데이터를 기반으로 최적의 예/적금 상품 추천" },
      { title: "지도 기반 은행 찾기", description: "카카오맵 API를 연동하여 현재 위치 또는 지역별 은행 지점 검색 기능" },
      { title: "금융 상품 비교", description: "기간별 금리 비교 차트 제공 및 은행별 상품 상세 검색 지원" }
    ],
    
    troubleShooting: [
      {
        problem: "복잡한 금융 상품 데이터의 효율적인 비교 및 시각화",
        solution: "Chart.js 라이브러리를 활용하여 기간별 금리 변화를 시각적으로 표현하고, 필터링 기능을 고도화함",
        result: "사용자가 직관적으로 상품 간의 금리 차이를 비교하고 원하는 조건의 상품을 빠르게 찾을 수 있게 됨"
      }
    ],

    // 성과/회고 내용은 상세 페이지 하단이나 별도 섹션에 보여줄 수 있도록 추가 필드가 필요할 수 있음 (일단 overview 등에 녹여냄)
  },
  {
    id: "yolo-bring-it",
    title: "YOLO Bring it!",
    description: "LiveKit 기반 실시간 화상 인터랙티브 미니게임 플랫폼",
    tags: ["React", "TypeScript", "Three.js", "LiveKit"],
    thumbnailUrl: "/images/yolo-bring-it/thumbnail.png",
    
    overview: {
      goal: "LiveKit을 활용하여 자신의 표정과 움직임으로 즐기는 인터랙티브 게임 플랫폼 개발",
      background: "단순한 화상 통화를 넘어, 사용자들이 더욱 몰입감 있고 활발하게 교류할 수 있는 새로운 소셜 게이밍 경험을 제공하고자 함",
      role: "Front-End 개발, UI/UX 디자인, 실시간 상태 관리 로직 구현",
      period: "2025.07.07 ~ 2025.08.18 (7주)",
      members: "6인 프로젝트 (FE 2, BE 3, AI 1)",
    },
    
    skills: [
      { name: "React", reason: "컴포넌트 기반 UI 구축과 생태계가 풍부하여 복잡한 게임 UI를 효율적으로 개발하기 위해 선택" },
      { name: "LiveKit", reason: "WebRTC 기반의 안정적인 실시간 화상/음성 통신을 저지연으로 구현하기 위해 도입" },
      { name: "Three.js", reason: "웹 브라우저상에서 고성능 3D 캐릭터와 환경을 렌더링하기 위해 사용" },
      { name: "Tailwind CSS", reason: "빠른 스타일링과 반응형 레이아웃을 손쉽게 구현하기 위해 선택" },
      { name: "Zustand", reason: "Redux보다 가볍고 직관적인 전역 상태 관리 라이브러리로 게임 상태를 효율적으로 관리" }
    ],
    
    features: [
      { title: "인터랙티브 미니게임", description: "AI(YOLOv8, DeepFace)가 표정과 움직임을 인식하여 진행하는 실시간 화상 게임" },
      { title: "3D 캐릭터 시스템", description: "Three.js를 활용한 개성 넘치는 3D 아바타 및 애니메이션 구현" },
      { title: "소셜 커뮤니티", description: "실시간 랭킹, 칭호, 업적 시스템을 통해 사용자 간 경쟁과 협력 유도" },
      { title: "아이템 상점", description: "게임 재화로 아이템을 구매하고 캐릭터를 꾸밀 수 있는 상점 시스템" }
    ],
    
    troubleShooting: [
      {
        problem: "실시간 게임 상태 동기화 지연 문제",
        solution: "STOMPjs 기반의 웹소켓 통신과 Zustand를 결합하여 게임 상태를 실시간으로 전파하고, Optimistic UI 업데이트 적용",
        result: "다수의 사용자가 참여하는 환경에서도 끊김 없는 부드러운 게임 플레이 경험 제공"
      },
      {
        problem: "복잡한 3D 모델 로딩 속도 이슈",
        solution: "Three.js 모델 경량화 및 Lazy Loading 적용, 주요 에셋 프리로딩 전략 사용",
        result: "초기 로딩 속도 40% 개선 및 렌더링 퍼포먼스 최적화"
      }
    ],
    
    // 이미지가 많으므로 상세 페이지에서 보여줄 이미지 경로들 (나중에 파일 넣으세요)
    images: [
       "/images/yolo/game-play.png",
       "/images/yolo/character.png",
       "/images/yolo/store.png"
    ]
  }
];
