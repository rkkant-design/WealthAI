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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Portfolio Context:\n${JSON.stringify(context || {}, null, 2)}\n\nUser Question/Request:\n${prompt}`,
      config: {
        systemInstruction: COPILOT_SYSTEM_INSTRUCTION,
        temperature: 0.35,
      },
    });

    return res.json({
      source: "gemini_live",
      text: response.text,
    });
  } catch (error: any) {
    console.error("Gemini copilot router error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI copilot response",
    });
  }
});

export default router;
