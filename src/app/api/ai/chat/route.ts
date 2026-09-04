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

// Ensure no caching – always fetch latest data
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    const query = lastUserMessage?.content || "";

    const [profile, projects, designs, writing, allKnowledge] = await Promise.all([
      getPublicProfile(),
      getPublicProjects(),
      getPublicDesigns(),
      getPublicWriting(),
      getPublicAIKnowledge(),
    ]);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const relevantKnowledge = filterRelevantKnowledge(allKnowledge, query);
    const systemPrompt = buildSystemPrompt(profile, relevantKnowledge, projects, designs, writing);

    const modelMessages: AIChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.filter(m => m.role !== "system"),
    ];

    const aiResponse = await callAIModel(modelMessages);

    return NextResponse.json({ message: aiResponse });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: "I'm having trouble answering that right now. Please try again later." },
      { status: 500 }
    );
  }
}