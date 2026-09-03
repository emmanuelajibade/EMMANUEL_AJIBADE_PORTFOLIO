import type { AIChatMessage } from "@/types/ai";

export async function callAIModel(messages: AIChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const primaryModel = process.env.AI_MODEL || "openai/gpt-oss-120b";
  const fallbackModel = process.env.AI_FALLBACK_MODEL || "qwen/qwen3.6-27b";

  if (!apiKey) {
    throw new Error("GROQ_API_KEY not set");
  }

  const models = [primaryModel, fallbackModel];
  let lastError: any;

  for (const model of models) {
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
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }

      const errorText = await response.text();
      console.warn(`Model ${model} failed:`, errorText);
      lastError = new Error(`Groq API error: ${response.status} - ${errorText}`);
    } catch (err) {
      console.warn(`Request to ${model} threw:`, err);
      lastError = err;
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  throw lastError;
}