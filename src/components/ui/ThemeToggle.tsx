"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react" // 아이콘 import

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2" />
      {/* 위 top-2는 버튼 패딩(p-2)에 따라 위치 조정 필요할 수 있음 */}
      {/* 단순히 아래처럼 조건부 렌더링해도 됩니다 */}
      {/* {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />} */}
    </button>
  )
}