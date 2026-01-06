import fs from "fs";
import path from "path";
import https from "https";

const repoName = "portfolio"; // next.config.ts와 동일하게 설정
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${repoName}` : "";

export async function saveImage(url: string, id: string): Promise<string> {
  // URL이 없거나 이미 로컬 경로라면 그대로 반환
  if (!url || url.startsWith("/")) return url;

  try {
    // 저장할 디렉토리 설정 (public/images/cache)
    const publicDir = path.join(process.cwd(), "public", "images", "cache");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 파일명 생성 (ID 기반)
    // URL에서 확장자 추출 (없으면 png)
    const ext = url.split(".").pop()?.split("?")[0] || "png";
    const filename = `${id}.${ext}`;
    const filePath = path.join(publicDir, filename);
    const publicPath = `${basePath}/images/cache/${filename}`;

    // 이미 파일이 존재하면 다운로드 건너뛰기 (빌드 속도 최적화)
    // * Notion 이미지가 바뀌었을 때 갱신하려면 이 체크를 제거하거나, 
    //   public/images/cache 폴더를 지우고 빌드해야 함.
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

    console.log(`✅ Image downloaded: ${filename}`);
    return publicPath;

  } catch (error) {
    console.error(`❌ Failed to save image for ${id}:`, error);
    return "/file.svg"; // 실패 시 기본 이미지 반환
  }
}