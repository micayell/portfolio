import Image from "next/image";
import { profile } from "@/data/about"; // 데이터 import
import { getImagePath } from "@/lib/utils";
import { Github, Linkedin, Mail, BookText } from "lucide-react";
import ChatInput from "./ChatInput";

interface AboutProps {
  onSendMessage?: (message: string) => void;
  projects?: any[];
}

export default function About({ onSendMessage, projects }: AboutProps) {
  const quickQuestions = [
    "가장 자신 있는 프로젝트는?",
    "기술 스택은?",
    "경력 알려줘",
  ];

  return (
    <section id="about" className="py-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* 1. 프로필 이미지 영역 - 액자 스타일 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-2/3 max-w-[280px] md:w-full md:max-w-none aspect-[3/4] bg-gray-100 dark:bg-zinc-800 p-3 md:p-4 shadow-sm">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={getImagePath("/images/profile.jpg")}
                alt={profile.name}
                fill
                className="object-cover transition-all duration-500"
              />
            </div>
          </div>

          <div className="w-full mt-6 flex justify-center gap-6">
            <a
              href={`mailto:${profile.email}`}
              className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
              title="Email"
            >
              <Mail size={24} strokeWidth={1.5} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
              title="Github"
            >
              <Github size={24} strokeWidth={1.5} />
            </a>
            <a
              href={profile.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
              title="Blog"
            >
              <BookText size={24} strokeWidth={1.5} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
              title="LinkedIn"
            >
              <Linkedin size={24} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* 2. 채팅 입력 필드 */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-light mb-10 leading-tight tracking-tight">
            <span className="block text-gray-400 dark:text-gray-500 text-lg mb-2 uppercase tracking-widest font-normal">
              Engineer's Philosophy
            </span>            I build digital experiences<br />
            that bridge <span className="font-normal italic">gap</span> between<br />
            users and technology.
          </h2>

          <ChatInput onSendMessage={onSendMessage || (() => {})} quickQuestions={quickQuestions} />
        </div>
      </div>
    </section>
  );
}
