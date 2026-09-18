import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/* eslint-disable @typescript-eslint/no-explicit-any */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [], projects = [], resumeData = null } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Build projects context
    const projectsContext = projects.map((p: any) =>
      `- ${p.title}: ${p.description} (${p.tags?.join(", ") || "없음"})`
    ).join("\n");

    // Build skills context (카테고리 구분 명확화)
    let skillsContext = "";
    if (resumeData && resumeData.skills) {
      const skillsEntries = Object.entries(resumeData.skills) as [string, string[]][];
      if (skillsEntries.length > 0) {
        skillsContext = skillsEntries
          .map(([category, skills]) => `- ${category} 카테고리: ${skills.join(", ")}`)
          .join("\n");
      }
    }

    // Build work experience context (실무 경력)
    let workExperienceContext = "";
    if (resumeData && resumeData.workExperience) {
      const workExp = resumeData.workExperience;
      if (workExp.length > 0) {
        workExperienceContext = workExp
          .map((item: any) => `- ${item.title} (${item.period})${item.category ? ` : ${item.category}` : ""}`)
          .join("\n");
      }
    }

    // Build other experience context (기타 활동/경험)
    let otherExperienceContext = "";
    if (resumeData && resumeData.experience) {
      const otherExp = resumeData.experience;
      if (otherExp.length > 0) {
        otherExperienceContext = otherExp
          .map((item: any) => `- ${item.title} (${item.period})${item.category ? ` : ${item.category}` : ""}`)
          .join("\n");
      }
    }

    // Build educations context (학력)
    let educationsContext = "";
    if (resumeData && resumeData.educations) {
      const educationList = resumeData.educations;
      if (educationList.length > 0) {
        educationsContext = educationList
          .map((item: any) => `- ${item.school} (${item.period})${item.desc && item.desc.length > 0 ? " : " + item.desc.map((d: any)=>d.text).join(", ") : ""}`)
          .join("\n");
      }
    }

    // Build awards context (수상 내역)
    let awardsContext = "";
    if (resumeData && resumeData.awards) {
      const awards = resumeData.awards;
      if (awards.length > 0) {
        awardsContext = awards
          .map((item: any) => `- ${item.title} (${item.date}) - 주관: ${item.org}`)
          .join("\n");
      }
    }

    // Build certificates context (자격증)
    let certificatesContext = "";
    if (resumeData && resumeData.certificates) {
      const certs = resumeData.certificates;
      if (certs.length > 0) {
        certificatesContext = certs
          .map((item: any) => `- ${item.title} (${item.date}) - 발급: ${item.org}`)
          .join("\n");
      }
    }

    const messages = [
      {
        role: "system" as const,
        content: `당신은 개발자 Kim Chang Ju의 포트폴리오 어시스턴트입니다.
사용자의 질문에 친절하고 정확하게 가이드하세요.

[제공된 데이터 컨텍스트]

📌 Kim Chang Ju의 프로젝트(Projects) 정보:
${projectsContext || "프로젝트 정보가 없습니다."}

📌 Kim Chang Ju의 기술 스택(Skills) 카테고리별 정보:
${skillsContext || "기술 스택 정보가 없습니다."}

📌 Kim Chang Ju의 실무 경력(Work Experience) 이력:
${workExperienceContext || "실무 경력 정보가 없습니다."}

📌 Kim Chang Ju의 기타 경험 및 대외활동(Experience):
${otherExperienceContext || "경험 및 대외활동 정보가 없습니다."}

📌 Kim Chang Ju의 학력(Education) 정보:
${educationsContext || "학력 정보가 없습니다."}

📌 Kim Chang Ju의 수상 내역(Awards):
${awardsContext || "수상 내역 정보가 없습니다."}

📌 Kim 무 Chang Ju의 자격증(Certificates):
${certificatesContext || "자격증 정보가 없습니다."}

위 제공된 모든 정보(프로젝트, 스킬 카테고리, 실무 경력, 대외활동, 학력, 수상 내역, 자격증)를 바탕으로 사용자의 질문에 상세하고 맥락에 맞게 답변하세요. 
정보가 부족한 경우 "아직 등록된 X 관련 정보가 없지만, 다른 N 카테고리를 살펴봐 드릴까요?" 처럼 친절하게 안내하세요.

출력 형식 (오직 유효한 JSON 형식으로만 반환하세요. 마크다운 백틱 등을 포함하지 마세요):
{
  "text": "답변 텍스트",
  "suggestedAction": {
    "type": "navigate" | "none",
    "target": "about" | "resume" | "skills" | "projects" | "workExperience" | "experience" | "education" | "award" | "certificate",
    "message": "추가 안내 메시지"
  }
}

질문 유형에 따라 suggestedAction을 올바르게 지정하세요:
- 프로젝트 관련 질문: { type: "navigate", target: "projects" }
- 스킬/기술 스택 관련 질문: { type: "navigate", target: "skills" }
- 실무 회사 경력 관련 질문: { type: "navigate", target: "workExperience" }
- 봉사/동아리/대외활동 등 경험 질문: { type: "navigate", target: "experience" }
- 학력/학교/전공 관련 질문: { type: "navigate", target: "education" }
- 수상 내역(상장/공모전 등) 관련 질문: { type: "navigate", target: "award" }
- 자격증 관련 질문: { type: "navigate", target: "certificate" }
- 개인 연락처/이메일 등 자기소개: { type: "navigate", target: "about" }
- 그 외 일반/모호한 질문: { type: "none" }`,
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.7,
      max_completion_tokens: 1024,
    });

    let responseText = completion.choices[0]?.message?.content || "{}";

    responseText = responseText.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.substring(7);
    } else if (responseText.startsWith("```")) {
      responseText = responseText.substring(3);
    }
    if (responseText.endsWith("```")) {
      responseText = responseText.substring(0, responseText.length - 3);
    }
    responseText = responseText.trim();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { text: responseText, suggestedAction: null };
    }

    return NextResponse.json({
      text: responseData.text || "죄송합니다. 응답을 가져오는 데 실패했습니다.",
      suggestedAction: responseData.suggestedAction || null,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}