import { Client } from "@notionhq/client";
import { Project } from "@/types/project";
import { saveImage } from "@/lib/save-image";

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
  const descProp = props.Description || props["프로젝트 개요"] || props.설명;
  const description = descProp?.rich_text?.[0]?.plain_text || "";

  // 4. 태그 (Tags / 기술스택)
  const tagsProp =
    props.Tags || props["기술스택"] || props.TechStack || props.태그;
  const tags = tagsProp?.multi_select?.map((tag: any) => tag.name) || [];

  // 5. 썸네일 (커버 이미지 > 파일 속성 순)
  let thumbnailUrl = "/file.svg";
  if (page.cover?.type === "external") thumbnailUrl = page.cover.external.url;
  else if (page.cover?.type === "file") thumbnailUrl = page.cover.file.url;
  else if (props.Thumbnail?.files?.[0]?.file?.url)
    thumbnailUrl = props.Thumbnail.files[0].file.url;

  // 6. 기간 (Period / Date / 기간 및 인원)
  const periodProp =
    props.Period || props.Date || props["기간 및 인원"] || props.기간;
  let period = "";
  if (periodProp?.type === "date") {
    period = periodProp.date
      ? `${periodProp.date.start} ~ ${periodProp.date.end || "진행중"}`
      : "";
  } else {
    period = periodProp?.rich_text?.[0]?.plain_text || "";
  }

  // 7. 역할 (Role / 담당역할)
  const roleProp = props.Role || props["담당역할"] || props.역할;
  const role = roleProp?.rich_text?.[0]?.plain_text || "";

  // 8. 링크 (Link / 참고 링크 / Github)
  const linkProp = props.Github || props.Link || props["참고 링크"];
  const githubUrl =
    linkProp?.url || linkProp?.rich_text?.[0]?.plain_text || undefined;

  // 9. 데모, 수상, 피그마 (해당 속성이 노션에 있다면 추가 매핑)
  const demoProp = props.Demo || props.Live || props["데모 링크"];
  const demoUrl =
    demoProp?.url || demoProp?.rich_text?.[0]?.plain_text || undefined;

  const awardProp = props.Award || props.Prize || props.수상;
  const award = awardProp?.rich_text?.[0]?.plain_text || undefined;

  const figmaProp = props.Figma || props["피그마"];
  const figmaUrl =
    figmaProp?.url || figmaProp?.rich_text?.[0]?.plain_text || undefined;

  // 10. 배경 및 목표 (별도 속성이 없으면 설명이나 기본값 사용)
  const goalProp = props.Goal || props.목표;
  const goal = goalProp?.rich_text?.[0]?.plain_text || description; // 목표가 없으면 설명 사용

  const bgProp = props.Background || props.배경;
  const background = bgProp?.rich_text?.[0]?.plain_text || "";

  const membersProp = props.Members || props.인원;
  const members = membersProp?.rich_text?.[0]?.plain_text || "";

  return {
    id, // URL Slug
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

    // 1. 일단 Notion 데이터로 매핑
    const projects = response.results.map(mapPageToProject);

    // 2. [추가] 썸네일 이미지를 다운로드하고 경로를 교체
    // Promise.all로 병렬 처리하여 빌드 속도 저하 최소화
    const projectsWithLocalImages = await Promise.all(
      projects.map(async (project: Project) => {
        // Notion URL인 경우에만 다운로드 시도
        if (project.thumbnailUrl && project.thumbnailUrl.startsWith("http")) {
          // [수정] 썸네일 저장: projectId, "thumbnail"
          const localUrl = await saveImage(project.thumbnailUrl, project.id, "thumbnail");
          return { ...project, thumbnailUrl: localUrl };
        }
        return project;
      })
    );

    return projectsWithLocalImages;
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
export async function getPageContent(blockId: string, projectId: string = "") {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
    });
    
    const blocks = response.results;

    // [추가] 본문 내 이미지 블록 처리
    // projectId가 있는 경우에만 이미지를 다운로드 (이력서 등은 제외할 수도 있음)
    if (projectId) {
      await Promise.all(
        blocks.map(async (block: any) => {
          if (block.type === 'image') {
            const imageInfo = block.image;
            let imageUrl = "";
            
            if (imageInfo.type === 'external') imageUrl = imageInfo.external.url;
            else if (imageInfo.type === 'file') imageUrl = imageInfo.file.url;
            
            if (imageUrl) {
              // 이미지 다운로드 및 로컬 URL로 교체
              const localUrl = await saveImage(imageUrl, projectId, block.id);
              
              // Notion 응답 객체의 URL을 로컬 경로로 직접 수정 (주의: 원본 객체 변형)
              if (imageInfo.type === 'external') imageInfo.external.url = localUrl;
              else if (imageInfo.type === 'file') imageInfo.file.url = localUrl;
            }
          }
        })
      );
    }

    return blocks;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return [];
  }
}

