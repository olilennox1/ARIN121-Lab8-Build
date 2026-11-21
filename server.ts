import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// POST /api/generate-quiz
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { notes, questionCount } = req.body;

    if (!notes || typeof notes !== 'string' || !notes.trim()) {
      return res.status(400).json({ error: 'Please enter your study notes first to generate a quiz.' });
    }

    const count = Math.min(Math.max(parseInt(questionCount, 10) || 3, 1), 5);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment configuration.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are an expert university professor and exam creator.
Analyze the following university study notes and generate a high quality practice quiz containing exactly ${count} multiple-choice questions.

Requirements:
- Target audience: University undergraduate and graduate students studying course materials.
- Every question must test key concepts, terminology, formulas/principles, relationships, or mechanisms directly covered in the notes.
- Each question must have exactly 4 distinct answer options (A, B, C, D).
- Exactly ONE option must be the correct answer. The other three options must be plausible distractors representing common student misconceptions or distinct concepts mentioned in the notes.
- Include a clear, comprehensive explanation for each question explaining:
  1) Why the correct option is the right answer based on the notes.
  2) Brief context distinguishing why the other options are incorrect.

Study Notes:
"""
${notes.trim()}
"""`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let data: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'A concise subject/topic title for this quiz based on the study notes',
                },
                questions: {
                  type: Type.ARRAY,
                  description: `Array of exactly ${count} multiple-choice quiz questions`,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: {
                        type: Type.INTEGER,
                        description: 'Question number (1 to N)',
                      },
                      question: {
                        type: Type.STRING,
                        description: 'The multiple-choice question prompt for students',
                      },
                      options: {
                        type: Type.ARRAY,
                        description: 'Array of exactly 4 plausible answer options',
                        items: {
                          type: Type.STRING,
                        },
                      },
                      correctIndex: {
                        type: Type.INTEGER,
                        description: 'Zero-based index (0, 1, 2, or 3) indicating which option is correct',
                      },
                      explanation: {
                        type: Type.STRING,
                        description: 'Detailed explanation for the answer key explaining why the answer is correct and clarifying key concepts from the study notes',
                      },
                    },
                    required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
                  },
                },
              },
              required: ['title', 'questions'],
            },
          },
        });

        const text = response.text;
        if (text) {
          data = JSON.parse(text);
          break; // Succeeded!
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} call failed:`, err?.message || err);
        lastError = err;
        // Wait 500ms before attempting fallback model
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!data) {
      let friendlyError = 'Failed to generate quiz. Please try again.';
      if (lastError?.message) {
        try {
          const parsed = JSON.parse(lastError.message);
          if (parsed?.error?.message) {
            friendlyError = parsed.error.message;
          } else {
            friendlyError = lastError.message;
          }
        } catch {
          friendlyError = lastError.message;
        }
      }
      return res.status(500).json({ error: friendlyError });
    }

    return res.json({ success: true, quiz: data });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate quiz. Please try again.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
