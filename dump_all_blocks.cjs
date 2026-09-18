const { Client } = require("@notionhq/client");
const fs = require("fs");

const envLines = fs.readFileSync(".env", "utf-8").split("\n");
const envVars = {};
for (const line of envLines) {
  if (line.startsWith("NOTION_API_KEY=")) envVars.NOTION_API_KEY = line.replace("NOTION_API_KEY=", "").trim();
  if (line.startsWith("NOTION_PORTFOLIO_PAGE_ID=")) envVars.NOTION_PORTFOLIO_PAGE_ID = line.replace("NOTION_PORTFOLIO_PAGE_ID=", "").trim();
}

const notion = new Client({ auth: envVars.NOTION_API_KEY });

async function findImages(blockId) {
  const blocks = await notion.blocks.children.list({ block_id: blockId });
  let images = blocks.results.filter(b => b.type === "image");
  for (const block of blocks.results) {
    if (block.has_children) {
      const childImages = await findImages(block.id);
      images = images.concat(childImages);
    }
  }
  return images;
}

async function run() {
  const pageId = envVars.NOTION_PORTFOLIO_PAGE_ID;
  const images = await findImages(pageId);
  console.log("ALL IMAGES:", JSON.stringify(images, null, 2));
}
run();
