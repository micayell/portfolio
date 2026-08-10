"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface HeaderProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (id: string) => {
    onTabChange(id);
    setIsMenuOpen(false); // 메뉴 항목 클릭 시 모바일 메뉴 닫기
  };

  // 메뉴가 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-colors border-b border-gray-100 dark:border-zinc-900">
      <nav className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => handleTabChange('about')}
          className="text-lg font-bold tracking-tighter hover:opacity-80 transition-opacity cursor-pointer"
        >
          KCJ<span className="text-blue-500">.</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                    activeTab === item.id ? "text-black dark:text-white font-bold" : ""
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 z-[60] relative">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-0 bg-white dark:bg-black z-50"
          >
            <div className="flex flex-col items-center justify-center h-full pt-16">
              <ul className="flex flex-col items-center space-y-8 text-lg uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleTabChange(item.id)}
                      className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer ${
                        activeTab === item.id ? "text-black dark:text-white font-bold" : ""
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-16">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}