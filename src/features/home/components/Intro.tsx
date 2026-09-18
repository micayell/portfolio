"use client";

import { motion } from "framer-motion";

interface IntroProps {
  onEnter: () => void;
}

// 스퀴글 비전 애니메이션용 컴포넌트
const SquiggleText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  // 텍스트를 기반으로 고정된 ID 생성 (hydration mismatch 방지)
  const filterId = `squiggle-${text.replace(/\s/g, '-')}-${delay}`;

  return (
    <div className={className} style={{ filter: `url(#${filterId})` }}>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
              result="noise"
              seed="1"
            >
              <animate
                attributeName="seed"
                values="1;2;3;4;5;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {text}
    </div>
  );
};

export default function Intro({ onEnter }: IntroProps) {
  return (
    <section
      onClick={onEnter}
      className="relative h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-zinc-950 overflow-hidden cursor-pointer"
    >
      {/* 배경 데코레이션 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="z-10 text-center space-y-6 pointer-events-none">

        <div className="relative inline-block">
          {/* PORTFOLIO 텍스트 애니메이션 */}
          <SquiggleText
            text="PORTFOLIO"
            className="text-[12vw] md:text-[10rem] font-black leading-none tracking-tighter text-black dark:text-white mix-blend-overlay"
          />

          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
            className="absolute -bottom-4 right-4 text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400"
          >
            2026
          </motion.span>
        </div>

        <div className="mt-8 space-y-2 flex flex-col items-center">
          {/* 순차적으로 등장 */}
          <SquiggleText
            text="Developer"
            delay={0.5}
            className="text-xl md:text-3xl font-medium text-gray-600 dark:text-gray-400"
          />
          <SquiggleText
            text="Kim Chang Ju"
            delay={1.2}
            className="text-3xl md:text-5xl font-bold text-black dark:text-white"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-32 md:bottom-24 text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium animate-pulse pointer-events-none"
      >
        Click anywhere to enter
      </motion.div>

    </section>
  );
}