"use client";

import { motion } from "framer-motion"; // framer-motion import

interface IntroProps {
  onEnter: () => void;
}

// 텍스트 애니메이션용 컴포넌트
const TypingText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  // 글자 단위로 분리
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * i }, // 0.1초 간격으로 글자 등장
    }),
  };

  // src/components/ui/Intro.tsx 내부 TypingText 수정


  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const, // 리터럴 타입 고정
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20, // 아래에서 위로 20px 이동
      filter: "blur(10px)", // 처음엔 흐릿하게
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "inline-block" }} // 줄바꿈 방지 및 애니메이션 영역 제한
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block" }}>
          {letter === " " ? "\u00A0" : letter} {/* 공백 처리 */}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function Intro({ onEnter }: IntroProps) {
  return (
    <section
      onClick={onEnter}
      className="relative h-screen flex flex-col items-center justify-center bg-[#f0f0f0] dark:bg-zinc-950 overflow-hidden cursor-pointer"
    >
      {/* 배경 데코레이션 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="z-10 text-center space-y-6 pointer-events-none">

        <div className="relative inline-block">
          {/* PORTFOLIO 텍스트 애니메이션 */}
          <TypingText
            text="PORTFOLIO"
            className="text-[12vw] md:text-[10rem] font-black leading-none tracking-tighter text-black dark:text-white mix-blend-overlay"
          />

          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }} // PORTFOLIO가 다 써진 뒤 등장
            className="absolute -bottom-4 right-4 text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400"
          >
            2026
          </motion.span>
        </div>

        <div className="mt-8 space-y-2 flex flex-col items-center">
          {/* 순차적으로 등장 */}
          <TypingText
            text="Front-end Developer"
            delay={0.5}
            className="text-xl md:text-3xl font-medium text-gray-600 dark:text-gray-400"
          />
          <TypingText
            text="Kim Chang Ju"
            delay={1.2}
            className="text-3xl md:text-5xl font-bold text-black dark:text-white"
          />
        </div>
      </div>
      {/* ... 기존 코드 ... */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        // 👇 수정된 클래스: bottom-20으로 올리고, 텍스트 크기(text-xl)와 굵기(font-medium) 증가
        className="absolute bottom-32 md:bottom-24 text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium animate-pulse pointer-events-none"
      >
        Click anywhere to enter
      </motion.div>

    </section>
  );
}