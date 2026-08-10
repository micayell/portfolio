"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";
import { Menu, X } from "lucide-react";

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm transition-colors border-b border-gray-100 dark:border-zinc-900">
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
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-black z-40 p-6">
          <ul className="flex flex-col items-center justify-center h-full space-y-8 text-lg uppercase tracking-widest text-gray-500 dark:text-gray-400">
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
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}