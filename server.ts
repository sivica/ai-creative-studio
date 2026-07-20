import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;

function formatGeminiError(error: any): string {
  const errorString = typeof error === 'object' ? JSON.stringify(error) : String(error);
  const errMsg = error?.message || String(error);
  
  if (
    errMsg.includes('leaked') || 
    errorString.includes('leaked') || 
    errMsg.includes('Please use another API key') || 
    errorString.includes('Please use another API key')
  ) {
    return "Your Gemini API Key has been reported as leaked by security scans. Google has disabled this key for safety. Please generate a new key from the Google AI Studio console and update your Secrets panel (Settings > Secrets).";
  }
  
  if (
    errMsg.includes('PERMISSION_DENIED') || 
    errMsg.includes('403') || 
    errorString.includes('PERMISSION_DENIED') || 
    errorString.includes('403')
  ) {
    return "Permission denied. This usually means your 'GEMINI_API_KEY' is invalid, leaked, or restricted. Please double-check it under Settings > Secrets.";
  }

  if (errMsg.includes('API key is not configured') || errorString.includes('MY_GEMINI_API_KEY')) {
    return "Gemini API key is not configured in the workspace secrets. Please add it in the Secrets panel (Settings > Secrets).";
  }

  return errMsg || "An unexpected error occurred while communicating with the Gemini API.";
}

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Gemini API key is not configured in the workspace secrets. Please add it in the Secrets panel (Settings > Secrets).');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, useSearch } = req.body;
      const ai = getAI();

      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: 'You are an advanced AI Notebook Brainstorming Companion. Provide beautifully structured, detailed answers with clear markdown formatting. Be conversational, insightful, and clear.',
          tools: useSearch ? [{ googleSearch: {} }] : undefined,
        },
      });

      const text = response.text || '';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Web Source',
        uri: chunk.web?.uri || '',
      })).filter((s: any) => s.uri) || [];

      res.json({ text, sources });
    } catch (error: any) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: formatGeminiError(error) });
    }
  });

  // Image Generation Endpoint
  app.post('/api/generate-image', async (req, res) => {
    try {
      const { prompt } = req.body;
      const ai = getAI();

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let base64Image = '';
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (!base64Image) {
        throw new Error('The image model did not return any image data.');
      }

      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } catch (error: any) {
      console.error('Image API Error:', error);
      res.status(500).json({ error: formatGeminiError(error) });
    }
  });

  // Text-To-Speech Endpoint
  app.post('/api/generate-speech', async (req, res) => {
    try {
      const { text, voice } = req.body;
      const ai = getAI();

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: `Say expressively: ${text}` }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('The audio model did not return any speech data.');
      }

      res.json({ audioData: base64Audio });
    } catch (error: any) {
      console.error('Speech API Error:', error);
      res.status(500).json({ error: formatGeminiError(error) });
    }
  });

  // Flashcards Generator Endpoint
  app.post('/api/generate-flashcards', async (req, res) => {
    try {
      const { topicOrNotes } = req.body;
      const ai = getAI();

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Generate a rich study deck of 5 to 7 interactive flashcards from the following notes or topic: "${topicOrNotes}".`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: {
                  type: Type.STRING,
                  description: 'The core term, concept, or question on the front.',
                },
                back: {
                  type: Type.STRING,
                  description: 'The explanation, definition, or answer on the back.',
                },
                category: {
                  type: Type.STRING,
                  description: 'A single-word category or context tag.',
                },
              },
              required: ['front', 'back', 'category'],
            },
          },
        },
      });

      const text = response.text || '[]';
      const flashcards = JSON.parse(text.trim());
      res.json({ flashcards });
    } catch (error: any) {
      console.error('Flashcard API Error:', error);
      res.status(500).json({ error: formatGeminiError(error) });
    }
  });

  // Integrate Vite dev server or serve static production bundle
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});
