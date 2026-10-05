import {Client} from "@notionhq/client";
import {Project} from "@/features/projects/types/project";
import {NOTION_FIELD_MAPPING, findField, logMissingField} from "@/features/common/config/notion-mapping";
import {
    BlockObjectResponse,
    PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    throw new Error("Missing Notion API Key or Database ID");
}

const notion = new Client({auth: process.env.NOTION_API_KEY});

// ----------------------------------------------------
// Type-Safe Helpers to extract Notion Properties safely
// ----------------------------------------------------

function getRichText(prop: unknown): string {
    if (!prop || typeof prop !== 'object') return "";
    const p = prop as Record<string, unknown>;
    if (Array.isArray(p.rich_text) && p.rich_text.length > 0) {
        return (p.rich_text[0] as { plain_text: string }).plain_text || "";
    }
    if (Array.isArray(p.title) && p.title.length > 0) {
        return (p.title[0] as { plain_text: string }).plain_text || "";
    }
    return "";
}

function getDateRange(prop: unknown): string {
    if (!prop || typeof prop !== 'object') return "";
    const p = prop as Record<string, unknown>;
    if (p.type === "date" && p.date && typeof p.date === 'object') {
        const d = p.date as { start?: string, end?: string };
        return d.start ? `${d.start} ~ ${d.end || "진행중"}` : "";
    }
    return getRichText(prop);
}

function getUrl(prop: unknown): string | undefined {
    if (!prop || typeof prop !== 'object') return undefined;
    const p = prop as Record<string, unknown>;
    if (typeof p.url === 'string' && p.url) return p.url;
    return getRichText(prop) || undefined;
}

function getMultiSelect(prop: unknown): string[] {
    if (!prop || typeof prop !== 'object') return [];
    const p = prop as Record<string, unknown>;
    if (Array.isArray(p.multi_select)) {
        return p.multi_select.map(item => (item as { name: string }).name || "");
    }
    return [];
}

interface NotionFile {
    type: string;
    file?: { url: string };
    external?: { url: string };
}

function getFileUrl(prop: unknown): string | undefined {
    if (!prop || typeof prop !== 'object') return undefined;
    const p = prop as Record<string, unknown>;
    if (Array.isArray(p.files) && p.files.length > 0) {
        const f = p.files[0] as NotionFile;
        return f.type === "external" ? f.external?.url : f.file?.url;
    }
    return undefined;
}

// ----------------------------------------------------
// Project Parsing
// ----------------------------------------------------

