import { Router } from "express";
import { getGeminiClient, COPILOT_SYSTEM_INSTRUCTION } from "../gemini.js";

const router = Router();

// POST /api/copilot
router.post("/copilot", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        source: "simulated_engine",
        text: null,
        message: "Gemini API key not configured. Using rule-based investment heuristics.",
      });
    }

    let text = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `User Portfolio Context:\n${JSON.stringify(context || {}, null, 2)}\n\nUser Question/Request:\n${prompt}`,
        config: {
          systemInstruction: COPILOT_SYSTEM_INSTRUCTION,
          temperature: 0.35,
        },
      });
      text = response.text || "";
    } catch (modelErr: any) {
      console.warn("Primary model error, attempting fallback:", modelErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `User Portfolio Context:\n${JSON.stringify(context || {}, null, 2)}\n\nUser Question/Request:\n${prompt}`,
        config: {
          systemInstruction: COPILOT_SYSTEM_INSTRUCTION,
          temperature: 0.35,
        },
      });
      text = fallbackResponse.text || "";
    }

    return res.json({
      source: "gemini_live",
      text,
    });
  } catch (error: any) {
    console.error("Gemini copilot router error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI copilot response",
    });
  }
});

export default router;
