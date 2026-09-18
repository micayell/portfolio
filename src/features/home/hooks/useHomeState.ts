import { useState } from "react";
import { Project } from "@/features/projects/types/project";
import { Category } from "@/features/resume/components/Resume";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  suggestedAction?: SuggestedAction;
}

export interface SuggestedAction {
  type: "navigate" | "none";
  target?: string;
  message?: string;
}

export function useHomeState() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [resumeFilter, setResumeFilter] = useState<Category>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [initialChatMessages, setInitialChatMessages] = useState<Message[]>([]);

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

  const handleActionClick = (action: SuggestedAction) => {
    if (action.type === "navigate" && action.target) {
      let target = action.target;
      setShowChatModal(false);
      
      if (target === "workExperience" || target === "experience") {
        setResumeFilter(target as Category);
        target = "resume";
      }
      
      setActiveTab(target);
      
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return {
    showIntro,
    activeTab,
    setActiveTab,
    resumeFilter,
    selectedProject,
    setSelectedProject,
    showChatModal,
    initialChatMessages,
    handleIntroClick,
    handleChatMessage,
    handleCloseChatModal,
    handleActionClick,
  };
}