import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import main from './service/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

export function cleanGeminiResponse(rawResponse) {
  try {
    // Remove any markdown code blocks
    let cleaned = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading text before the JSON (like "Generated Questions:")
    const jsonStart = cleaned.indexOf('[');
    const jsonEnd = cleaned.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON array found in response');
    }
    
    cleaned = cleaned.substring(jsonStart, jsonEnd);
    
    // Parse the JSON
    const questions = JSON.parse(cleaned);
    
    // Validate the structure
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    // Optional: Validate each question has required fields
    const validatedQuestions = questions.map((q, index) => {
      if (!q.type || !q.difficulty || !q.question || !q.correctAnswer) {
        throw new Error(`Question at index ${index} is missing required fields`);
      }
      
      // Ensure MCQ has options
      if (q.type === 'MCQ' && (!q.options || !Array.isArray(q.options))) {
        throw new Error(`MCQ at index ${index} is missing options array`);
      }
      
      return q;
    });
    
    return validatedQuestions;
    
  } catch (error) {
    console.error('Error cleaning Gemini response:', error);
    throw new Error(`Failed to parse Gemini response: ${error.message}`);
  }
}

app.use("/api/generate", async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;
    const prompt = `You are a quiz question generator.

Generate ONLY MCQ and TRUE/FALSE questions.

Topic: ${title}
Description: ${description || "N/A"}
Difficulty levels: ${difficulty.join(", ")}

Rules:
- Generate at least 6 questions
- Difficulty must strictly match label
- MCQ must have exactly 4 options
- TRUE/FALSE must have answer True or False
- Each question must include:
  type, difficulty, question, options (if MCQ), correctAnswer

Return ONLY valid JSON array.
No explanation.`;

    const geminires = await main(prompt);
    const questions = cleanGeminiResponse(geminires);
    console.log("Generated Questions:", questions);
    res.json({ success: true, questions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.listen(PORT, () =>
  console.log(` Server running on port ${PORT}`)
);

