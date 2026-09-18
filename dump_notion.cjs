const { Client } = require("@notionhq/client");
const fs = require("fs");

const envLines = fs.readFileSync(".env", "utf-8").split("\n");
const envVars = {};
for (const line of envLines) {
  if (line.startsWith("NOTION_API_KEY=")) envVars.NOTION_API_KEY = line.replace("NOTION_API_KEY=", "").trim();
  if (line.startsWith("NOTION_PORTFOLIO_PAGE_ID=")) envVars.NOTION_PORTFOLIO_PAGE_ID = line.replace("NOTION_PORTFOLIO_PAGE_ID=", "").trim();
}

const notion = new Client({ auth: envVars.NOTION_API_KEY });

async function run() {
  const pageId = envVars.NOTION_PORTFOLIO_PAGE_ID;
  const page = await notion.pages.retrieve({ page_id: pageId });
  console.log("PAGE COVER:", page.cover?.external?.url || page.cover?.file?.url || "null");
  console.log("PAGE ICON:", page.icon?.external?.url || page.icon?.file?.url || "null");
}
run();
