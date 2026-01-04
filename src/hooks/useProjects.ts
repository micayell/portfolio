import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { projects as fallbackProjects } from "@/data/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        
        const data = await res.json();
        
        if (isMounted) {
          // 데이터가 비어있으면 백업 데이터 사용 (개발 중 편의성)
          setProjects(data.length > 0 ? data : fallbackProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setProjects(fallbackProjects); // 에러 발생 시에도 백업 데이터 보여주기 (선택사항)
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProjects();

    return () => { isMounted = false; };
  }, []);

  return { projects, loading, error };
}