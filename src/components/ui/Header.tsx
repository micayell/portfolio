import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";

interface HeaderProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm transition-colors border-b border-gray-100 dark:border-zinc-900">
      <nav className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-lg font-bold tracking-tighter">
            KCJ<span className="text-blue-500">.</span>
        </div>
        
        <div className="flex items-center gap-8">
          <ul className="flex gap-6 text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`hover:text-black dark:hover:text-white transition-colors ${
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
      </nav>
    </header>
  );
}
