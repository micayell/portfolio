"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaPaperPlane } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { Project } from "@/types/project";

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

interface SuggestedAction {
  type: "navigate" | "none";
  target?: string;
  message?: string;
}

interface ResumeData {
  skills?: Record<string, string[]>;
  experience?: Array<{
    title: string;
    period: string;
    category?: string;
  }>;
  workExperience?: Array<{
    title: string;
    period: string;
    category?: string;
  }>;
}

interface ChatInterfaceProps {
  initialMessage?: string;
  initialMessages?: Message[];
  projects?: Project[];
  resumeData?: ResumeData;
  onActionClick?: (action: SuggestedAction) => void;
}

export default function ChatInterface({ initialMessages, projects, resumeData, onActionClick }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasProcessedInitial = useRef(false);

  const fetchAssistantResponse = useCallback(async (messageText: string) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.slice(-5),
          projects: projects || [],
          resumeData: resumeData || null
        }),
      });

      if (!response.ok) {
        console.error("Failed to get response");
        const errorMessage: Message = {
          role: "assistant",
          content: "오류가 발생했습니다. 다시 시도해 주세요.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.text || "죄송합니다. 응답을 가져오는 데 실패했습니다.",
        timestamp: new Date(),
        suggestedAction: data.suggestedAction || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "오류가 발생했습니다. 다시 시도해 주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, projects, resumeData]);

  // 초기 메시지가 있으면 자동으로 답변 요청
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0 && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true;
      // 마지막 사용자 메시지를 찾아서 답변 요청 (사용자 메시지는 이미 표시됨)
      const lastUserMessage = [...initialMessages].reverse().find(msg => msg.role === "user");
      if (lastUserMessage) {
        void fetchAssistantResponse(lastUserMessage.content);
      }
    }
  }, [initialMessages, fetchAssistantResponse]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await fetchAssistantResponse(messageText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chat Messages */}
      <div className="mb-6 max-h-[400px] overflow-y-auto space-y-4 px-2">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              제 포트폴리오에 대해 궁금한 점이 있으신가요?
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              {...message}
              onActionClick={onActionClick}
            />
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
            <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl px-4 py-3">
              <p className="text-sm text-gray-400">입력 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          className="w-full px-6 py-4 pr-14 bg-gray-100 dark:bg-zinc-800 rounded-full text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          <FaPaperPlane size={18} />
        </button>
      </form>
    </div>
  );
}
