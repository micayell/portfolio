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

    // Build conversation context
    const projectsContext = projects.map((p: any) =>
      `- ${p.title}: ${p.description} (기술스택: ${p.tags?.join(", ") || "없음"})`
    ).join("\n");

    // Build skills context
    let skillsContext = "";
    if (resumeData && resumeData.skills) {
      const skillsEntries = Object.entries(resumeData.skills) as [string, string[]][];
      if (skillsEntries.length > 0) {
        skillsContext = skillsEntries
          .map(([category, skills]) => `- ${category}: ${skills.join(", ")}`)
          .join("\n");
      }
    }

    // Build experience context
    let experienceContext = "";
    if (resumeData) {
      const allExperience = [
        ...(resumeData.experience || []).map((e: any) => ({ ...e, type: "Experience" })),
        ...(resumeData.workExperience || []).map((e: any) => ({ ...e, type: "Work Experience" })),
      ];
      if (allExperience.length > 0) {
        experienceContext = allExperience
          .map((e: any) => `- ${e.type} - ${e.title} (${e.period}): ${e.category || "General"}`)
          .join("\n");
      }
    }

    const messages = [
      {
        role: "system" as const,
        content: `당신은 개발자 Kim Chang Ju의 포트폴리오 어시스턴트입니다.
사용자의 질문에 친절하고 정확하게 답변하세요.

다음은 Kim Chang Ju의 프로젝트 정보입니다:
${projectsContext}

다음은 Kim Chang Ju의 기술 스택 정보입니다:
${skillsContext || "기술 스택 정보가 없습니다."}

다음은 Kim Chang Ju의 경력 정보입니다:
${experienceContext || "경력 정보가 없습니다."}

이 프로젝트, 기술 스택, 경력 정보를 기반으로 답변하세요.

답변 형식 (JSON):
{
  "text": "답변 텍스트",
  "suggestedAction": {
    "type": "navigate" | "none",
    "target": "about" | "resume" | "skills" | "projects",
    "message": "추가 메시지"
  }
}

질문 유형에 따라 suggestedAction을 설정하세요:
- 프로젝트 관련: { type: "navigate", target: "projects" }
- 이력서/경력: { type: "navigate", target: "resume" }
- 기술 스택: { type: "navigate", target: "skills" }
- 개인 정보/연락처: { type: "navigate", target: "about" }
- 일반 대화: { type: "none" }`,
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
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const responseData = JSON.parse(responseText);

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
