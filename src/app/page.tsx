import Header from "@/components/ui/Header";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import About from "@/components/ui/About";
import Skills from "@/components/ui/Skills";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      {/* 1. 헤더 */}
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20 space-y-32"> 
        {/* pt-32: 헤더 아래 여백 넉넉하게, space-y-32: 섹션 간 간격 넓게 */}

        {/* 1. About Section */}
        <About />

        {/* 2. Skills Section */}
        <Skills />

        {/* 3. Projects Section */}
        <section id="projects" className="scroll-mt-24">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4 inline-block border-b-4 border-blue-500 pb-2">
              Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              사용자에게 가치를 더하는 서비스를 고민하고 구현합니다.
            </p>
          </div>
          
          <ProjectCarousel projects={projects} />
        </section>
      </main>
      
      {/* Footer 추가 (선택 사항) */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
        © 2025 Kim Chang Ju. All rights reserved.
      </footer>
    </div>
  );
}
