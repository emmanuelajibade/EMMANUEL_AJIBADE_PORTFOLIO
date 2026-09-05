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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
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
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Chat - Groq API error:", response.status, errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data: unknown = await response.json();

    const content =
      typeof data === "object" &&
      data !== null &&
      "choices" in data &&
      Array.isArray(data.choices) &&
      data.choices[0] &&
      typeof data.choices[0] === "object" &&
      data.choices[0] !== null &&
      "message" in data.choices[0] &&
      typeof data.choices[0].message === "object" &&
      data.choices[0].message !== null &&
      "content" in data.choices[0].message &&
      typeof data.choices[0].message.content === "string"
        ? data.choices[0].message.content
        : "";
    if (!content.trim()) throw new Error("AI provider returned an empty response");
    console.log("AI Chat - Response length:", content.length);

    return content.replace(/```thinking[\s\S]*?```/g, "").trim();
  } catch (error) {
    console.error("AI Chat - Error:", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("AI provider request timed out");
    }
    throw error;
  }
}