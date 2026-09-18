import { getProjects, getPageContent, getResumeData } from "@/features/common/lib/notion";
import ClientPage from "./ClientPage";

// ISR: 1시간마다 데이터 갱신
export const revalidate = 3600;

// 빌드 타임에 실행됨 (SSG)
export default async function Home() {
  const resumeData = await getResumeData();
  const fetchedProjects = await getProjects();
  
  try {
    // 순차적(O(N)) for문 대신 병렬(Promise.all) 매핑으로 O(1) 복잡도 해결
    // 단, 노션 API 429 방지를 위해 index 기반 단순 지연(Stagger) 적용
    const projects = await Promise.all(
      fetchedProjects.map(async (project, index) => {
        if (project.pageId) {
          // 인덱스 * 400ms 만큼 기다렸다가 요청 (간단한 병목 우회)
          await new Promise((resolve) => setTimeout(resolve, index * 400));
          const blocks = await getPageContent(project.pageId, project.id, false);
          return { ...project, blocks };
        }
        return project;
      })
    );

    return <ClientPage initialProjects={projects} resumeData={resumeData} />;
  } catch (error) {
    console.error("Failed to fetch projects at build time:", error);
    return <ClientPage initialProjects={fetchedProjects} resumeData={resumeData} />;
  }
}
