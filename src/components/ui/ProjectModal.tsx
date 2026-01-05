"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/project";
import { X, Github, ExternalLink, Award, Figma } from "lucide-react";
import Image from "next/image";

// --- 텍스트 렌더러 ---
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

// --- 블록 렌더러 ---
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
        <h1 className="text-3xl font-bold mt-12 mb-6 font-serif text-black dark:text-white">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="text-2xl font-bold mt-10 mb-4 border-l-4 border-black dark:border-white pl-4 font-serif text-black dark:text-white">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2 text-black dark:text-white">
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
            className="rounded-sm shadow-md border dark:border-gray-800 max-h-[600px] w-auto object-contain"
          />
          {caption && <figcaption className="text-gray-500 mt-2 text-xs text-center font-serif italic">{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr className="my-12 border-t border-gray-200 dark:border-gray-800" />;
    case "quote":
      return (
        <blockquote className="border-l-2 border-black dark:border-white pl-6 py-2 my-8 italic text-lg text-gray-700 dark:text-gray-300 font-serif bg-gray-50 dark:bg-zinc-900">
          {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
        </blockquote>
      );
    case "callout":
      return (
        <div className="flex p-6 my-6 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-sm">
          <div className="mr-4 text-2xl">{value.icon?.emoji || "💡"}</div>
          <div className="text-gray-700 dark:text-gray-300 leading-7">
            {value.rich_text?.map((text: any, i: number) => <Text key={i} text={text} />)}
          </div>
        </div>
      );
    default:
      return null;
  }
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const blocks = project?.blocks || [];

  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop: 완전 불투명 배경 사용 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#f5f5f5] dark:bg-[#111] z-[60]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            {/* Modal Content */}
            <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-5xl h-[90vh] shadow-2xl rounded-xl overflow-hidden flex flex-col pointer-events-auto border border-gray-200 dark:border-zinc-800 relative">

              {/* Header */}
              <div className="flex justify-between items-start p-6 md:p-8 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md sticky top-0 z-20">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/10">
                      Project
                    </span>
                    {project.award && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-widest uppercase bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                        <Award className="w-3 h-3" /> {project.award}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 font-serif mb-2">
                    {project.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1a1a1a]">

                {/* Meta Info Bar */}
                <div className="flex flex-wrap gap-6 p-6 md:px-8 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800 text-sm">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Period</span>
                    <span className="text-gray-700 dark:text-gray-300">{project.overview.period}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Role</span>
                    <span className="text-gray-700 dark:text-gray-300">{project.overview.role}</span>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Tech Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-xs text-gray-600 dark:text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-12 max-w-4xl mx-auto">
                  {/* Links */}
                  <div className="flex flex-wrap gap-3 mb-12">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                        <Github className="w-4 h-4" /> Source Code
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium">
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                    {project.figmaUrl && (
                      <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium">
                        <Figma className="w-4 h-4" /> Design
                      </a>
                    )}
                  </div>

                  {/* 본문 내용 렌더링 부분 */}
                  <div className="prose dark:prose-invert max-w-none mb-10">
                    {blocks.length > 0 ? (
                      blocks.map((block: any) => <RenderBlock key={block.id} block={block} />)
                    ) : (
                      <p className="text-gray-500 italic text-center py-10">
                        작성된 본문 내용이 없습니다.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}