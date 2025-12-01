import Header from "@/components/ui/Header";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import About from "@/components/ui/About";
import Skills from "@/components/ui/Skills";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* 1. 헤더 (상단 고정 네비게이션) */}
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        {/* 1. About Section */}
        <About />

        {/* 2. Skills Section */}
        <Skills />

        {/* 3. Projects Section */}
        <section id="projects" className="py-10">
          <h2 className="text-3xl font-bold mb-8 border-b pb-2 border-gray-200 dark:border-gray-800">
            Projects
          </h2>
          
          {/* 기존 Grid 대신 Carousel 컴포넌트 사용 */}
          <ProjectCarousel projects={projects} />
          
        </section>
      </main>
    </div>
  );
}