export interface ParsedResume {
  educations: { school: string; period: string; desc: string }[];
  awards: { title: string; date: string; org: string }[];
  skills: Record<string, string[]>;
}

// 텍스트 추출 헬퍼
const getPlainText = (block: any) => {
  const richText = block[block.type]?.rich_text;
  if (!richText) return "";
  return richText.map((t: any) => t.plain_text).join("");
};

export async function getResumeData(): Promise<ParsedResume> {
  const pageId = process.env.NOTION_PORTFOLIO_PAGE_ID;
  if (!pageId) return { educations: [], awards: [], skills: {} };

  try {
    // 페이지의 모든 블록 가져오기
    const blocks = await getPageContent(pageId);

    const data: ParsedResume = {
      educations: [],
      awards: [],
      skills: {},
    };

    let currentSection = "";

    for (const block of blocks) {
      if (!("type" in block)) continue;

      const type = block.type;
      const text = getPlainText(block);

      // 1. 섹션 헤더 감지 (#Education, #Awards, #SKILLS)
      // 노션에서 제목1, 제목2, 제목3 중 하나를 사용했다고 가정
      if (["heading_1", "heading_2", "heading_3"].includes(type)) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes("education")) currentSection = "education";
        else if (
          lowerText.includes("award") ||
          lowerText.includes("certificate")
        )
          currentSection = "awards";
        else if (lowerText.includes("skill")) currentSection = "skills";
        else currentSection = "";
        continue;
      }

      // 2. Education 파싱
      if (currentSection === "education") {
        if (type === "bulleted_list_item") {
          // 예: "2025.07.07 ~ 2025.11.28 삼성 청년 SW·AI 아카데미 2학기"
          // 날짜 패턴: YYYY.MM.DD 또는 YYYY.MM
          const dateMatch = text.match(
            /(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/
          );

          if (dateMatch) {
            const period = dateMatch[0].trim();
            const school = text.replace(period, "").trim();

            // 설명(desc)은 하위 블록(children)에 있을 수 있음.
            // 일단은 간단하게 처리하거나, 필요하면 has_children 체크 후 getPageContent 재호출
            // 여기서는 1단계 하위 블록까지만 가져오는 로직이 없으므로 desc는 빈 값 혹은 별도 로직 필요
            // 만약 설명이 같은 줄에 " - 설명" 형태로 있다면 파싱 가능

            data.educations.push({ school, period, desc: "" });
          } else {
            // 날짜가 없는 경우 (예: 설명 줄일 수도 있음)
            // data.educations[data.educations.length - 1].desc += text; // 이전 항목의 설명으로 추가
          }
        }
      }

      // 3. Awards & Certificates 파싱
      else if (currentSection === "awards") {
        if (type === "bulleted_list_item") {
          // 예: "2025.11.20 자율 프로젝트 우수상 (삼성전자 주식회사)"
          const dateMatch = text.match(/^\d{4}\.\d{2}(\.\d{2})?/);
          const date = dateMatch ? dateMatch[0] : "";
          let content = text.replace(date, "").trim();

          // 괄호 안의 기관명 추출
          const orgMatch = content.match(/\(([^)]+)\)$/); // 마지막 괄호 안 내용
          let org = "";
          let title = content;

          if (orgMatch) {
            org = orgMatch[1];
            title = content.replace(/\(.*\)$/, "").trim();
          }

          data.awards.push({ title, date, org });
        }
      }

      // 4. Skills 파싱
      else if (currentSection === "skills") {
        // [Front-End] Vue, React... 형태의 Callout이나 텍스트
        let content = text;

        // Callout 블록인 경우
        if (type === "callout") {
          content = (block as any).callout?.rich_text?.[0]?.plain_text || "";
        }

        // "[Category] Items" 패턴 매칭
        const match = content.match(/^\[(.*?)\]\s*(.*)/);
        if (match) {
          const category = match[1].trim();
          const items = match[2]
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
          data.skills[category] = items;
        }
      }
    }

    return data;
  } catch (error) {
    console.error("Error parsing resume data:", error);
    return { educations: [], awards: [], skills: {} };
  }
}
