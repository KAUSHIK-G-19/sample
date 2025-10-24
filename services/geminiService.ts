
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 unique, multiple-choice quiz questions about ${topic}. The questions should be suitable for a high school student.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "An array of 5 multiple-choice questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The question text.",
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "An array of 4 possible answers.",
                    items: {
                      type: Type.STRING,
                    },
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: "The correct answer from the options.",
                  },
                },
                required: ["question", "options", "correctAnswer"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const jsonText = response.text.trim();
    try {
      const parsed = JSON.parse(jsonText);
      return parsed.questions as QuizQuestion[];
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError, "Raw text:", jsonText);
      throw new Error("The API returned an invalid response format.");
    }
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    // Re-throw a more generic error to be handled by the UI
    throw new Error("Failed to generate quiz questions. Please check your API key and network connection.");
  }
};
