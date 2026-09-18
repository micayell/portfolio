import { Client } from "@notionhq/client";
import { Project } from "@/features/projects/types/project";
import { NOTION_FIELD_MAPPING, findField, logMissingField } from "@/features/common/config/notion-mapping";

/* eslint-disable @typescript-eslint/no-explicit-any */

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  throw new Error("Missing Notion API Key or Database ID");
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 공통 매핑 함수 (노션 페이지 -> 프로젝트 객체)
const mapPageToProject = (page: any): Project => {
  const props = page.properties;
  const mapping = NOTION_FIELD_MAPPING.project;

  // 1. 제목 (Title)
  const titleProp = findField(props, mapping.title);
  const title = (titleProp as any)?.title?.[0]?.plain_text || "Untitled";
  if (!titleProp) logMissingField("Title", mapping.title);

  // 2. ID (Slug)
  const slugProp = findField(props, mapping.slug);
  const id = (slugProp as any)?.rich_text?.[0]?.plain_text || page.id;
  if (!slugProp) logMissingField("Slug", mapping.slug);

  // 3. 설명 (Description / 프로젝트 개요)
  const descProp = findField(props, mapping.description);
  const description = (descProp as any)?.rich_text?.[0]?.plain_text || "";
  if (!descProp) logMissingField("Description", mapping.description);

  // 4. 태그 (Tags / 기술스택)
  const tagsProp = findField(props, mapping.tags);
  const tags = (tagsProp as any)?.multi_select?.map((tag: any) => tag.name) || [];
  if (!tagsProp) logMissingField("Tags", mapping.tags);

  // 5. 썸네일 (커버 이미지 > 파일 속성 순)
  let thumbnailUrl;
  if (page.cover?.type === "external") {
    thumbnailUrl = page.cover.external.url;
  } else if (page.cover?.type === "file") {
    thumbnailUrl = page.cover.file.url;
  } else {
    const thumbnailProp = findField(props, mapping.thumbnail);
    if ((thumbnailProp as any)?.files?.[0]?.file?.url) {
      thumbnailUrl = (thumbnailProp as any).files[0].file.url;
    } else {
      thumbnailUrl = "/file.svg";
    }
  }

  // 6. 기간 (Period / Date / 기간 및 인원)
  const periodProp = findField(props, mapping.period);
  let period = "";
  if ((periodProp as any)?.type === "date") {
    period = (periodProp as any).date
      ? `${(periodProp as any).date.start} ~ ${(periodProp as any).date.end || "진행중"}`
      : "";
  } else {
    period = (periodProp as any)?.rich_text?.[0]?.plain_text || "";
  }
  if (!periodProp) logMissingField("Period", mapping.period);

  // 7. 역할 (Role / 담당역할)
  const roleProp = findField(props, mapping.role);
  const role = (roleProp as any)?.rich_text?.[0]?.plain_text || "";
  if (!roleProp) logMissingField("Role", mapping.role);

  // 8. 링크 (Link / 참고 링크 / Github)
  const linkProp = findField(props, mapping.link);
  const githubUrl =
    (linkProp as any)?.url || (linkProp as any)?.rich_text?.[0]?.plain_text || undefined;
  if (!linkProp) logMissingField("Link", mapping.link);

  // 9. 데모, 수상, 피그마
  const demoProp = findField(props, mapping.demo);
  const demoUrl =
    (demoProp as any)?.url || (demoProp as any)?.rich_text?.[0]?.plain_text || undefined;

  const awardProp = findField(props, mapping.award);
  const award = (awardProp as any)?.rich_text?.[0]?.plain_text || undefined;

  const figmaProp = findField(props, mapping.figma);
  const figmaUrl =
    (figmaProp as any)?.url || (figmaProp as any)?.rich_text?.[0]?.plain_text || undefined;

  // 10. 배경 및 목표
  const goalProp = findField(props, mapping.goal);
  const goal = (goalProp as any)?.rich_text?.[0]?.plain_text || description;

  const bgProp = findField(props, mapping.background);
  const background = (bgProp as any)?.rich_text?.[0]?.plain_text || "";

  const membersProp = findField(props, mapping.members);
  const members = (membersProp as any)?.rich_text?.[0]?.plain_text || "";

  return {
    id,
    pageId: page.id,
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

    // Notion URL을 그대로 사용 (Vercel 서버리스 환경 호환)
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
        property: "ID",
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
// - column_list와 column을 재귀적으로 순회하며 내부 블록을 평탄화하여 반환 (isFlatten=true)
export async function getPageContent(blockId: string, projectId: string = "", isFlatten: boolean = true): Promise<any[]> {
  try {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await notion.blocks.children.list({ block_id: blockId });
        break;
      } catch (error: any) {
        if (error.code === 'rate_limited' || error.status === 429) {
          retries--;
          console.warn(`[Notion API] Rate limited. Retrying... (${retries} retries left)`);
          await sleep(1500); // wait 1.5 seconds before retrying
        } else {
          throw error;
        }
      }
    }
    
    if (!response) {
       throw new Error("Failed to fetch blocks after retries due to rate limit.");
    }
    
    const blocks = response.results;

        const processedBlocks = [];
    for (const obj of blocks) { const block = obj as any;
        // [컬럼 레이아웃 처리] column_list -> column -> children
        if (block.type === 'column_list') {
            const columns = await getPageContent(block.id, projectId, isFlatten);
            if (isFlatten) {
              processedBlocks.push(columns);
              continue;
            } else {
              block.children = columns;
              processedBlocks.push(block);
              continue;
            }
        }

        if (block.type === 'column') {
             const children = await getPageContent(block.id, projectId, isFlatten);
             if (isFlatten) {
               processedBlocks.push(children);
               continue;
             } else {
               block.children = children;
               processedBlocks.push(block);
               continue;
             }
        }

        // [일반 하위 블록 처리] (들여쓰기 내용 가져오기)
        if (block.has_children && block.type !== 'column_list' && block.type !== 'column') {
          // Add a small delay to respect Notion's 3 req/sec limit deeply nested
          await new Promise(resolve => setTimeout(resolve, 350));
          (block as any).children = await getPageContent(block.id, projectId, isFlatten);
        }

        processedBlocks.push(block);
    }

    // 중첩된 배열 평탄화 (column_list/column 처리 결과가 배열로 들어오므로)
    if (isFlatten) {
      return processedBlocks.flat(Infinity);
    }
    return processedBlocks;

  } catch (error) {
    console.error("Error fetching page content:", error);
    return [];
  }
}

