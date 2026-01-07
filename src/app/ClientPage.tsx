"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import About from "@/components/ui/About";
import Resume from "@/components/ui/Resume";
import Skills from "@/components/ui/Skills";
import Intro from "@/components/ui/Intro";
import GalleryScene from "@/components/canvas/GalleryScene";
import ProjectModal from "@/components/ui/ProjectModal";
import { Project } from "@/types/project";
import { ParsedResume } from "@/lib/notion";

interface ClientPageProps {
  initialProjects: Project[];
  resumeData: ParsedResume;
}

export default function ClientPage({ initialProjects, resumeData }: ClientPageProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = initialProjects;

  const handleIntroClick = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans overflow-x-hidden">

      {showIntro && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-black transition-transform duration-700 ease-in-out">
          <Intro onEnter={handleIntroClick} />
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>

        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        <main className={`pt-16 pb-20 ${activeTab === "projects" ? "w-full" : "max-w-5xl mx-auto px-6"}`}>

          {activeTab === "about" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 순수 자기소개만 전달 */}
              <About />
            </div>
          )}

          {activeTab === "resume" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Resume data={resumeData} />
            </div>
          )}

          {activeTab === "skills" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 노션에서 가져온 데이터 전달 */}
              <Skills skills={resumeData.skills} />
            </div>
          )}

          {activeTab === "projects" && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">

              <div className="w-full h-[600px] md:h-[800px]">
                <GalleryScene projects={projects} onSelectProject={setSelectedProject} />
              </div>
            </section>
          )}

        </main>

        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

        <footer className="py-8 text-center text-xs tracking-widest text-gray-400 border-t border-gray-100 dark:border-zinc-900 uppercase">
          © 2026 Kim Chang Ju. All rights reserved.
        </footer>
      </div>
    </div>
  );
}