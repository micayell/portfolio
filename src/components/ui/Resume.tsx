"use client";

import { useState, useMemo } from "react";
import { ParsedResume, DescriptionItem } from "@/lib/notion"; // DescriptionItem import
import { motion, AnimatePresence } from "framer-motion";

interface ResumeProps {
  data: ParsedResume;
}

type Category = "all" | "experience" | "education" | "award" | "certificate";

interface TimelineItem {
  id: string;
  category: Category;
  categoryTag?: string; 
  date: string;
  title: string;
  subtitle?: string; 
  desc?: DescriptionItem[]; // string[] -> DescriptionItem[] 변경
}

export default function Resume({ data }: ResumeProps) {
  const [filter, setFilter] = useState<Category>("all");

  // 1. 모든 데이터를 하나의 타임라인 리스트로 통합 및 정렬
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // Experience
    data.experience.forEach((exp, i) => {
      items.push({
        id: `exp-${i}`,
        category: "experience",
        categoryTag: exp.category, 
        date: exp.period,
        title: exp.title,
        desc: exp.desc,
      });
    });

    // Education
    data.educations.forEach((edu, i) => {
      items.push({
        id: `edu-${i}`,
        category: "education",
        date: edu.period,
        title: edu.school,
        desc: edu.desc,
      });
    });

    // Awards
    data.awards.forEach((award, i) => {
      items.push({
        id: `award-${i}`,
        category: "award",
        date: award.date,
        title: award.title,
        subtitle: award.org,
      });
    });

    // Certificates
    data.certificates.forEach((cert, i) => {
      items.push({
        id: `cert-${i}`,
        category: "certificate",
        date: cert.date,
        title: cert.title,
        subtitle: cert.org,
      });
    });

    // 날짜 내림차순 정렬 (최신순)
    return items.sort((a, b) => {
      const getDateValue = (dateStr: string) => {
        const match = dateStr.match(/\d{4}\.\d{2}/);
        return match ? match[0] : "0000.00";
      };
      return getDateValue(b.date).localeCompare(getDateValue(a.date));
    });
  }, [data]);

  // 2. 필터링된 리스트
  const filteredItems = useMemo(() => {
    if (filter === "all") return timelineItems;
    return timelineItems.filter((item) => item.category === filter);
  }, [filter, timelineItems]);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All History" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "award", label: "Awards" },
    { key: "certificate", label: "Certificates" },
  ];

  return (
    <section id="resume" className="py-20 max-w-4xl mx-auto px-6">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-6">History of CJ</h2>
        <p className="text-gray-500 dark:text-gray-400 font-light">
          끊임없이 성장해온 저의 발자취를 소개합니다.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-20 sticky top-24 z-10 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-5 py-2 rounded-full text-sm transition-all border ${
              filter === cat.key
                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 dark:bg-black dark:text-gray-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline (Central Spine Style) */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-zinc-700">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              {/* Central Node (Icon) */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-200 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 dark:border-black dark:bg-zinc-800 dark:text-zinc-400">
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    item.category === "experience"
                      ? "bg-blue-500"
                      : "bg-gray-400 dark:bg-gray-500"
                  }`}
                />
              </div>

              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800">
                
                {/* Header: Title & Date */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-1">
                  <h3 className="font-bold text-lg text-black dark:text-white">
                    {item.title}
                  </h3>
                  <time className="text-xs font-medium text-blue-500 whitespace-nowrap bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {item.date}
                  </time>
                </div>

                {/* Subtitle (Organization) */}
                {item.subtitle && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">
                    {item.subtitle}
                  </div>
                )}

                {/* Category Tag */}
                <div className="mb-3">
                  <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${
                      item.category === "experience"
                        ? "border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                        : "border-gray-200 text-gray-400 dark:border-zinc-700 dark:text-zinc-500"
                    }`}
                  >
                    {item.category === "experience" && item.categoryTag 
                      ? item.categoryTag 
                      : item.category}
                  </span>
                </div>

                {/* Description List with Depth */}
                {item.desc && item.desc.length > 0 && (
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 mt-3 border-t border-gray-100 dark:border-zinc-800 pt-3">
                    {item.desc.map((d, i) => (
                      <li 
                        key={i} 
                        className="flex items-start gap-2 leading-relaxed"
                        style={{ paddingLeft: `${d.depth * 16}px` }} // depth에 따른 들여쓰기 적용
                      >
                        {/* depth에 따라 불렛 모양 변경 가능 (선택 사항) */}
                        <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${
                            d.depth === 0 ? "bg-gray-400 dark:bg-zinc-500" : "bg-gray-300 dark:bg-zinc-600 border border-gray-400 dark:border-zinc-500 bg-transparent"
                        }`} />
                        <span>{d.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-light">
            해당 카테고리의 이력이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
