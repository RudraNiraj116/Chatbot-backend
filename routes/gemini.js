import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/health-check", async (req, res) => {
  const { bp, sugar, heartRate } = req.body;

  const prompt = `
You're a health assistant. Analyze this patient's health metrics and provide a short, clear medical report.

Blood Pressure: ${bp}
Blood Sugar: ${sugar} mg/dL
Heart Rate: ${heartRate} bpm

Include any warnings if values are abnormal. Base your response on real-world health standards.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.json({ result: text });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Failed to generate analysis" });
  }
});

export default router;
