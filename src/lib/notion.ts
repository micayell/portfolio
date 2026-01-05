import { Client } from "@notionhq/client";
import { Project } from "@/types/project";

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  throw new Error("Missing Notion API Key or Database ID");
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 공통 매핑 함수 (노션 페이지 -> 프로젝트 객체)
const mapPageToProject = (page: any): Project => {
  const props = page.properties;

  // 1. 제목 (Title)
  const titleProp = props.Name || props.Title || props.이름 || props.제목;
  const title = titleProp?.title?.[0]?.plain_text || "Untitled";

  // 2. ID (Slug)
  // 노션 DB에 'ID'라는 텍스트 속성이 없으면 페이지 ID(UUID) 사용
  const slugProp = props.ID || props.Slug || props.아이디;
  const id = slugProp?.rich_text?.[0]?.plain_text || page.id;

  // 3. 설명 (Description / 프로젝트 개요)
  const descProp = props.Description || props['프로젝트 개요'] || props.설명;
  const description = descProp?.rich_text?.[0]?.plain_text || "";

  // 4. 태그 (Tags / 기술스택)
  const tagsProp = props.Tags || props['기술스택'] || props.TechStack || props.태그;
  const tags = tagsProp?.multi_select?.map((tag: any) => tag.name) || [];

  // 5. 썸네일 (커버 이미지 > 파일 속성 순)
  let thumbnailUrl = "/file.svg";
  if (page.cover?.type === "external") thumbnailUrl = page.cover.external.url;
  else if (page.cover?.type === "file") thumbnailUrl = page.cover.file.url;
  else if (props.Thumbnail?.files?.[0]?.file?.url) thumbnailUrl = props.Thumbnail.files[0].file.url;

  // 6. 기간 (Period / Date / 기간 및 인원)
  const periodProp = props.Period || props.Date || props['기간 및 인원'] || props.기간;
  let period = "";
  if (periodProp?.type === 'date') {
    period = periodProp.date ? `${periodProp.date.start} ~ ${periodProp.date.end || "진행중"}` : "";
  } else {
    period = periodProp?.rich_text?.[0]?.plain_text || "";
  }

  // 7. 역할 (Role / 담당역할)
  const roleProp = props.Role || props['담당역할'] || props.역할;
  const role = roleProp?.rich_text?.[0]?.plain_text || "";

  // 8. 링크 (Link / 참고 링크 / Github)
  const linkProp = props.Github || props.Link || props['참고 링크'];
  const githubUrl = linkProp?.url || linkProp?.rich_text?.[0]?.plain_text || undefined;

  // 9. 데모, 수상, 피그마 (해당 속성이 노션에 있다면 추가 매핑)
  const demoProp = props.Demo || props.Live || props['데모 링크'];
  const demoUrl = demoProp?.url || demoProp?.rich_text?.[0]?.plain_text || undefined;
  
  const awardProp = props.Award || props.Prize || props.수상;
  const award = awardProp?.rich_text?.[0]?.plain_text || undefined;
  
  const figmaProp = props.Figma || props['피그마'];
  const figmaUrl = figmaProp?.url || figmaProp?.rich_text?.[0]?.plain_text || undefined;
  
  // 10. 배경 및 목표 (별도 속성이 없으면 설명이나 기본값 사용)
  const goalProp = props.Goal || props.목표;
  const goal = goalProp?.rich_text?.[0]?.plain_text || description; // 목표가 없으면 설명 사용
  
  const bgProp = props.Background || props.배경;
  const background = bgProp?.rich_text?.[0]?.plain_text || "";
  
  const membersProp = props.Members || props.인원;
  const members = membersProp?.rich_text?.[0]?.plain_text || "";

  return {
    id,          // URL Slug
    pageId: page.id, // 실제 Notion Page UUID (본문 조회용)
    title,
    description,
    tags,
    thumbnailUrl,
    githubUrl,
    demoUrl,
    figmaUrl,
    award,
    
    overview: {
      goal,
      background,
      role,
      period,
      members,
    },
    // 태그를 skills 포맷으로 변환
    skills: tags.map((t: string) => ({ name: t, reason: "Used in project" })), 
    features: [],
    troubleShooting: [],
  };
};

export async function getProjects(): Promise<Project[]> {
  try {
    const response: any = await notion.request({
      path: `databases/${process.env.NOTION_DATABASE_ID}/query`,
      method: "post",
      body: {
        sorts: [
          {
            timestamp: "last_edited_time",
            direction: "descending",
          },
        ],
      },
    });

    return response.results.map(mapPageToProject);

  } catch (error: any) {
    console.error("❌ Notion API Error:", error.body || error.message);
    return [];
  }
}

// 1. 특정 프로젝트(페이지)의 상세 정보를 가져오는 함수 (ID/Slug로 검색)
export async function getProject(slug: string): Promise<Project | null> {
  try {
    const response: any = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "ID", // ⚠️ 노션 DB에 'ID'라는 텍스트 속성을 만들고, URL값(예: platepay)을 넣어주세요!
        rich_text: {
          equals: slug,
        },
      },
    });

    if (response.results.length === 0) return null;

    return mapPageToProject(response.results[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

// 2. 페이지의 본문(블록) 내용을 가져오는 함수
export async function getPageContent(blockId: string) {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
    });
    return response.results;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return [];
  }
}