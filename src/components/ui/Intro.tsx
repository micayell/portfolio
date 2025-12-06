"use client";

import { ArrowDown } from "lucide-react";

// 👇 props 타입 정의
interface IntroProps {
  onEnter: () => void;
}

export default function Intro({ onEnter }: IntroProps) { // 👈 props 받기
  const scrollToContent = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-[#f0f0f0] dark:bg-zinc-950 overflow-hidden">
      {/* 배경 데코레이션 (선택 사항) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="z-10 text-center space-y-6">
        {/* 📂 폴더 느낌의 그래픽이나 큰 타이포그래피 */}
        <div className="relative inline-block">
          <h1 className="text-[12vw] md:text-[10rem] font-black leading-none tracking-tighter text-black dark:text-white mix-blend-overlay">
            PORTFOLIO
          </h1>
          <span className="absolute -bottom-4 right-4 text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
            2025
          </span>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-xl md:text-3xl font-medium text-gray-600 dark:text-gray-400">
            Front-end Developer
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white">
            Kim Chang Ju
          </h2>
        </div>
      </div>

      {/* 하단 화살표 버튼 */}
      <button 
        onClick={onEnter} // 👈 클릭 시 onEnter 실행
        className="absolute bottom-10 animate-bounce p-4 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
        aria-label="Enter site"
      >
        <ArrowDown className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
      </button>
    </section>
  );
}
