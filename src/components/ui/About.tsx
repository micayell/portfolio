import Image from "next/image";
import { profile } from "@/data/about"; // 데이터 import
import { getImagePath } from "@/lib/utils";
import { Github, Linkedin, Mail, BookText } from "lucide-react";

// 텍스트 내의 **문자열** 패턴을 찾아 굵게(Strong) 처리하는 헬퍼 함수
const formatText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g); // **로 감싸진 부분을 분리
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-black dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export default function About() {
  return (
    <section id="about" className="py-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* 1. 프로필 이미지 영역 - 액자 스타일 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-full aspect-[3/4] bg-gray-100 dark:bg-zinc-800 p-4 shadow-sm">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={getImagePath("/images/profile.jpg")}
                alt={profile.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
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

        {/* 2. 자기소개 텍스트 - 전시 설명 스타일 */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-light mb-10 leading-tight tracking-tight">
            <span className="block text-gray-400 dark:text-gray-500 text-lg mb-2 uppercase tracking-widest font-normal">
              Engineer's Philosophy
            </span>            I build digital experiences<br />
            that bridge <span className="font-normal italic">gap</span> between<br />
            users and technology.
          </h2>

          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6 font-light leading-loose text-lg">
            {profile.description.map((desc, index) => (
              <p key={index}>{formatText(desc)}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
