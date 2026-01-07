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
    <section id="skills" className="py-20 max-w-5xl mx-auto px-6">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-6">Technical Skills</h2>
        <p className="text-gray-500 dark:text-gray-400 font-light">
          다양한 프로젝트 경험을 통해 습득한 기술 스택입니다.
        </p>
      </div>

      {/* 1. 카테고리 탭 (Resume 스타일) */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 sticky top-24 z-10 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm transition-all border ${
              activeTab === cat
                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 dark:bg-black dark:text-gray-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. 스킬 카드 그리드 */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold mb-4 text-black dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-sm rounded-lg font-medium"
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
