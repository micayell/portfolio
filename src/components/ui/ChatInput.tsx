"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  quickQuestions?: string[];
}

export default function ChatInput({ onSendMessage, quickQuestions }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          className="w-full px-6 py-4 pr-14 bg-gray-100 dark:bg-zinc-800 rounded-full text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform cursor-pointer"
        >
          <Send size={18} />
        </button>
      </form>

      {quickQuestions && quickQuestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => onSendMessage(question)}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors cursor-pointer"
            >
              {question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
