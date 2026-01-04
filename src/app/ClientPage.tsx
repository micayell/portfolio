"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import About from "@/components/ui/About";
import Skills from "@/components/ui/Skills";
import Intro from "@/components/ui/Intro";
import GalleryScene from "@/components/canvas/GalleryScene";
import ProjectModal from "@/components/ui/ProjectModal";
import { Project } from "@/types/project";

interface ClientPageProps {
  initialProjects: Project[];
}

export default function ClientPage({ initialProjects }: ClientPageProps) {
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
        
        <main className={`pt-32 pb-20 ${activeTab === "projects" ? "w-full" : "max-w-5xl mx-auto px-6"}`}> 
          
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
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="max-w-5xl mx-auto px-6 mb-12 text-center md:text-left">
                <h2 className="text-4xl font-light mb-4 inline-block border-b border-gray-300 pb-2">
                  Exhibition
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-4 font-light tracking-wide">
                  Explore the collection of digital works.
                </p>
              </div>
              
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