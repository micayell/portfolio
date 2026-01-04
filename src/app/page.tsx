import { getProjects } from "@/lib/notion";
import ClientPage from "./ClientPage"; // 같은 폴더에서 import
import { projects as fallbackProjects } from "@/data/projects";

// 빌드 타임에 실행됨 (SSG)
export default async function Home() {
  let projects = [];
  
  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Failed to fetch projects at build time:", error);
    projects = fallbackProjects;
  }

  if (projects.length === 0) {
    projects = fallbackProjects;
  }

  return <ClientPage initialProjects={projects} />;
}