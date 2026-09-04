import type { AIChatMessage } from "@/types/ai";

export async function callAIModel(messages: AIChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.AI_MODEL || "openai/gpt-oss-120b";

  console.log("AI Chat - Model:", model);
  console.log("AI Chat - API Key present:", !!apiKey);

  if (!apiKey) {
    console.error("AI Chat - GROQ_API_KEY is missing");
    throw new Error("GROQ_API_KEY not set");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Chat - Groq API error:", response.status, errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Safely extract content
    const content = data?.choices?.[0]?.message?.content || "";
    console.log("AI Chat - Response length:", content.length);

    // Remove any chain-of-thought if it got included
    return content.replace(/```thinking[\s\S]*?```/g, "").trim();
  } catch (error) {
    console.error("AI Chat - Error:", error);
    throw error;
  }
};