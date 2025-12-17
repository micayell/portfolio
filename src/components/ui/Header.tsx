import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";

interface HeaderProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-black/80 dark:border-gray-800 transition-colors">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-end">
        <div className="flex items-center gap-8">
          <ul className="flex gap-8 text-base font-medium text-gray-600 dark:text-gray-300">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`relative hover:text-black dark:hover:text-white transition-colors ${activeTab === item.id ? "text-black dark:text-white font-bold" : ""
                    }`}
                >
                  {item.name}
                  {activeTab === item.id && (
                    <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-blue-500" />
                  )}
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
