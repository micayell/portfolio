import { X } from "lucide-react";
import ChatInterface from "@/features/chat/components/ChatInterface";
import { Project } from "@/features/projects/types/project";
import { ParsedResume } from "@/features/common/lib/notion";
import { Message, SuggestedAction } from "@/features/home/hooks/useHomeState";

interface ChatModalProps {
  showChatModal: boolean;
  initialChatMessages: Message[];
  projects: Project[];
  resumeData: ParsedResume;
  onClose: () => void;
  onActionClick: (action: SuggestedAction) => void;
}

export default function ChatModal({
  showChatModal,
  initialChatMessages,
  projects,
  resumeData,
  onClose,
  onActionClick
}: ChatModalProps) {
  if (!showChatModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            포트폴리오 어시스턴트
          </h3>
          <button
            onClick={onClose}
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
            onActionClick={onActionClick}
          />
        </div>
      </div>
    </div>
  );
}