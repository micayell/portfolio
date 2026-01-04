import { Client } from "@notionhq/client";
import { Project } from "@/types/project";

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  throw new Error("Missing Notion API Key or Database ID");
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getProjects(): Promise<Project[]> {
  try {
    // 🔥 SDK 버전 문제 회피: request 메서드로 직접 호출
    // 중요: path 앞에는 슬래시(/)가 없어야 합니다.
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

    console.log(`✅ [Notion API] Fetched ${response.results.length} items`);

    const projects = response.results.map((page: any) => {
      const props = page.properties;

      // 제목
      const titleProp = props.Name || props.Title || props.이름 || props.제목;
      const title = titleProp?.title?.[0]?.plain_text || "Untitled";

      // 설명
      const descProp = props.Description || props.설명;
      const description = descProp?.rich_text?.[0]?.plain_text || "";

      // 태그
      const tagsProp = props.Tags || props.TechStack || props.태그;
      const tags = tagsProp?.multi_select?.map((tag: any) => tag.name) || [];

      // 썸네일
      let thumbnailUrl = "/file.svg";
      if (page.cover?.type === "external") thumbnailUrl = page.cover.external.url;
      else if (page.cover?.type === "file") thumbnailUrl = page.cover.file.url;
      else if (props.Thumbnail?.files?.[0]?.file?.url) thumbnailUrl = props.Thumbnail.files[0].file.url;

      return {
        id: page.id,
        title,
        description,
        tags,
        thumbnailUrl,
        githubUrl: props.Github?.url || undefined,
        demoUrl: props.Demo?.url || undefined,
        figmaUrl: props.Figma?.url || undefined,
        award: props.Award?.rich_text?.[0]?.plain_text || undefined,
        
        overview: {
          goal: props.Goal?.rich_text?.[0]?.plain_text || "",
          background: props.Background?.rich_text?.[0]?.plain_text || "",
          role: props.Role?.rich_text?.[0]?.plain_text || "",
          period: props.Date?.date ? `${props.Date.date.start} ~ ${props.Date.date.end || "진행중"}` : "",
          members: props.Members?.rich_text?.[0]?.plain_text || "",
        },
        skills: tags.map((t: string) => ({ name: t, reason: "Used in project" })),
        features: [],
        troubleShooting: [],
      } as Project;
    });

    return projects;

  } catch (error: any) {
    console.error("❌ Notion API Error:", error.body || error.message);
    return [];
  }
}