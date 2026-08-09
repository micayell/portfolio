"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Header from "@/components/ui/Header";
import About from "@/components/ui/About";
import Resume from "@/components/ui/Resume";
import Skills from "@/components/ui/Skills";
import Intro from "@/components/ui/Intro";
import GalleryScene from "@/components/canvas/GalleryScene";
import ProjectModal from "@/components/ui/ProjectModal";
import ChatInterface from "@/components/ui/ChatInterface";
import { Project } from "@/types/project";
import { ParsedResume } from "@/lib/notion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  suggestedAction?: {
    type: "navigate" | "none";
    target?: string;
    message?: string;
  };
}

interface ClientPageProps {
  initialProjects: Project[];
  resumeData: ParsedResume;
}

export default function ClientPage({ initialProjects, resumeData }: ClientPageProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [initialChatMessages, setInitialChatMessages] = useState<Message[]>([]);

  const projects = initialProjects;

  const handleIntroClick = () => {
    setShowIntro(false);
  };

  const handleChatMessage = (message: string) => {
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };
    setInitialChatMessages([userMessage]);
    setShowChatModal(true);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setInitialChatMessages([]);
  };

  const handleActionClick = (action: Message["suggestedAction"]) => {
    if (action && action.type === "navigate" && action.target) {
      const target = action.target;
      setShowChatModal(false);
      setActiveTab(target);
      // 해당 섹션으로 스크롤
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
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
              <About onSendMessage={handleChatMessage} />
            </div>
          )}

          {activeTab === "resume" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Resume data={resumeData} />
            </div>
          )}

          {activeTab === "skills" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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

        {showChatModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseChatModal}
            />
            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  포트폴리오 어시스턴트
                </h3>
                <button
                  onClick={handleCloseChatModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              {/* Content */}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <ChatInterface
                  key={showChatModal ? "open" : "closed"}
                  initialMessages={initialChatMessages}
                  projects={projects}
                  resumeData={resumeData}
                  onActionClick={handleActionClick}
                />
              </div>
            </div>
          </div>
        )}

        <footer className="py-8 text-center text-xs tracking-widest text-gray-400 border-t border-gray-100 dark:border-zinc-900 uppercase">
          © 2026 Kim Chang Ju. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