const mapPageToProject = (page: PageObjectResponse): Project => {
    const props = page.properties;
    const mapping = NOTION_FIELD_MAPPING.project;

    const titleProp = findField(props, mapping.title);
    if (!titleProp) logMissingField("Title", mapping.title);
    const title = getRichText(titleProp) || "Untitled";

    const slugProp = findField(props, mapping.slug);
    if (!slugProp) logMissingField("Slug", mapping.slug);
    const id = getRichText(slugProp) || page.id;

    const descProp = findField(props, mapping.description);
    if (!descProp) logMissingField("Description", mapping.description);
    const description = getRichText(descProp);

    const tagsProp = findField(props, mapping.tags);
    if (!tagsProp) logMissingField("Tags", mapping.tags);
    const tags = getMultiSelect(tagsProp);

    let thumbnailUrl = "/file.svg";
    const cover = page.cover as NotionFile | null;
    if (cover?.type === "external" && cover.external) {
        thumbnailUrl = cover.external.url;
    } else if (cover?.type === "file") {
        thumbnailUrl = `/api/notion-image-proxy?pageId=${page.id}&lastEdited=${page.last_edited_time}`;
    } else {
        const thumbnailProp = findField(props, mapping.thumbnail) as { id?: string } | undefined;
        const fileUrl = getFileUrl(thumbnailProp);
        if (fileUrl && thumbnailProp?.id) {
            thumbnailUrl = `/api/notion-image-proxy?pageId=${page.id}&propertyId=${thumbnailProp.id}&lastEdited=${page.last_edited_time}`;
        }
    }

    const periodProp = findField(props, mapping.period);
    if (!periodProp) logMissingField("Period", mapping.period);
    const period = getDateRange(periodProp);

    const roleProp = findField(props, mapping.role);
    if (!roleProp) logMissingField("Role", mapping.role);
    const role = getRichText(roleProp);

    const linkProp = findField(props, mapping.link);
    if (!linkProp) logMissingField("Link", mapping.link);
    const githubUrl = getUrl(linkProp);

    const demoUrl = getUrl(findField(props, mapping.demo));
    const award = getRichText(findField(props, mapping.award)) || undefined;
    const figmaUrl = getUrl(findField(props, mapping.figma));

    const goal = getRichText(findField(props, mapping.goal)) || description;
    const background = getRichText(findField(props, mapping.background));
    const members = getRichText(findField(props, mapping.members));

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
        skills: tags.map((t: string) => ({name: t, reason: "Used in project"})),
        features: [],
        troubleShooting: [],
    };
};

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      // API에서는 기본적으로 가장 최근 수정된 항목부터 가져오도록 하여
      // 데이터가 100건을 넘을 때 가장 최신 데이터가 우선 fetch 되도록 함.
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending",
        },
      ],
    });

    const pages = response.results.filter(
      (res): res is PageObjectResponse => "properties" in res
    );

    const projects = pages.map(mapPageToProject);

    // 프론트엔드 레벨 정렬 (수상내역 O우선 -> 기간 최신순)
    projects.sort((a, b) => {
        const aHasAward = a.award && a.award.trim() !== "" ? 1 : 0;
        const bHasAward = b.award && b.award.trim() !== "" ? 1 : 0;

        // 1. 수상내역 여부로 정렬 (있는 프로젝트를 먼저)
        if (aHasAward !== bHasAward) {
            return bHasAward - aHasAward;
        }

        // 2. 수상내역 유무가 같으면, 기간(period) 내림차순 정렬
        const periodA = a.overview.period || "";
        const periodB = b.overview.period || "";
        return periodB.localeCompare(periodA);
    });

    return projects;
  } catch (error: unknown) {
    console.error("❌ Notion API Error:", error instanceof Error ? error.message : error);
    return [];
  }
}


export async function getProject(slug: string): Promise<Project | null> {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID!,
            filter: {
                property: "ID",
                rich_text: {
                    equals: slug,
                },
            },
        });

        if (response.results.length === 0) return null;
        const page = response.results[0];
        if (!("properties" in page)) return null;

        return mapPageToProject(page as PageObjectResponse);
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
}

// ----------------------------------------------------
// Block Parsing Framework
// ----------------------------------------------------

export type CustomBlock = BlockObjectResponse & {
    children?: CustomBlock[];
    depth?: number;
};

export async function getPageContent(blockId: string, projectId: string = "", isFlatten: boolean = true, depth: number = 0): Promise<CustomBlock[]> {
    try {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        let response;
        let retries = 3;
        while (retries > 0) {
            try {
                response = await notion.blocks.children.list({block_id: blockId});
                break;
            } catch (error: unknown) {
                const err = error as { code?: string; status?: number };
                if (err.code === 'rate_limited' || err.status === 429) {
                    retries--;
                    console.warn(`[Notion API] Rate limited. Retrying... (${retries} retries left)`);
                    await sleep(1500);
                } else {
                    console.error("Notion API error:", error);
                    return [];
                }
            }
        }

        if (!response) {
            console.error("Failed to fetch blocks after retries due to rate limit.");
            return [];
        }

        const blocks = response.results.filter(
            (b): b is BlockObjectResponse => "type" in b
        );

        const processedBlocks: CustomBlock[] = [];

        for (const b of blocks) {
            const block = b as CustomBlock;
            block.depth = depth;

            if ((block.type as string) === 'column_list') {
                const columns = await getPageContent(block.id, projectId, isFlatten);
                const shouldFlatten = isFlatten && (block.type as string) !== 'table';
                if (shouldFlatten) {
                    processedBlocks.push(...columns);
                    continue;
                } else {
                    block.children = columns;
                    processedBlocks.push(block);
                    continue;
                }
            }

            if ((block.type as string) === 'column') {
                const children = await getPageContent(block.id, projectId, isFlatten);
                const shouldFlatten = isFlatten && (block.type as string) !== 'table';
                if (shouldFlatten) {
                    processedBlocks.push(...children);
                    continue;
                } else {
                    block.children = children;
                    processedBlocks.push(block);
                    continue;
                }
            }

            if (block.has_children && (block.type as string) !== 'column_list' && (block.type as string) !== 'column') {
                await new Promise(resolve => setTimeout(resolve, 350));
                const children = await getPageContent(block.id, projectId, isFlatten, (depth || 0) + 1);
                const shouldFlatten = isFlatten && (block.type as string) !== 'table';
                if (shouldFlatten) {
                    processedBlocks.push(block);
                    processedBlocks.push(...children);
                    continue;
                } else {
                    block.children = children;
                }
            }

            processedBlocks.push(block);
        }

        return processedBlocks;

    } catch (error) {
        console.error("Error fetching page content:", error);
        return [];
    }
}

