"use client"; // 👈 상태 관리를 위해 클라이언트 컴포넌트로 변경

import { useState } from "react"; // 👈 추가
import Header from "@/components/ui/Header";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import About from "@/components/ui/About";
import Skills from "@/components/ui/Skills";
import Intro from "@/components/ui/Intro";
import { projects } from "@/data/projects";

// 날짜 파싱 함수 (YYYY.MM.dd 추출)
function getStartDate(period: string): number {
  const match = period.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    // Date(년, 월-1, 일)
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).getTime();
  }
  return 0; // 날짜 없으면 0 (가장 오래된 것으로 취급)
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true); // 👈 인트로 표시 상태
  const [activeTab, setActiveTab] = useState("about"); // 초기 탭

  // 정렬 로직 (컴포넌트 내부로 이동)
  const sortedProjects = [...projects].sort((a, b) => {
    // 1. 수상 여부 확인 (award 속성이 있으면 수상작)
    const aHasAward = !!a.award; 
    const bHasAward = !!b.award;

    // 2. 수상작 우선 정렬
    if (aHasAward && !bHasAward) return -1; // a가 수상작이면 앞으로(왼쪽)
    if (!aHasAward && bHasAward) return 1;  // b가 수상작이면 앞으로(왼쪽)

    // 3. 같은 조건(둘 다 수상작 or 둘 다 일반작)이면 -> 최신순(날짜 내림차순) 정렬
    const dateA = getStartDate(a.overview.period);
    const dateB = getStartDate(b.overview.period);

    return dateB - dateA; // 최신 날짜가 먼저 오도록 (내림차순)
  });

  // 인트로 종료 핸들러
  const handleIntroClick = () => {
    setShowIntro(false);
    // 탭 방식이므로 스크롤 이동 불필요
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      
      {/* 🚀 1. 인트로 섹션 (조건부 렌더링 또는 오버레이) */}
      {showIntro && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-black transition-transform duration-700 ease-in-out">
           {/* Intro 컴포넌트에 클릭 핸들러 전달 */}
           <Intro onEnter={handleIntroClick} />
        </div>
      )}

      {/* 2. 본문 내용 (인트로가 사라지면 보임) */}
      <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        
        {/* Header에 현재 탭 상태 전달 */}
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-5xl mx-auto px-6 pt-32 pb-20"> 
          
          {/* 탭에 따라 조건부 렌더링 */}
          {activeTab === "about" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <About />
            </div>
          )}
          
          {activeTab === "skills" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Skills />
            </div>
          )}

          {activeTab === "projects" && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-4xl font-bold mb-4 inline-block border-b-4 border-blue-500 pb-2">
                  Projects
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  사용자에게 가치를 더하는 서비스를 고민하고 구현합니다.
                </p>
              </div>
              <ProjectCarousel projects={sortedProjects} />
            </section>
          )}

        </main>
        
        <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
          © 2025 Kim Chang Ju. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
