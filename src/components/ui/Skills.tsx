"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsProps {
  skills: Record<string, string[]>;
}

export default function Skills({ skills }: SkillsProps) {
  // 1. 카테고리 목록 생성 (All + 동적 카테고리)
  const categories = useMemo(() => {
    const cats = Object.keys(skills);
    return ["All", ...cats];
  }, [skills]);

  const [activeTab, setActiveTab] = useState("All");

  // 2. 필터링된 스킬 데이터
  const filteredSkills = useMemo(() => {
    if (activeTab === "All") return skills;
    // 선택된 카테고리만 반환하는 객체 생성
    return { [activeTab]: skills[activeTab] };
  }, [activeTab, skills]);

  return (
    <section id="skills" className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mb-12 md:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-4 md:mb-6">Technical Skills</h2>
        <p className="text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">
          다양한 프로젝트 경험을 통해 습득한 기술 스택입니다.
        </p>
      </div>

      {/* 1. 카테고리 탭 */}
      <div className="mb-12 md:mb-12 sticky top-16 md:top-24 z-10 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex justify-center">
          <div className="flex overflow-x-auto whitespace-nowrap gap-3 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-sm transition-all border cursor-pointer shrink-0 ${
                  activeTab === cat
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 dark:bg-black dark:text-gray-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 스킬 카드 그리드 */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {Object.entries(filteredSkills).map(([category, items]) => (
            <motion.div
              key={category}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-base md:text-lg font-bold mb-4 text-black dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs md:text-sm rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {Object.keys(skills).length === 0 && (
        <div className="text-center py-20 text-gray-400">
          등록된 스킬이 없습니다.
        </div>
      )}
    </section>
  );
}