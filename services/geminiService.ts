
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateTask(level: number, language: string): Promise<Task> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a simple micro-task for a mobile earning game. 
      Difficulty Level: ${level}. 
      Language: ${language}.
      The task should be quick, fun, and engaging. It could be a riddle, a creative writing prompt, or a simple logic puzzle.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['trivia', 'creative', 'logic'] },
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard', 'Extreme'] }
          },
          required: ["title", "description", "type", "difficulty"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      description: data.description,
      reward: level * 10 + Math.floor(Math.random() * 50),
      difficulty: data.difficulty,
      type: data.type,
      status: 'available'
    };
  }

  async verifyTask(taskDescription: string, userAnswer: string): Promise<{ success: boolean; feedback: string }> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Verify if the following user answer correctly completes the task.
      Task: ${taskDescription}
      User Answer: ${userAnswer}
      
      Respond with whether they succeeded and a short encouraging feedback.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["success", "feedback"]
        }
      }
    });

    return JSON.parse(response.text || '{"success": false, "feedback": "Error verifying task."}');
  }
}

export const gemini = new GeminiService();
