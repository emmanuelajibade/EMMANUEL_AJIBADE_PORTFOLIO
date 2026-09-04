import type { AIChatMessage } from "@/types/ai";

export async function callAIModel(messages: AIChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.AI_MODEL || "openai/gpt-oss-120b";

  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,          // increase a bit for longer answers
      temperature: 0.7,
      // For models that support reasoning, we might need to disable it.
      // Some providers accept `reasoning_effort` or `reasoning: false`.
      // We'll set this if needed.
      reasoning: { enabled: false },   // Try to disable reasoning if supported
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // The content is in `choices[0].message.content`.
  // Some Groq models also return `reasoning` in a separate field – we'll ignore it.
  const content = data.choices?.[0]?.message?.content || "";
  
  // Remove any chain-of-thought if it got included (safety)
  return content.replace(/```thinking[\s\S]*?```/g, "").trim();
}