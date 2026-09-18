import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function run() {
  const pageId = process.env.NOTION_PORTFOLIO_PAGE_ID;
  const page = await notion.pages.retrieve({ page_id: pageId });
  console.log("PAGE COVER:", JSON.stringify(page.cover, null, 2));
  console.log("PAGE ICON:", JSON.stringify(page.icon, null, 2));
  
  const blocks = await notion.blocks.children.list({ block_id: pageId });
  const images = blocks.results.filter(b => b.type === 'image');
  console.log("IMAGE BLOCKS:", JSON.stringify(images, null, 2));
}
run();