// ----------------------------------------------------
// Resume Parsing
// ----------------------------------------------------

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

const getBlockPlainText = (block: CustomBlock): string => {
    const type = block.type as string;
    // block[type].rich_text 패턴의 속성을 가진 타입들에 대한 타입 단언
    const content = (block as Record<string, unknown>)[type] as { rich_text?: { plain_text: string }[] };
    if (!content || !content.rich_text) return "";
    return content.rich_text.map(t => t.plain_text).join("");
};

export async function getResumeData(): Promise<ParsedResume> {
    const pageId = process.env.NOTION_PORTFOLIO_PAGE_ID;

    if (!pageId) {
        console.error("[Build Error] NOTION_PORTFOLIO_PAGE_ID is missing in env variables.");
        return {
            educations: [], awards: [], certificates: [],
            experience: [], workExperience: [], skills: {}
        };
    }

    try {
        const blocks = await getPageContent(pageId);

        const data: ParsedResume = {
            educations: [], awards: [], certificates: [],
            experience: [], workExperience: [], skills: {}
        };

        const imageBlock = blocks.find((b) => b.type === "image");
        if (imageBlock && imageBlock.type === "image") {
            const img = imageBlock.image as NotionFile;
            if (img.type === "external" && img.external) {
                data.profileImageUrl = img.external.url;
            } else if (img.type === "file") {
                data.profileImageUrl = `/api/notion-image-proxy?blockId=${imageBlock.id}&lastEdited=${imageBlock.last_edited_time}`;
            }
        }

        let currentSection = "";
        let currentCategory = "";
        let currentSkillCategory = "";
        let currentParentDepth = 0;
        const sectionMapping = NOTION_FIELD_MAPPING.resume;

        for (const block of blocks) {
            const type = block.type as string;
            const text = getBlockPlainText(block);

            const isHeading = ["heading_1", "heading_2", "heading_3"].includes(type);

            if (isHeading) {
                const lowerText = text.toLowerCase();
                if (sectionMapping.education.some((s) => lowerText.includes(s.toLowerCase()))) {
                    currentSection = "education";
                    currentSkillCategory = "";
                } else if (sectionMapping.awards.some((s) => lowerText.includes(s.toLowerCase()))) {
                    currentSection = "awards";
                    currentSkillCategory = "";
                } else if (sectionMapping.certificates.some((s) => lowerText.includes(s.toLowerCase()))) {
                    currentSection = "certificates";
                    currentSkillCategory = "";
                } else if (sectionMapping.experience.some((s) => lowerText.includes(s.toLowerCase()))) {
                    currentSection = "experience";
                    currentCategory = "";
                    currentSkillCategory = "";
                } else if (sectionMapping.workExperience.some((s) => lowerText.includes(s.toLowerCase()))) {
                    currentSection = "workExperience";
                    currentSkillCategory = "";
                } else if (sectionMapping.skills.some((s) => lowerText.includes(s.toLowerCase()))) {
                    currentSection = "skills";
                    currentSkillCategory = "";
                } else if (currentSection === "skills") {
                    currentSkillCategory = text.trim();
                    if (!data.skills[currentSkillCategory]) {
                        data.skills[currentSkillCategory] = [];
                    }
                }
                continue;
            }

            if (currentSection === "education") {
                if (type === "bulleted_list_item") {
                    const dateMatch = text.match(/(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/);
                    if (dateMatch) {
                        currentParentDepth = block.depth || 0;
                        const period = dateMatch[0].trim();
                        const school = text.replace(period, "").trim();
                        const desc: DescriptionItem[] = [];

                        const collectChildrenText = (children: CustomBlock[], currentDepth: number = 0) => {
                            children.forEach((child) => {
                                const childText = getBlockPlainText(child);
                                if (childText) desc.push({text: childText, depth: currentDepth});
                                if (child.children) collectChildrenText(child.children, currentDepth + 1);
                            });
                        };

                        if (block.children) collectChildrenText(block.children, 0);
                        data.educations.push({school, period, desc});
                    } else {
                        if (data.educations.length > 0) {
                            data.educations[data.educations.length - 1].desc.push({
                                text: text,
                                depth: Math.max(0, (block.depth || 0) - currentParentDepth - 1)
                            });
                        }
                    }
                }
            } else if (currentSection === "experience" || currentSection === "workExperience") {
                if (type === "bulleted_list_item") {
                    const dateMatch = text.match(/(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/);

                    const collectDesc = (children: CustomBlock[], currentDepth: number = 0): DescriptionItem[] => {
                        const result: DescriptionItem[] = [];
                        children.forEach(child => {
                            const t = getBlockPlainText(child);
                            if (t) result.push({text: t, depth: currentDepth});
                            if (child.children) result.push(...collectDesc(child.children, currentDepth + 1));
                        });
                        return result;
                    };

                    const targetArray = currentSection === "experience" ? data.experience : data.workExperience;
                    const assignedCategory = currentSection === "workExperience" ? "경력" : currentCategory;

                    if (dateMatch) {
                        currentParentDepth = block.depth || 0;
                        const period = dateMatch[0].trim();
                        const title = text.replace(period, "").trim();
                        let desc: DescriptionItem[] = [];
                        if (block.children) desc = collectDesc(block.children, 0);
                        targetArray.push({category: assignedCategory, title, period, desc});
                    } else {
                        const children = block.children || [];
                        let isCategory = false;
                        
                        if (children.length > 0) {
                            for (const child of children) {
                                if (getBlockPlainText(child).match(/(\d{4}\.\d{2})/)) {
                                    isCategory = true;
                                    break;
                                }
                            }
                        } else {
                            const currentIndex = blocks.indexOf(block);
                            if (currentIndex !== -1 && currentIndex + 1 < blocks.length) {
                                const nextBlock = blocks[currentIndex + 1];
                                if ((nextBlock.depth || 0) > (block.depth || 0)) {
                                    if (getBlockPlainText(nextBlock).match(/(\d{4}\.\d{2})/)) {
                                        isCategory = true;
                                    }
                                }
                            }
                        }

                        if (isCategory) {
                            currentCategory = text.trim();
                            const useCategory = currentSection === "workExperience" ? "경력" : currentCategory;
                            
                            if (children.length > 0) {
                                for (const child of children) {
                                    const childText = getBlockPlainText(child);
                                    const childDateMatch = childText.match(/(\d{4}\.\d{2}(\.\d{2})?(\s*~\s*(\d{4}\.\d{2}(\.\d{2})?|현재|진행중))?)/);
                                    if (childDateMatch) {
                                        const p = childDateMatch[0].trim();
                                        const t = childText.replace(p, "").trim();
                                        let d: DescriptionItem[] = [];
                                        if (child.children) d = collectDesc(child.children, 0);
                                        targetArray.push({category: useCategory, title: t, period: p, desc: d});
                                    }
                                }
                            }
                        } else {
                            if (targetArray.length > 0) {
                                if (children.length === 0) {
                                    targetArray[targetArray.length - 1].desc.push({
                                        text: text,
                                        depth: Math.max(0, (block.depth || 0) - currentParentDepth - 1)
                                    });
                                } else {
                                    targetArray[targetArray.length - 1].desc.push(...collectDesc([block], 0));
                                }
                            }
                        }
                    }
                }
            } else if (currentSection === "awards" || currentSection === "certificates") {
                if (type === "bulleted_list_item") {
                    const dateMatch = text.match(/^\d{4}\.\d{2}(\.\d{2})?/);
                    const date = dateMatch ? dateMatch[0] : "";
                    const content = text.replace(date, "").trim();
                    const orgMatch = content.match(/\([^)]+\)$/);
                    let org = "";
                    let title = content;

                    if (orgMatch) {
                        org = orgMatch[1];
                        title = content.replace(/\(.*\)$/, "").trim();
                    }
                    if (currentSection === "awards") {
                        data.awards.push({title, date, org});
                    } else {
                        data.certificates.push({title, date, org});
                    }
                }
            } else if (currentSection === "skills") {
                if (type === "callout") {
                    const calloutBlock = (block as Record<string, unknown>).callout as {
                        rich_text?: { plain_text: string }[]
                    };
                    const content = calloutBlock?.rich_text?.map(t => t.plain_text).join("") || "";
                    const match = content.match(/^\[(.*?)]\s*([\s\S]*)/);
                    if (match) {
                        const category = match[1].trim();
                        const items = match[2].split(/[,n]/).map(s => s.trim()).filter(Boolean);
                        if (items.length > 0) data.skills[category] = items;
                    }
                } else if (type === "paragraph") {
                    if (currentSkillCategory && text.trim()) {
                        const items = text.split(/[,n]/).map(s => s.trim()).filter(Boolean);
                        if (items.length > 0) {
                            if (!data.skills[currentSkillCategory]) data.skills[currentSkillCategory] = [];
                            data.skills[currentSkillCategory].push(...items);
                        }
                    }
                } else if (type === "table") {

                    if (block.children) {
                        block.children.forEach(row => {
                            if (row.type === "table_row") {
                                const tr = (row as Record<string, unknown>).table_row as {
                                    cells?: { plain_text: string }[][]
                                };
                                if (tr && tr.cells && tr.cells.length > 0) {
                                    const cells = tr.cells;
                                    const categoryCell = cells[0];
                                    if (categoryCell && categoryCell[0]) {
                                        const categoryText = categoryCell.map(t => t.plain_text).join("").trim();
                                        if (categoryText) {
                                            if (!data.skills[categoryText]) data.skills[categoryText] = [];
                                            for (let i = 1; i < cells.length; i++) {
                                                const skillCell = cells[i];
                                                if (skillCell && skillCell[0]) {
                                                    const skillText = skillCell.map(t => t.plain_text).join("").trim();
                                                    if (skillText) data.skills[categoryText].push(skillText);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                } else if (type === "child_database") {
                    const dbId = block.id;
                    if (dbId) {
                        try {
                            const dbResponse = await notion.databases.query({database_id: dbId});

                            const dbPages = dbResponse.results.filter(
                                (res): res is PageObjectResponse => "properties" in res
                            );

                            for (const page of dbPages) {
                                const props = page.properties as Record<string, unknown>;

                                const categoryProp = (props["분야"] || props.category || props.Category) as {
                                    select?: { name: string }
                                };
                                const category = categoryProp?.select?.name || "";

                                const skillProp = props["기술 스택"] || props.skill || props.Skill;
                                const skill = getRichText(skillProp);

                                if (category && skill) {
                                    if (!data.skills[category]) data.skills[category] = [];
                                    data.skills[category].push(skill);
                                }
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
            educations: [], awards: [], certificates: [],
            experience: [], workExperience: [], skills: {}
        };
    }
}
