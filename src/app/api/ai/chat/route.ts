import { NextResponse } from "next/server";
import {
  getPublicProfile,
  getPublicProjects,
  getPublicDesigns,
  getPublicWriting,
  getPublicAIKnowledge,
  filterRelevantKnowledge,
} from "@/lib/ai/retrieval";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { callAIModel } from "@/lib/ai/server";
import { AIChatMessage } from "@/types/ai";

export const revalidate = 0;

function isChatMessage(value: unknown): value is AIChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as { role?: unknown; content?: unknown };
  return (
    (message.role === "system" ||
      message.role === "user" ||
      message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const messages =
      typeof body === "object" &&
      body !== null &&
      "messages" in body &&
      Array.isArray(body.messages)
        ? body.messages as unknown[]
        : null;
    if (!messages || messages.length > 20 || !messages.every(isChatMessage)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }
    if (messages.some((message) => message.content.length > 4000)) {
      return NextResponse.json({ error: "A message is too long." }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    const query = lastUserMessage?.content || "";

    console.log("AI Chat - Query:", query.substring(0, 100));

    const [profile, projects, designs, writing, allKnowledge] = await Promise.all([
      getPublicProfile(),
      getPublicProjects(),
      getPublicDesigns(),
      getPublicWriting(),
      getPublicAIKnowledge(),
    ]);

    console.log("AI Chat - Profile found:", !!profile);
    console.log("AI Chat - Projects count:", projects.length);
    console.log("AI Chat - Designs count:", designs.length);
    console.log("AI Chat - Writing count:", writing.length);
    console.log("AI Chat - Knowledge count:", allKnowledge.length);

    if (!profile) {
      console.error("AI Chat - Profile not found");
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const relevantKnowledge = filterRelevantKnowledge(allKnowledge, query);
    console.log("AI Chat - Relevant knowledge count:", relevantKnowledge.length);

    const systemPrompt = buildSystemPrompt(profile, relevantKnowledge, projects, designs, writing);
    console.log("AI Chat - System prompt length:", systemPrompt.length);

    const modelMessages: AIChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.filter((message) => message.role !== "system"),
    ];

    console.log("AI Chat - Sending to model");
    const aiResponse = await callAIModel(modelMessages);

    console.log("AI Chat - Response received");
    return NextResponse.json({ message: aiResponse });
  } catch (err) {
    console.error("AI Chat - Route error:", err);
    if (err instanceof Error && err.message.includes("timed out")) {
      return NextResponse.json({ error: "The AI request timed out. Please try again." }, { status: 504 });
    }
    if (err instanceof Error && err.message.includes("429")) {
      return NextResponse.json({ error: "The AI service is temporarily busy. Please try again shortly." }, { status: 429 });
    }
    return NextResponse.json(
      { error: "AI service is having trouble right now. Please try again later." },
      { status: 500 }
    );
  }
}