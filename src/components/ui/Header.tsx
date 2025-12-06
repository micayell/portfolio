import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-black/80 dark:border-gray-800 transition-colors">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-end">
        {/* 메뉴들을 오른쪽으로 정렬 */}
        <div className="flex items-center gap-8">
          {/* 네비게이션 링크 */}
          <ul className="flex gap-8 text-base font-medium text-gray-600 dark:text-gray-300">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="hover:text-black dark:hover:text-white transition-colors relative group"
                >
                  {item.name}
                  {/* 호버 시 밑줄 애니메이션 효과 (선택 사항) */}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black dark:bg-white transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
