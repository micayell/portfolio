import { getProjects, getPageContent, getResumeData } from "@/lib/notion"; // getPageContent 추가
import ClientPage from "./ClientPage";
import { projects as fallbackProjects } from "@/data/projects";

// 빌드 타임에 실행됨 (SSG)
export const revalidate = 60; 

export default async function Home() {
  const [fetchedProjects, resumeData] = await Promise.all([
    getProjects(),
    getResumeData(),
  ]);
  
  let projects = [];
  
  try {
    const fetchedProjects = await getProjects();
    
    // Notion API 속도 제한 고려하여 순차적으로 본문 내용 가져오기
    projects = [];
    for (const project of fetchedProjects) {
      if (project.pageId) {
        // 본문 내용(blocks) 미리 가져오기
        const blocks = await getPageContent(project.pageId);
        projects.push({ ...project, blocks });
      } else {
        projects.push(project);
      }
    }

  } catch (error) {
    console.error("Failed to fetch projects at build time:", error);
    projects = fallbackProjects;
  }

  if (projects.length === 0) {
    projects = fallbackProjects;
  }

  return <ClientPage initialProjects={projects} resumeData={resumeData} />;
}