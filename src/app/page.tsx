import Header from "@/components/ui/Header";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* 1. 헤더 (상단 고정 네비게이션) */}
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        {/* 2. 자기소개 섹션 (Hero) */}
        <section className="py-20">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            안녕하세요, <br />
            개발자 <span className="text-blue-600">김창주</span>입니다.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            사용자 경험을 중요하게 생각하는 프론트엔드 개발자입니다.
            <br />
            새로운 기술을 배우고 적용하는 것을 좋아합니다.
          </p>
        </section>

        {/* 3. 프로젝트 목록 섹션 */}
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
