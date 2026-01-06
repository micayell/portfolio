import fs from "fs";
import path from "path";
import https from "https";

const repoName = "portfolio"; // next.config.ts와 동일하게 설정
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${repoName}` : "";

// 파라미터 변경: url, projectId(폴더명), filename(파일명, 확장자 제외)
export async function saveImage(url: string, projectId: string, name: string = "thumbnail"): Promise<string> {
  // URL이 없거나 이미 로컬 경로라면 그대로 반환
  if (!url || url.startsWith("/")) return url;

  try {
    // 1. 저장 경로 변경: public/cache/{projectId}
    const publicDir = path.join(process.cwd(), "public", "cache", projectId);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 2. 확장자 추출 및 파일명 설정
    const ext = url.split(".").pop()?.split("?")[0] || "png";
    const filename = `${name}.${ext}`; // 예: thumbnail.png 또는 block-uuid.png
    const filePath = path.join(publicDir, filename);
    
    // 3. 반환 경로 변경
    const publicPath = `${basePath}/cache/${projectId}/${filename}`;

    // 이미 파일이 존재하면 다운로드 건너뛰기 (빌드 속도 최적화)
    if (fs.existsSync(filePath)) {
      return publicPath;
    }

    // 이미지 다운로드
    const file = fs.createWriteStream(filePath);
    
    await new Promise<void>((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      }).on("error", (err) => {
        fs.unlink(filePath, () => {}); // 에러 시 파일 삭제
        reject(err);
      });
    });

    console.log(`✅ Image saved: ${projectId}/${filename}`);
    return publicPath;

  } catch (error) {
    console.error(`❌ Failed to save image (${projectId}/${name}):`, error);
    return "/file.svg"; // 실패 시 기본 이미지 반환
  }
}