import { getProjects, getPageContent, getResumeData } from "@/features/common/lib/notion";
import ClientPage from "./ClientPage";

// ISR: 50분마다 재검증
export const revalidate = 3000;

// 빌드 타임에 호출 (SSG)
export default async function Home() {
  const resumeData = await getResumeData();
  const fetchedProjects = await getProjects();
  
  let finalProjects = fetchedProjects;
  try {
    // 병렬(O(N)) for문 대신 병렬(Promise.all) 호출로 O(1) 밀도 접근
    // 단, 노션 API 429 에러 방지를 위해 index 기반 단순 지연(Stagger) 적용
    finalProjects = await Promise.all(
      fetchedProjects.map(async (project, index) => {
        if (project.pageId) {
          // 인덱스 * 400ms 만큼 기다렸다가 요청 (간단한 속도 조절)
          await new Promise((resolve) => setTimeout(resolve, index * 400));
          const blocks = await getPageContent(project.pageId, project.id, true);
          return { ...project, blocks };
        }
        return project;
      })
    );
  } catch (error) {
    console.error("Failed to fetch projects at build time:", error);
  }

  // JSX 반환은 try/catch 밖에서 수행 (react-hooks/error-boundaries 에러 해결)
  return <ClientPage initialProjects={finalProjects} resumeData={resumeData} />;
}
