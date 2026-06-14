import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { FAQ_KNOWLEDGE_BASE } from "./src/data/faq";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Read GEMINI_API_KEY
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is not defined in environment variables.");
        return res.status(500).json({
          error: "Gemini API key is missing. Please configure it in Settings > Secrets."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // format FAQ knowledge base for system instruction
      const faqMarkdown = FAQ_KNOWLEDGE_BASE.map(
        (item) => `Category: ${item.category}\nQuestion: ${item.question}\nAnswer: ${item.answer}`
      ).join("\n---\n\n");

      const systemInstruction = `
You are the official FAQ assistant ("Lumo's Helper") for Memzi Living World, a cozy fantasy Chinese learning app.
Lumo is the adorable mascot (known in Chinese as Xiao Ya 小芽 - 'little sprout') representing curiosity, growth, and optimism.
You help website visitors, Chinese learners, parents, and app testers understand the application.

Here is the official FAQ knowledge base for Memzi Living World:
${faqMarkdown}

---
CRITICAL INSTRUCTIONS:
1. Politely refuse and redirect any questions UNRELATED to Memzi Living World, HSK lessons, Chinese learning, Book World, World Map, Lumo, or support.
   Example: If the user asks "write a python function" or "book me a hotel in Japan", you MUST ONLY reply:
   "I can only help with questions about Memzi Living World 🌱 You can ask me about HSK lessons, Lumo, Book World, World Map, or app support."
2. Do NOT invent or make up any details (like release dates, exact pricing structures, legal claims, or technical features) that are not present in the FAQ knowledge base.
3. If the user asks for details not mentioned in the FAQ, say exactly:
   "I don't have that information yet, but our team can add it soon. You can follow our email waitlist for updates!"
4. Maintain a warm, friendly, clear, concise, and beginner-friendly tone.
5. Do NOT roleplay as an ancient fantasy wizard or speak in long fantasy paragraphs. Keep answers helpful, clear, and structured in 1-3 short, easy-to-read paragraphs. Mention Lumo warmly with a sprout emoji "🌱".
`;

      // Convert messages to Gemini format { role: 'user' | 'model', parts: [{ text: string }] }
      const contents = messages.map((m: any) => {
        const role = m.sender === "user" ? "user" : "model";
        return {
          role,
          parts: [{ text: m.text }],
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature keeps Gemini focused on the facts
        },
      });

      const replyText = response.text || "I don't have that information yet, but the Memzi team can add it soon.";
      return res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini API call failed:", error);
      return res.status(500).json({
        error: "Failed to generate AI response. Please make sure GEMINI_API_KEY is configured in your platform secrets.",
        details: error.message,
      });
    }
  });

  // Serve static check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite development middleware vs Static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
