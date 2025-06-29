import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Handle chat interaction
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message input.' });
  }

  try {
    // Health-restricted prompt
    const prompt = `You are a helpful health assistant. Only answer health-related questions. If the question is not related to health, reply with: "I'm here only for health-related queries." Respond to: ${message}`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    if (!response || typeof response !== 'string') {
      throw new Error("Invalid response from Gemini");
    }

    res.status(200).json({ reply: response });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    res.status(500).json({ error: 'Gemini API failed to respond properly.' });
  }
});

// Dummy messages endpoint (optional if you're not saving messages)
router.get('/messages', async (req, res) => {
  res.status(200).json([]); // Return empty array to prevent frontend crash
});

export default router;
