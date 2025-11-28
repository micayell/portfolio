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
  }
];
