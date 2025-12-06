import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "portfolio"; // 👈 여기에 실제 리포지토리 이름을 입력하세요 (앞에 슬래시 제외)

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // GitHub Pages에서는 필수
  },
  // 배포 환경일 때만 basePath 적용
  basePath: isProd ? `/${repoName}` : "",
};

export default nextConfig;
