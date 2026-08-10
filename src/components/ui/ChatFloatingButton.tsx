"use client";

import { MessageCircle } from "lucide-react";

interface ChatFloatingButtonProps {
  onClick: () => void;
}

export default function ChatFloatingButton({ onClick }: ChatFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-[9999]"
      title="포트폴리오 어시스턴트"
    >
      <MessageCircle size={24} />
    </button>
  );
}
