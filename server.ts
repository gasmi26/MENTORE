/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Instructor Prompt System Instruction
const GENERAL_SYSTEM_PROMPT = `You are a DSA Instructor. 
You will help with DSA (Data Structures and Algorithms) questions and problems only.
DSA Means Data Structure And Algorithms.
If anyone asks you about anything other than DSA (including non-DSA coding general-purposes, visual arts, pop-culture, general writing, history etc.), you must politely refuse to answer and ask them to ask a DSA related question.
Keep descriptions neat, structured, and use Markdown formatting for lists and tables to represent code dry-runs or Big O analysis.
Always provide elegant, clear and well-commented code snippets in your answers where relevant. Avoid overly complex syntax when simpler approaches exist.`;

// API routes first
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentStep, problemContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid parameters. 'messages' array is required." });
    }

    const ai = getGenAI();

    // Map client messages to `@google/genai` SDK Content type
    const contents = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Adjust system instruction dynamically based on workspace contextual triggers
    let systemInstruction = GENERAL_SYSTEM_PROMPT;
    if (currentStep && problemContext) {
      const stepInstructions: Record<string, string> = {
        brainstorm: `You are guiding the student through the brainstorm / conceptual understanding phase of "${problemContext.title}". 
Focus only on helper questions, base inputs, edge cases (like empty lists, huge arrays, negatives), and general problem insights.
Explain the brute force approach first. Help them find intuitive logic. DO NOT give full solutions or copyable code yet.`,
        
        complexity: `You are guiding the student through Complexity Analysis of "${problemContext.title}".
Break down both the Brute Force and the Optimal approach. Explaining step-by-step why they take specific time and space complexities.
Use tables or charts where possible to compare them. Highlight O(1), O(N), O(log N), and O(N^2) elements clearly. Do not supply optimal code implementations yet.`,
        
        pseudocode: `You are guiding the student to build pseudocode/dry-run for "${problemContext.title}".
Provide a logical, step-by-step pseudocode blueprint (language agnostic or simple structured syntax).
Show a manual Trace/Dry-run with a small sample input so they understand how indices or pointers increment.`,
        
        solution: `Provide the final, fully-functional, optimal executable code snippet for "${problemContext.title}".
Include comments explaining each section, key pointer offsets, and hashmap lookup details. Also state the final Time and Space complexities.
Make sure to follow standard conventions for the problem.`
      };

      if (stepInstructions[currentStep]) {
        systemInstruction = `${GENERAL_SYSTEM_PROMPT}\n\n[CONTEXTUAL MODE - STEP: ${currentStep.toUpperCase()}]\n${stepInstructions[currentStep]}\n\nProblem details:\nTitle: ${problemContext.title}\nDescription:\n${problemContext.description}`;
      }
    }

    // Call Gemini API using standard stable model gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("API Error in /api/chat:", error);
    res.status(500).json({
      error: "Failed to communicate with the DSA AI Instructor.",
      details: error.message || "Unknown error inside Gemini API server-proxy."
    });
  }
});

// Configure Vite middleware in development vs static serving in production
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DSA AI Instructor Server running on http://localhost:${PORT}`);
  });
}

configureApp().catch((err) => {
  console.error("Server failure during initialization:", err);
});
