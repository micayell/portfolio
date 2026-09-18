"use client";

import { useState } from "react";
import { ThemeToggle } from "@/features/common/components/ThemeToggle";
import { NAV_ITEMS } from "@/features/common/constants/nav";
import { Menu, X } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

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
          <button onClick={() => setIsMenuOpen(true)} className="p-1">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Headless UI Dialog) */}
      <Transition appear show={isMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setIsMenuOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* 패널에 relative 속성을 추가하여 내부 절대 좌표버튼(absolute)이 패널에 찰싹 붙어있도록 고정 */}
                <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 sr-only">
                    Navigation Menu
                  </DialogTitle>
                  <div className="mt-2">
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
                  </div>

                  <div className="mt-8 flex justify-center">
                    <ThemeToggle />
                  </div>

                  {/* 닫기 엑스버튼이 요동치는 걸 방지하기 위해 스타일을 둥근 아이콘 핏으로 안정화 */}
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:outline-none transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
}