"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      // relative 클래스 추가: 내부 absolute 아이콘들이 이 버튼을 기준으로 위치 잡도록 함
      className="relative rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {/* Sun 아이콘: 다크모드일 때 사라짐 */}
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      
      {/* Moon 아이콘: 다크모드일 때 나타남 */}
      {/* top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2: 부모 요소의 정중앙에 위치시킴 */}
      <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}