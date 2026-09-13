import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const generateSchema = z.object({
  title: z.string(),
  role: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  category: z.string().optional(),
  apiKey: z.string().optional(),
});

export const generateProjectAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => generateSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = (
      data.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      ""
    ).replace(/^["']|["']$/g, "").trim();

    if (!apiKey) {
      throw new Error(
        "Google AI Studio API Key is missing. Please enter your API key in Site Settings (or in your .env file)."
      );
    }

    const prompt = `You are a professional software portfolio copywriter for a senior developer.
Generate concise, high-impact content for the following project:
- Title: ${data.title}
- Role: ${data.role || "Full-Stack Developer"}
- Category: ${data.category || "Full-Stack Web App"}
- Tech Stack: ${(data.techStack || []).join(", ") || "MERN Stack"}

Return ONLY a valid raw JSON object (strictly valid JSON, no markdown code block, no markdown formatting) with these exact keys:
{
  "desc": "A crisp, engaging 1-2 sentence overview of what the app does and how it was built.",
  "impact": "A short, punchy technical impact or metric (under 8 words, e.g. '30% faster load times with Redis' or 'Real-time ordering with Firebase')"
}`;

    const models = [
      "gemini-3.6-flash",
      "gemini-flash-latest",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3.8-flash",
    ];
    let response: Response | null = null;
    let lastError = "";

    for (const model of models) {
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 1000,
              },
            }),
          }
        );
        if (response.ok) break;
        lastError = await response.text();
      } catch (e: any) {
        lastError = e?.message || "Network error";
      }
    }

    if (!response || !response.ok) {
      console.error("Gemini API error:", lastError);
      let errorMsg = "Failed to generate content";
      try {
        const parsed = JSON.parse(lastError);
        errorMsg = parsed.error?.message || errorMsg;
      } catch {}
      throw new Error(`Google AI Studio error: ${errorMsg}`);
    }

    const resJson = await response.json();
    const candidateText =
      resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = candidateText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      return {
        ok: true,
        desc: (parsed.desc || "").trim(),
        impact: (parsed.impact || "").trim(),
      };
    } catch {
      return {
        ok: true,
        desc: cleaned.trim(),
        impact: "",
      };
    }
  });
