"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {/* 해/달 아이콘 (SVG) */}
      <span className="dark:hidden">🌞</span> {/* 라이트 모드일 때 보임 */}
      <span className="hidden dark:inline">🌙</span> {/* 다크 모드일 때 보임 */}
    </button>
  )
}