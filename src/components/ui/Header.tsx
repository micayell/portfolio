import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-black/80 dark:border-gray-800 transition-colors">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          My Portfolio
        </Link>

        <div className="flex items-center gap-6">
          {/* 데스크탑 메뉴 */}
          <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* 모바일에서는 메뉴가 많아지면 햄버거 메뉴가 필요할 수 있음 (일단은 숨김 처리) */}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
