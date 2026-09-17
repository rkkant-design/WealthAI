import { getGeminiClient, COPILOT_SYSTEM_INSTRUCTION } from "../../server/gemini.js";
import { CONFIG } from "../../server/config.js";

// POST /api/copilot (mapped via netlify.toml)
export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, context } = body as { prompt?: string; context?: unknown };
    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return Response.json({
        source: "simulated_engine",
        text: null,
        message: "Gemini API key not configured. Using rule-based investment heuristics.",
      });
    }

    const contents = `User Portfolio Context:\n${JSON.stringify(context || {}, null, 2)}\n\nUser Question/Request:\n${prompt}`;
    let text = "";
    try {
      const response = await ai.models.generateContent({
        model: CONFIG.GEMINI_MODEL,
        contents,
        config: { systemInstruction: COPILOT_SYSTEM_INSTRUCTION, temperature: 0.35 },
      });
      text = response.text || "";
    } catch (modelErr: any) {
      console.warn("Primary model error, attempting fallback:", modelErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: CONFIG.GEMINI_FALLBACK_MODEL,
        contents,
        config: { systemInstruction: COPILOT_SYSTEM_INSTRUCTION, temperature: 0.35 },
      });
      text = fallbackResponse.text || "";
    }

    return Response.json({ source: "gemini_live", text });
  } catch (error: any) {
    console.error("Gemini copilot function error:", error);
    return Response.json({ error: error.message || "Failed to generate AI copilot response" }, { status: 500 });
  }
};
