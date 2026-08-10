import { User, Bot, ArrowRight } from "lucide-react";

interface SuggestedAction {
  type: "navigate" | "none";
  target?: string;
  message?: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  suggestedAction?: SuggestedAction;
  onActionClick?: (action: SuggestedAction) => void;
}

export default function ChatMessage({ role, content, timestamp, suggestedAction, onActionClick }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role === "assistant" && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          <Bot size={16} className="text-gray-600 dark:text-gray-400" />
        </div>
      )}

      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        role === "user"
          ? "bg-black dark:bg-white text-white dark:text-black"
          : "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white"
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className="text-xs mt-1 opacity-50">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
        {suggestedAction && suggestedAction.type === "navigate" && (
          <button
            onClick={() => onActionClick?.(suggestedAction)}
            className="mt-3 flex items-center gap-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            {suggestedAction.message || "자세히 보기"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {role === "user" && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          <User size={16} className="text-gray-600 dark:text-gray-400" />
        </div>
      )}
    </div>
  );
}