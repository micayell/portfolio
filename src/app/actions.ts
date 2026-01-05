"use server";

import { getPageContent } from "@/lib/notion";

export async function fetchProjectContent(pageId: string) {
  if (!pageId) return [];
  return await getPageContent(pageId);
}