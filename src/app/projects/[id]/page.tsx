import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) return notFound();

  return (
    <article className="max-w-4xl mx-auto px-6 py-20">
      {/* 헤더 섹션 */}
      <header className="mb-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-black dark:hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold mb-6">{project.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{project.description}</p>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
          
          {/* 링크 버튼 */}
          <div className="flex gap-3 ml-auto">
            {project.githubUrl && (
               <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition">
                 GitHub
               </a>
            )}
            {project.demoUrl && (
               <a href={project.demoUrl} target="_blank" rel="noreferrer" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900 transition">
                 Live Demo
               </a>
            )}
          </div>
        </div>
      </header>

      {/* 1. 프로젝트 개요 (Overview) */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-4">프로젝트 개요</h2>
        <div className="grid md:grid-cols-3 gap-8 bg-gray-50 dark:bg-zinc-900 p-8 rounded-2xl">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">목표</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.overview.goal}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">배경</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.overview.background}</p>
            </div>
          </div>
          <div className="space-y-4 border-l pl-0 md:pl-8 border-gray-200 dark:border-gray-700">
            <div>
              <span className="text-sm text-gray-500 block mb-1">진행 기간</span>
              <span className="font-medium">{project.overview.period}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">참여 인원</span>
              <span className="font-medium">{project.overview.members}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">담당 역할</span>
              <span className="font-medium">{project.overview.role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 사용 기술 (Skills) */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-green-500 pl-4">사용 기술 및 선정 이유</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* 2열로 변경 추천 (내용 길어질 수 있어서) */}
  {project.skills.map((skill) => (
    <div 
      key={skill.name} 
      className="group bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5 transition-all duration-300 hover:shadow-md"
    >
      {/* 1. 헤더 (항상 보임) */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          {skill.name}
        </h3>
        {/* 화살표 아이콘 (펼쳐질 때 돌아가게) */}
        <span className="text-gray-400 transition-transform duration-300 group-hover:rotate-180">
          ▼
        </span>
      </div>

      {/* 2. 내용 (평소엔 높이 0 -> 호버 시 늘어남) */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {skill.reason}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
      </section>

      {/* 3. 핵심 기능 (Features) */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-purple-500 pl-4">핵심 기능 및 구현</h2>
        <div className="space-y-12">
          {project.features.map((feature, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                    {index + 1}
                  </span>
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                  {feature.description}
                </p>
              </div>
              {/* 이미지가 있다면 여기에 렌더링 (지금은 없어서 생략) */}
              {/* <div className="flex-1 h-64 bg-gray-100 rounded-xl w-full"></div> */}
            </div>
          ))}
        </div>
      </section>

      {/* 4. 트러블 슈팅 (Trouble Shooting) */}
      {project.troubleShooting && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-500 pl-4">문제 해결 사례</h2>
          <div className="space-y-6">
            {project.troubleShooting.map((ts, index) => (
              <div key={index} className="bg-white dark:bg-black border dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-red-600">⚠️ {ts.problem}</h3>
                <div className="space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Solution</span>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{ts.solution}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Result</span>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{ts.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
