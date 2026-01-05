import { getProject, getPageContent, getProjects } from "@/lib/notion";
import { notFound } from "next/navigation";
import Link from "next/link";
import TroubleShooting from "@/components/ui/TroubleShooting";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: project.id, // URL의 [id] 부분에 들어갈 값들
  }));
}

// 텍스트 스타일 렌더러
const Text = ({ text }: { text: any }) => {
  if (!text) return null;
  const { annotations } = text;
  
  const styleClasses = [
    annotations.bold ? "font-bold" : "",
    annotations.italic ? "italic" : "",
    annotations.strikethrough ? "line-through" : "",
    annotations.underline ? "underline" : "",
    annotations.code ? "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm text-red-500" : "",
    annotations.color !== "default" ? `text-${annotations.color}-500` : "",
  ].join(" ");

  if (text.href) {
    return (
      <a href={text.href} target="_blank" rel="noreferrer" className={`text-blue-500 hover:underline ${styleClasses}`}>
        {text.plain_text}
      </a>
    );
  }
  return <span className={styleClasses}>{text.plain_text}</span>;
};

// 블록 렌더러
const RenderBlock = ({ block }: { block: any }) => {
  const { type } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-7 min-h-[1.5rem]">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </p>
      );
    case "heading_1":
      return (
        <h1 className="text-3xl font-bold mt-12 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="text-2xl font-bold mt-10 mb-4 border-l-4 border-blue-500 pl-3">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </h3>
      );
    case "bulleted_list_item":
      return (
        <div className="flex mb-1 ml-4 items-start">
          <span className="mr-2 text-gray-700 dark:text-gray-300">•</span>
          <div className="text-gray-700 dark:text-gray-300 leading-7">
             {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
          </div>
        </div>
      );
    case "numbered_list_item":
      return (
        <div className="flex mb-1 ml-4 items-start">
          <span className="mr-2 text-gray-700 dark:text-gray-300">1.</span>
          <div className="text-gray-700 dark:text-gray-300 leading-7">
             {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
          </div>
        </div>
      );
    case "image":
      const imageUrl = value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption?.[0]?.plain_text || "";
      return (
        <figure className="my-8 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt={caption || "project image"} 
            className="rounded-xl shadow-lg border dark:border-gray-800 max-h-[600px] w-auto object-contain"
          />
          {caption && <figcaption className="text-gray-500 mt-2 text-sm text-center">{caption}</figcaption>}
        </figure>
      );
    case "divider": 
      return <hr className="my-8 border-t border-gray-200 dark:border-gray-700" />;
    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 py-1 my-4 italic text-gray-600 dark:text-gray-400">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </blockquote>
      );
    case "callout":
      return (
        <div className="flex p-4 my-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="mr-3 text-xl">{value.icon?.emoji || "💡"}</div>
          <div className="text-gray-700 dark:text-gray-300 leading-7">
            {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // 1. 프로젝트 메타데이터 가져오기
  const project = await getProject(id);

  if (!project) return notFound();

  // 2. 본문 내용 가져오기 (pageId 사용)
  const blocks = project.pageId ? await getPageContent(project.pageId) : [];

  return (
    <article className="max-w-4xl mx-auto px-6 py-20 pb-40">
      {/* 헤더 섹션: 타이틀, 태그, 링크 (유지) */}
      <header className="mb-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-black dark:hover:text-white mb-8 inline-block transition-colors">
          ← Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold mb-6 break-keep leading-tight">{project.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{project.description}</p>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3 ml-auto">
            {project.githubUrl && (
               <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition">GitHub</a>
            )}
            {project.demoUrl && (
               <a href={project.demoUrl} target="_blank" rel="noreferrer" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900 transition">Live Demo</a>
            )}
            {project.figmaUrl && (
               <a href={project.figmaUrl} target="_blank" rel="noreferrer" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900 transition">Figma</a>
            )}
          </div>
        </div>
      </header>

      {/* Overview 섹션 삭제됨 (본문으로 대체) */}

      {/* 본문 렌더링 */}
      <section className="prose dark:prose-invert max-w-none mb-20">
        {blocks.length > 0 ? (
          blocks.map((block: any) => <RenderBlock key={block.id} block={block} />)
        ) : (
          <p className="text-gray-500 italic text-center py-10">작성된 본문 내용이 없습니다.</p>
        )}
      </section>
      
      {/* 트러블 슈팅 섹션 삭제됨 (본문으로 대체) */}
    </article>
  );
}