import { getProjects, getPageContent, getResumeData } from "@/lib/notion";
import ClientPage from "./ClientPage";

// 빌드 타임에 실행됨 (SSG)
// GitHub Pages 배포 시 revalidate는 동작하지 않을 수 있으므로 제거하거나, 
// static export 설정을 확실히 하는 것이 좋습니다. 
// 일단 제거하여 완전 정적 빌드로 동작하게 합니다.
// export const revalidate = 60; 

export default async function Home() {
  console.log("[Page.tsx] Starting static page generation...");
  
  const resumeData = await getResumeData();
  console.log("[Page.tsx] Fetched Resume Data - Skills Categories:", Object.keys(resumeData.skills));
  console.log("[Page.tsx] Fetched Resume Data - Edu Count:", resumeData.educations.length);

  const fetchedProjects = await getProjects();
  
  const projects = [];
  
  try {
    // Notion API 속도 제한 고려하여 순차적으로 본문 내용 가져오기
    for (const project of fetchedProjects) {
      if (project.pageId) {
        // 본문 내용(blocks) 미리 가져오기 (+이미지 다운로드 트리거)
        const blocks = await getPageContent(project.pageId, project.id);
        projects.push({ ...project, blocks });
      } else {
        projects.push(project);
      }
    }

  } catch (error) {
    console.error("Failed to fetch projects at build time:", error);
    // 에러 발생 시 빈 배열 반환 (또는 적절한 에러 UI 처리를 위해 빈 배열 유지)
  }

  console.log("[Page.tsx] Passing data to ClientPage...");
  return <ClientPage initialProjects={projects} resumeData={resumeData} />;
}
