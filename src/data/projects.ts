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
  }
  // 다른 프로젝트 추가...
];
