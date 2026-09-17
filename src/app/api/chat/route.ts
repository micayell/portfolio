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
      `- ${p.title}: ${p.description} (${p.tags?.join(", ") || "없음"})`
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

    // Build work experience context (실무 경력)
    let workExperienceContext = "";
    if (resumeData && resumeData.workExperience) {
      const workExp = resumeData.workExperience;
      if (workExp.length > 0) {
        workExperienceContext = workExp
          .map((e: any) => `- ${e.title} (${e.period})${e.category ? ` : ${e.category}` : ""}`)
          .join("\n");
      }
    }

    // Build other experience context (기타 활동/경험)
    let otherExperienceContext = "";
    if (resumeData && resumeData.experience) {
      const otherExp = resumeData.experience;
      if (otherExp.length > 0) {
        otherExperienceContext = otherExp
          .map((e: any) => `- ${e.title} (${e.period})${e.category ? ` : ${e.category}` : ""}`)
          .join("\n");
      }
    }

    const messages = [
      {
        // language=Markdown
        role: "system" as const,
        content: `당신은 개발자 Kim Chang Ju의 포트폴리오 어시스턴트입니다.
사용자의 질문에 친절하고 정확하게 답변하세요.

다음은 Kim Chang Ju의 프로젝트 정보입니다:
${projectsContext}

다음은 Kim Chang Ju의 기술 스택 정보입니다:
${skillsContext || "기술 스택 정보가 없습니다."}

다음은 Kim Chang Ju의 실무 경력(Work Experience) 정보입니다:
${workExperienceContext || "실무 경력 정보가 없습니다."}

다음은 Kim Chang Ju의 기타 경험 및 대외활동(Experience) 정보입니다:
${otherExperienceContext || "경험 및 대외활동 정보가 없습니다."}

이 프로젝트, 기술 스택, 실무 경력, 기타 경험 정보를 기반으로 답변하세요.

[경력과 기타 경험 구분 안내]
1. 사용자가 "경력(인턴, 회사 등)"을 물어볼 때는 혼선을 피하기 위해 가급적 [실무 경력] 항목의 정보만 부드럽게 대답해 주세요. (봉사활동, 동아리 등은 제외)
2. 사용자가 "다양한 경험, 활동, 봉사, 대외활동" 등을 물어볼 때는 [기타 경험 및 대외활동] 정보를 활용하여 답변해 주세요.
3. 데이터가 부족할 경우 "아직 등록된 정규 실무 경력은 없지만, 다양한 대외활동과 인턴 경험을 쌓았습니다."처럼 맥락에 맞게 유연하고 친절하게 안내해 주세요.

답변 형식 (오직 유효한 JSON 형식으로만 반환하세요. 마크다운 백틱 등을 포함하지 마세요.):
{
  "text": "답변 텍스트",
  "suggestedAction": {
    "type": "navigate" | "none",
    "target": "about" | "resume" | "skills" | "projects",
    "message": "추가 메시지"
  }
}

질문 유형에 따라 suggestedAction을 설정하세요:
- 프로젝트 관련 질문: { type: "navigate", target: "projects" }
- 실무 회사 경력 관련 질문: { type: "navigate", target: "workExperience" }
- 기타 대외 경험 및 활동 관련 질문: { type: "navigate", target: "experience" }
- 기술 스택(Skills) 관련 질문: { type: "navigate", target: "skills" }
- 개인 정보 및 연락처 관련 질문: { type: "navigate", target: "about" }
- 일반 대화 및 기타: { type: "none" }`,
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
    
    // Strip markdown formatting if present
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