// 들여쓰기 지원을 위한 타입 정의
export interface DescriptionItem {
  text: string;
  depth: number;
}

export interface ParsedResume {
  educations: { school: string; period: string; desc: DescriptionItem[] }[];
  awards: { title: string; date: string; org: string }[];
  certificates: { title: string; date: string; org: string }[];
  experience: { category: string; title: string; period: string; desc: DescriptionItem[] }[];
  workExperience: { category: string; title: string; period: string; desc: DescriptionItem[] }[];
  skills: Record<string, string[]>;
  profileImageUrl?: string;
}

// 텍스트 추출 헬퍼
const getPlainText = (block: any) => {
  const richText = block[block.type]?.rich_text;
  if (!richText) return "";
  return richText.map((t: any) => t.plain_text).join("");
};

export async function getResumeData(): Promise<ParsedResume> {
  const pageId = process.env.NOTION_PORTFOLIO_PAGE_ID;

  if (!pageId) {
    console.error("[Build Error] NOTION_PORTFOLIO_PAGE_ID is missing in env variables.");
    return {
      educations: [],
      awards: [],
      certificates: [],
      experience: [],
      workExperience: [],
      skills: {},
      profileImageUrl: "",
    };
  }

  try {
    // 페이지의 모든 블록 가져오기 (컬럼 레이아웃 포함 평탄화됨)
    const blocks = await getPageContent(pageId);

    const data: ParsedResume = {
      educations: [],
      awards: [],
      certificates: [],
      experience: [],
      workExperience: [],
      skills: {},
      profileImageUrl: "",
    };

    // 프로필 이미지 추출
      const imageBlock = blocks.find((b: any) => b.type === "image");
      if (imageBlock) {
        if (imageBlock.image?.type === "external") {
          data.profileImageUrl = imageBlock.image.external.url;
        } else if (imageBlock.image?.type === "file") {
          data.profileImageUrl = imageBlock.image.file.url;
        }
      }

      let currentSection = "";
    let currentCategory = ""; // Experience 내부 카테고리
    let currentSkillCategory = ""; // Skills 내부 카테고리
    const sectionMapping = NOTION_FIELD_MAPPING.resume;

    for (const block of blocks) {
      if (!("type" in block)) continue;

      const type = block.type;
      const text = getPlainText(block);

      // 1. 섹션 헤더 감지 (매핑 설정 사용)
      if (["heading_1", "heading_2", "heading_3"].includes(type)) {
        const lowerText = text.toLowerCase();

        // 메인 섹션 헤더 감지
        if (sectionMapping.education.some((s) => lowerText.includes(s.toLowerCase()))) {
           currentSection = "education";
           currentSkillCategory = "";
        }
        else if (sectionMapping.awards.some((s) => lowerText.includes(s.toLowerCase()))) {
           currentSection = "awards";
           currentSkillCategory = "";
        }
        else if (sectionMapping.certificates.some((s) => lowerText.includes(s.toLowerCase()))) {
           currentSection = "certificates";
           currentSkillCategory = "";
        }
        else if (sectionMapping.experience.some((s) => lowerText.includes(s.toLowerCase()))) {
          currentSection = "experience";
          currentCategory = "";
          currentSkillCategory = "";
        }
        else if (sectionMapping.workExperience.some((s) => lowerText.includes(s.toLowerCase()))) {
          currentSection = "workExperience";
          // currentCategory = "경력";
          currentSkillCategory = "";
        }
        else if (sectionMapping.skills.some((s) => lowerText.includes(s.toLowerCase()))) {
           currentSection = "skills";
           currentSkillCategory = "";
        }
        // Skills 섹션 내부에서의 소제목(카테고리) 판별
        else if (currentSection === "skills") {
             currentSkillCategory = text.trim();
             if (!data.skills[currentSkillCategory]) {
                 data.skills[currentSkillCategory] = [];
             }
        }

        continue;
      }

      // 2. Education 파싱
      if (currentSection === "education") {
        if (type === "bulleted_list_item") {
          const dateMatch = text.match(
            /(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/
          );

          if (dateMatch) {
            const period = dateMatch[0].trim();
            const school = text.replace(period, "").trim();
            const desc: DescriptionItem[] = [];
            
            const collectChildrenText = (children: any[], currentDepth: number = 0) => {
                children.forEach((child) => {
                    const childText = getPlainText(child);
                    if (childText) desc.push({ text: childText, depth: currentDepth });
                    if (child.children) collectChildrenText(child.children, currentDepth + 1);
                });
            };

            if ((block as any).children) collectChildrenText((block as any).children, 0);
            data.educations.push({ school, period, desc });
          }
        }
      }

      // 3. Experience 파싱 (계층 구조 지원)
      else if (currentSection === "experience") {
        if (type === "bulleted_list_item") {
          const dateMatch = text.match(
            /(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/
          );

          const collectDesc = (children: any[], currentDepth: number = 0): DescriptionItem[] => {
             const result: DescriptionItem[] = [];
             children.forEach(child => {
                 const t = getPlainText(child);
                 if(t) result.push({ text: t, depth: currentDepth });
                 if(child.children) result.push(...collectDesc(child.children, currentDepth + 1));
             });
             return result;
          };

          if (dateMatch) {
            const period = dateMatch[0].trim();
            const title = text.replace(period, "").trim();
            let desc: DescriptionItem[] = [];
            if ((block as any).children) desc = collectDesc((block as any).children, 0);
            data.experience.push({ category: currentCategory, title, period, desc });
          }
          else {
            const children = (block as any).children || [];
            let isCategory = false;
            for (const child of children) {
              const childText = getPlainText(child);
              if (childText.match(/(\d{4}\.\d{2})/)) {
                isCategory = true;
                break;
              }
            }

            if (isCategory) {
               currentCategory = text.trim();
               for (const child of children) {
                 const childText = getPlainText(child);
                 const childDateMatch = childText.match(/(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/);
                 if (childDateMatch) {
                   const p = childDateMatch[0].trim();
                   const t = childText.replace(p, "").trim();
                   let d: DescriptionItem[] = [];
                   if (child.children) d = collectDesc(child.children, 0);
                   data.experience.push({ category: currentCategory, title: t, period: p, desc: d });
                 }
               }
            } else {
               if (data.experience.length > 0) {
                 data.experience[data.experience.length - 1].desc.push({ text, depth: 0 });
               }
            }
          }
        }
      }

      // 3-1. Work Experience 파싱 (계층 구조 지원)
      else if (currentSection === "workExperience") {
        if (type === "bulleted_list_item") {
          const dateMatch = text.match(
            /(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/
          );

          const collectDesc = (children: any[], currentDepth: number = 0): DescriptionItem[] => {
             const result: DescriptionItem[] = [];
             children.forEach(child => {
                 const t = getPlainText(child);
                 if(t) result.push({ text: t, depth: currentDepth });
                 if(child.children) result.push(...collectDesc(child.children, currentDepth + 1));
             });
             return result;
          };

          if (dateMatch) {
            const period = dateMatch[0].trim();
            const title = text.replace(period, "").trim();
            let desc: DescriptionItem[] = [];
            if ((block as any).children) desc = collectDesc((block as any).children, 0);
            data.workExperience.push({ category: "경력", title, period, desc });
          }
          else {
            const children = (block as any).children || [];
            let isCategory = false;
            for (const child of children) {
              const childText = getPlainText(child);
              if (childText.match(/(\d{4}\.\d{2})/)) {
                isCategory = true;
                break;
              }
            }

            if (isCategory) {
               currentCategory = text.trim();
               for (const child of children) {
                 const childText = getPlainText(child);
                 const childDateMatch = childText.match(/(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/);
                 if (childDateMatch) {
                   const p = childDateMatch[0].trim();
                   const t = childText.replace(p, "").trim();
                   let d: DescriptionItem[] = [];
                   if (child.children) d = collectDesc(child.children, 0);
                   data.workExperience.push({ category: "경력", title: t, period: p, desc: d });
                 }
               }
            } else {
               if (data.workExperience.length > 0) {
                 data.workExperience[data.workExperience.length - 1].desc.push({ text, depth: 0 });
               }
            }
          }
        }
      }

      // 4. Awards 파싱
      else if (currentSection === "awards") {
        if (type === "bulleted_list_item") {
          const dateMatch = text.match(/^\d{4}\.\d{2}(\.\d{2})?/);
          const date = dateMatch ? dateMatch[0] : "";
          const content = text.replace(date, "").trim();
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

      // 5. Certificates 파싱
      else if (currentSection === "certificates") {
        if (type === "bulleted_list_item") {
          const dateMatch = text.match(/^\d{4}\.\d{2}(\.\d{2})?/);
          const date = dateMatch ? dateMatch[0] : "";
          const content = text.replace(date, "").trim();
          const orgMatch = content.match(/\(([^)]+)\)$/);
          let org = "";
          let title = content;

          if (orgMatch) {
            org = orgMatch[1];
            title = content.replace(/\(.*\)$/, "").trim();
          }
          data.certificates.push({ title, date, org });
        }
      }

      // 6. Skills 파싱 (구조 개선: 제목 -> 단락/리스트/표)
      else if (currentSection === "skills") {
        // (1) Callout 방식 (기존 호환성)
        if (type === "callout") {
            const content = (block as any).callout?.rich_text?.map((t: any) => t.plain_text).join("") || "";
            const match = content.match(/^\[(.*?)]\s*([\s\S]*)/);
            if (match) {
                const category = match[1].trim();
                const items = match[2].split(/[,\n]/).map((s: string) => s.trim()).filter(Boolean);
                if (items.length > 0) data.skills[category] = items;
            }
        }
        // (2) 일반 텍스트 (Paragraph) -> 스킬 목록으로 추가
        else if (type === "paragraph") {
            if (currentSkillCategory && text.trim()) {
                const items = text.split(/[,\n]/).map((s: string) => s.trim()).filter(Boolean);
                if (items.length > 0) {
                    if (!data.skills[currentSkillCategory]) data.skills[currentSkillCategory] = [];
                    data.skills[currentSkillCategory].push(...items);
                }
            }
        }
        // (3) 표(Table) 파싱
        else if (type === "table") {
            const table = (block as any).table;
            if (table && table.children) {
                table.children.forEach((row: any) => {
                    if (row.type === "table_row" && row.table_row && row.table_row.cells) {
                        const cells = row.table_row.cells;
                        // 첫 번째 열을 카테고리로 처리, 나머지 열을 스킬로 처리
                        if (cells.length > 0) {
                            const categoryCell = cells[0];
                            if (categoryCell && categoryCell[0]) {
                                const categoryText = categoryCell[0].map((t: any) => t.plain_text).join("").trim();
                                if (categoryText) {
                                    if (!data.skills[categoryText]) {
                                        data.skills[categoryText] = [];
                                    }
                                    // 나머지 열의 데이터를 해당 카테고리에 추가
                                    for (let i = 1; i < cells.length; i++) {
                                        const skillCell = cells[i];
                                        if (skillCell && skillCell[0]) {
                                            const skillText = skillCell[0].map((t: any) => t.plain_text).join("").trim();
                                            if (skillText) {
                                                data.skills[categoryText].push(skillText);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        // (4) child_database 파싱 (데이터베이스 뷰)
        else if (type === "child_database") {
            const dbId = (block as any).id;
            if (dbId) {
                // 데이터베이스 쿼리를 통해 데이터 가져오기
                try {
                    const dbResponse: any = await notion.request({
                        path: `databases/${dbId}/query`,
                        method: "post",
                    });
                    if (dbResponse.results) {
                        dbResponse.results.forEach((page: any) => {
                            const props = page.properties;
                            // "분야" 필드를 카테고리로 사용
                            const categoryProp = props.분야 || props.category || props.Category;
                            const category = categoryProp?.select?.name || "";

                            // "기술 스택" 필드를 스킬로 사용
                            const skillProp = props["기술 스택"] || props.skill || props.Skill;
                            const skill = skillProp?.title?.[0]?.plain_text || skillProp?.rich_text?.[0]?.plain_text || "";

                            if (category && skill) {
                                if (!data.skills[category]) {
                                    data.skills[category] = [];
                                }
                                data.skills[category].push(skill);
                            }
                        });
                    }
                } catch (error) {
                    console.error("[Skills Debug] Error querying child_database:", error);
                }
            }
        }
      }
    }

    
    return data;
  } catch (error) {
    console.error("[Build Error] Exception in getResumeData:", error);
    return {
      educations: [],
      awards: [],
      certificates: [],
      experience: [],
      workExperience: [],
      skills: {},
      profileImageUrl: "",
    };
  }
}

