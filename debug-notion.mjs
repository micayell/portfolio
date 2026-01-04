import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

dotenv.config({ path: '.env' });

async function debug() {
  console.log("--- 🔍 NOTION DEBUGGER START ---");
  
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !dbId) {
    console.error("❌ Missing Env Vars");
    return;
  }

  const notion = new Client({ auth: apiKey });

  try {
    // 🔥 request 메서드로 직접 호출 (SDK 버전 이슈 무시)
    const response = await notion.request({
      path: `databases/${dbId}/query`,
      method: "post",
      body: {
        page_size: 1, // 테스트니까 1개만
      },
    });

    console.log(`✅ SUCCESS! Fetched ${response.results.length} items.`);

    if (response.results.length > 0) {
      const firstPage = response.results[0];
      console.log("\n--- Property Keys (Column Names) ---");
      console.log(Object.keys(firstPage.properties)); // 👈 이걸 봐야 매핑 코드를 짤 수 있음
    } else {
      console.log("⚠️ Database is empty.");
    }

  } catch (error) {
    console.error("\n❌ API REQUEST FAILED");
    console.error(error.message);
  }
}

debug();