import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* 사이드바 제거 및 단순 래퍼로 변경 */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}