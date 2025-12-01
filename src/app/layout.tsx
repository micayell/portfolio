import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Header from "@/components/ui/Header"; // 헤더는 그대로 유지
import AppLayout from "@/components/layout/AppLayout"; // 새로 만든 레이아웃 import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "김창주의 포트폴리오",
  description: "내 포트폴리오 웹사이트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <Header /> {/* 헤더는 최상단 고정 */}
        
        {/* AppLayout으로 children을 감쌉니다 */}
        <AppLayout>
          {children}
        </AppLayout>
        
        </ThemeProvider>
      </body>
    </html>
  );
}
