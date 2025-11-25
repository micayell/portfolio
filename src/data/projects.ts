export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "내 포트폴리오 웹사이트",
    description: "Next.js와 GitHub Pages를 이용해 만든 정적 웹사이트입니다.",
    tags: ["Next.js", "React", "Tailwind CSS"],
    imageUrl: "" // 나중에 이미지 넣으면 됨
  },
  // 다른 프로젝트 추가...
];
