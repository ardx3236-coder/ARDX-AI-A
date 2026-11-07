import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors({
  origin: "https://ardx3236-coder.github.io"
}));

app.use(express.json({ limit: "20kb" }));

const PORT = process.env.PORT || 3000;

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

app.get("/", (req, res) => {
  res.json({ status: "ARDX AI Backend Online" });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is not configured."
      });
    }

    const message = req.body.message?.trim();

    if (!message || message.length > 5000) {
      return res.status(400).json({
        error: "Invalid message."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are ARDX AI, a helpful, friendly AI assistant. Reply clearly and respectfully."
      }
    });

    res.json({
      reply: response.text || "Please try again."
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      error: "AI service is temporarily unavailable."
    });
  }
});

app.listen(PORT, () => {
  console.log(`ARDX AI running on port ${PORT}`);
});
