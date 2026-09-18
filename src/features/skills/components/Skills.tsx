"use client";

import { useState, useMemo, useRef } from "react";
import { useDrag } from "@use-gesture/react";

interface SkillsProps {
  skills: Record<string, string[]>;
}

// 💡 여기에 원하시는 상단 탭(카테고리) 순서를 차례대로 적어주세요!
// (여기에 없는 항목은 자동으로 가나다/알파벳 순으로 뒤로 밀립니다)
const PREFERRED_ORDER = ["Programming", "BE", "FE", "DB", "Data", "Design"];

export default function Skills({ skills }: SkillsProps) {
  const categories = useMemo(() => {
    const keys = Object.keys(skills);
    keys.sort((a, b) => {
      const idxA = PREFERRED_ORDER.indexOf(a);
      const idxB = PREFERRED_ORDER.indexOf(b);
      
      // 둘 다 우선순위 목록에 있으면 지정된 순서대로 정렬
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      // a만 우선순위에 있으면 a를 앞으로
      if (idxA !== -1) return -1;
      // b만 우선순위에 있으면 b를 앞으로
      if (idxB !== -1) return 1;
      // 둘 다 없으면 그냥 가나다순(알파벳순) 정렬
      return a.localeCompare(b);
    });
    return ["All", ...keys];
  }, [skills]);
  const [activeTab, setActiveTab] = useState("All");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const sortedEntries: [string, string[]][] = useMemo(() => {
    const sortedKeys = categories.filter(c => c !== "All");
    if (activeTab === "All") {
      return sortedKeys.map(key => [key, skills[key]]);
    }
    return [[activeTab, skills[activeTab]]];
  }, [activeTab, categories, skills]);

  const bind = useDrag(({ down, movement: [mx], memo = scrollContainerRef.current?.scrollLeft, event }) => {
    const ev = event as React.PointerEvent | React.TouchEvent | PointerEvent | TouchEvent;
    const isTouch = ev && (
      ('pointerType' in ev && (ev.pointerType === 'touch' || ev.pointerType === 'pen')) ||
      ('touches' in ev && ev.touches !== undefined)
    );
    
    // 모바일(터치) 환경에서는 native scroll을 이용하도록 드래그 이벤트를 무시합니다.
    if (isTouch) return memo;

    // 마우스 드래그일 때만 스크롤 위치를 업데이트합니다.
    if (Math.abs(mx) > 3) {
      isDragging.current = true;
    }

    if (!down) {
      // 드래그 종료 시 약간의 딜레이 후 클릭이 가능하게 상태를 되돌립니다.
      setTimeout(() => {
        isDragging.current = false;
      }, 50);
    }

    if (scrollContainerRef.current && isDragging.current) {
      scrollContainerRef.current.scrollLeft = memo - mx;
    }
    return memo;
  }, { axis: 'x', filterTaps: true });

  return (
    <section id="skills" className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mb-12 md:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-4 md:mb-6">Technical Skills</h2>
        <p className="text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">
          다양한 프로젝트 경험을 통해 습득한 기술 스택입니다.
        </p>
      </div>

      <div className="mb-12 md:mb-12 sticky top-16 md:top-24 z-10 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex justify-center">
          <div
            {...bind()}
            ref={scrollContainerRef}
            onClickCapture={(e) => {
              if (isDragging.current) {
                e.stopPropagation();
              }
            }}
            className="flex overflow-x-auto whitespace-nowrap gap-3 pb-2 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start"
      >
        
          {sortedEntries.map(([category, items]) => (
            <div key={category} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
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
            </div>
          ))}
        
      </div>

      {Object.keys(skills).length === 0 && (
        <div className="text-center py-20 text-gray-400">
          등록된 스킬이 없습니다.
        </div>
      )}
    </section>
  );
}