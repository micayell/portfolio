"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ParsedResume, DescriptionItem } from "@/features/common/lib/notion";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";

interface ResumeProps {
  data: ParsedResume;
  initialFilter?: Category;
}

export type Category = "all" | "experience" | "workExperience" | "education" | "award" | "certificate";

interface TimelineItem {
  id: string;
  category: Category;
  categoryTag?: string; 
  date: string;
  title: string;
  subtitle?: string; 
  desc?: DescriptionItem[];
}

export default function Resume({ data, initialFilter = "all" }: ResumeProps) {
  const [filter, setFilter] = useState<Category>(initialFilter);
  useEffect(() => { setFilter(initialFilter); }, [initialFilter]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];
    data.experience.forEach((exp, i) => items.push({ id: `exp-${i}`, category: "experience", categoryTag: exp.category, date: exp.period, title: exp.title, desc: exp.desc }));
    data.workExperience.forEach((exp, i) => items.push({ id: `work-exp-${i}`, category: "workExperience", categoryTag: exp.category, date: exp.period, title: exp.title, desc: exp.desc }));
    data.educations.forEach((edu, i) => items.push({ id: `edu-${i}`, category: "education", date: edu.period, title: edu.school, desc: edu.desc }));
    data.awards.forEach((award, i) => items.push({ id: `award-${i}`, category: "award", date: award.date, title: award.title, subtitle: award.org }));
    data.certificates.forEach((cert, i) => items.push({ id: `cert-${i}`, category: "certificate", date: cert.date, title: cert.title, subtitle: cert.org }));
    return items.sort((a, b) => (b.date.match(/\d{4}\.\d{2}/)?.[0] || "0").localeCompare(a.date.match(/\d{4}\.\d{2}/)?.[0] || "0"));
  }, [data]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return timelineItems;
    return timelineItems.filter((item) => item.category === filter);
  }, [filter, timelineItems]);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All History" },
    { key: "workExperience", label: "Work Experience" },
    { key: "award", label: "Awards" },
    { key: "certificate", label: "Certificates" },
    { key: "education", label: "Education" },
    { key: "experience", label: "Experience" },
  ];

  const bind = useDrag(({ movement: [mx], memo = scrollContainerRef.current?.scrollLeft }) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = memo - mx;
    }
    return memo;
  }, { axis: 'x' });

  return (
    <section id="resume" className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-12 md:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-4 md:mb-6">History of CJ</h2>
        <p className="text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">
          끊임없이 성장해온 저의 발자취를 소개합니다.
        </p>
      </div>

      <div className="mb-12 md:mb-20 sticky top-16 md:top-24 z-10 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex justify-center">
          <div 
            {...bind()}
            ref={scrollContainerRef}
            className="flex overflow-x-auto whitespace-nowrap gap-3 pb-2 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'pan-y' }}
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-5 py-2 rounded-full text-sm transition-all border shrink-0 ${
                  filter === cat.key
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 dark:bg-black dark:text-gray-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 sm:before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-zinc-700">
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
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white bg-gray-200 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 dark:border-black dark:bg-zinc-800 dark:text-zinc-400">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${item.category === "experience" || item.category === "workExperience" ? "bg-blue-500" : "bg-gray-400 dark:bg-gray-500"}`} />
              </div>
              <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <h3 className="font-bold text-base md:text-lg text-black dark:text-white">{item.title}</h3>
                  <time className="text-xs font-medium text-blue-500 whitespace-nowrap bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded self-start sm:self-auto">{item.date}</time>
                </div>
                {item.subtitle && <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">{item.subtitle}</div>}
                <div className="mb-3">
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${item.category === "experience" || item.category === "workExperience" ? "border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" : "border-gray-200 text-gray-400 dark:border-zinc-700 dark:text-zinc-500"}`}>
                    {(item.category === "experience" || item.category === "workExperience") && item.categoryTag ? item.categoryTag : item.category === "workExperience" ? "Work Experience" : item.category}
                  </span>
                </div>
                {item.desc && item.desc.length > 0 && (
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 mt-3 border-t border-gray-100 dark:border-zinc-800 pt-3">
                    {item.desc.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed" style={{ paddingLeft: `${d.depth * 12}px` }}>
                        <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${d.depth === 0 ? "bg-gray-400 dark:bg-zinc-500" : "bg-gray-300 dark:bg-zinc-600 border border-gray-400 dark:border-zinc-500 bg-transparent"}`} />
                        <span>{d.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredItems.length === 0 && <div className="py-20 text-center text-gray-400 font-light">해당 카테고리의 이력이 없습니다.</div>}
      </div>
    </section>
  );
}