import Link from "next/link";
import { Home, Wrench, FolderGit2, FileText } from "lucide-react"; // 아이콘 import

const MENU_ITEMS = [
  { name: "홈", href: "/#about", icon: Home },
  { name: "기술 스택", href: "/#skills", icon: Wrench },
  { name: "프로젝트", href: "/#projects", icon: FolderGit2 },
  { name: "이력서", href: "/resume.pdf", icon: FileText },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-16"> {/* pt-16: 헤더 높이만큼 여백 */}
      
      {/* 1. 사이드바 (왼쪽 고정) */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black hidden md:block overflow-y-auto">
        <div className="p-4 space-y-2">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group"
            >
              {/* 아이콘 컴포넌트 사용 (group-hover로 색상 변경 효과 가능) */}
              <item.icon className="w-5 h-5 text-gray-500 group-hover:text-black dark:text-gray-400 dark:group-hover:text-white transition-colors" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500">
            © 2025 Kim Chang Ju<br />
            All rights reserved.
          </p>
        </div>
      </aside>

      {/* 2. 메인 콘텐츠 (오른쪽 영역) */}
      <main className="flex-1 md:ml-64 bg-white dark:bg-black min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}