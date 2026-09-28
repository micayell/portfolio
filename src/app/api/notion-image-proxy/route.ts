import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = process.env.NOTION_API_KEY 
  ? new Client({ auth: process.env.NOTION_API_KEY }) 
  : null;

// Notion 파일 객체의 공통 구조 인터페이스
interface NotionImageObj {
  type: "external" | "file";
  external?: { url: string };
  file?: { url: string };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url"); // 레거시 호환용
  const pageId = searchParams.get("pageId");
  const blockId = searchParams.get("blockId");
  const propertyId = searchParams.get("propertyId");

  try {
    let targetUrl: string | null = url;

    if (notion) {
      if (blockId) {
        // 프로필 등 이미지 블록 처리
        const blockResponse = await notion.blocks.retrieve({ block_id: blockId });
        const block = blockResponse as BlockObjectResponse;
        
        if (block.type === "image") {
          const imageObj = block.image as NotionImageObj;
          if (imageObj.type === "external" && imageObj.external) {
            targetUrl = imageObj.external.url;
          } else if (imageObj.type === "file" && imageObj.file) {
            targetUrl = imageObj.file.url;
          }
        }
      } else if (pageId) {
        // 프로젝트 썸네일 등 페이지 처리
        const pageResponse = await notion.pages.retrieve({ page_id: pageId });
        const page = pageResponse as PageObjectResponse;
        
        if (propertyId) {
          // 특정 property (Files and media) 의 이미지인 경우
          const prop = Object.values(page.properties).find((p) => p.id === propertyId);
          
          if (prop && prop.type === "files") {
            const fileProp = prop as unknown as { files: NotionImageObj[] };
            if (fileProp.files && fileProp.files.length > 0) {
              const fileObj = fileProp.files[0];
              if (fileObj.type === "external" && fileObj.external) {
                targetUrl = fileObj.external.url;
              } else if (fileObj.type === "file" && fileObj.file) {
                targetUrl = fileObj.file.url;
              }
            }
          }
        } else if (page.cover) {
          // Cover 이미지인 경우
          const coverObj = page.cover as NotionImageObj;
          if (coverObj.type === "external" && coverObj.external) {
            targetUrl = coverObj.external.url;
          } else if (coverObj.type === "file" && coverObj.file) {
            targetUrl = coverObj.file.url;
          }
        }
      }
    }

    if (!targetUrl) {
      return new NextResponse("Missing url or identifier", { status: 400 });
    }

    const response = await fetch(targetUrl);
    
    // 이전에 throw new Error(...) 로 되어있던 부분을 직접 응답 객체 반환으로 수정 (IDE 경고 해결)
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return new NextResponse("Error fetching image", { status: response.status });
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Error processing request", { status: 500 });
  }
}
