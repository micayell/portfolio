// Notion 필드 매핑 설정
// Notion 구조가 변경되면 이 파일만 수정하면 됩니다

export const NOTION_FIELD_MAPPING = {
  // 프로젝트 데이터베이스 필드 매핑
  project: {
    title: ["Name", "Title", "이름", "제목"],
    slug: ["ID", "Slug", "아이디"],
    description: ["Description", "프로젝트 개요", "설명"],
    tags: ["Tags", "기술스택", "TechStack", "태그"],
    thumbnail: ["Thumbnail", "썸네일"],
    period: ["Period", "Date", "기간 및 인원", "기간"],
    role: ["Role", "담당역할", "역할"],
    link: ["Github", "Link", "참고 링크"],
    demo: ["Demo", "Live", "데모 링크"],
    award: ["Award", "Prize", "수상"],
    figma: ["FigmaURL", "Figma", "피그마"],
    goal: ["Goal", "목표"],
    background: ["Background", "배경"],
    members: ["Members", "인원"],
  },
  
  // 이력서 페이지 섹션 매핑
  resume: {
    education: ["Education", "교육", "학력"],
    awards: ["Awards", "수상", "상"],
    certificates: ["Certificates", "자격증", "Certificate"],
    experience: ["Experience", "경험"],
    workExperience: ["Work Experience", "경력"],
    skills: ["Skills", "기술", "Skill"],
  },
} as const;

// 필드 값 추출 헬퍼 함수
export function findField(properties: Record<string, unknown>, fieldNames: readonly string[]) {
  for (const fieldName of fieldNames) {
    if (properties[fieldName]) {
      return properties[fieldName];
    }
  }
  return null;
}

// 필드 매핑 실패 로깅
export function logMissingField(fieldType: string, attemptedFields: readonly string[]) {
  console.warn(`[Notion Mapping] ${fieldType} field not found. Attempted: ${attemptedFields.join(", ")}`);
}
