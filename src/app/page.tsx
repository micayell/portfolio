import { getProjects, getPageContent, getResumeData } from "@/lib/notion";
import ClientPage from "./ClientPage";

// 빌드 타임에 실행됨 (SSG)
export default async function Home() {
  const resumeData = await getResumeData();
  const fetchedProjects = await getProjects();
  
  const projects = [];
  
  try {
    // Notion API 속도 제한 고려하여 순차적으로 본문 내용 가져오기
    for (const project of fetchedProjects) {
      if (project.pageId) {
        // 본문 내용(blocks) 미리 가져오기 (+이미지 다운로드 트리거)
        const blocks = await getPageContent(project.pageId, project.id, false);
        projects.push({ ...project, blocks });
      } else {
        projects.push(project);
      }
    }

  } catch (error) {
    console.error("Failed to fetch projects at build time:", error);
    // 에러 발생 시 빈 배열 반환 (또는 적절한 에러 UI 처리를 위해 빈 배열 유지)
  }

  // 직렬화 이슈 해결을 위해 일반 객체로 전달 (Next.js가 자동 처리)
  return <ClientPage initialProjects={projects} resumeData={resumeData} />;
}
