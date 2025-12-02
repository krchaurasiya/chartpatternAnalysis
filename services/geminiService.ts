import { GoogleGenAI, Type } from "@google/genai";
import { ChartAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeChartImage = async (base64Image: string): Promise<ChartAnalysisResult> => {
  try {
    // Remove header if present (e.g., "data:image/png;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", // Assuming PNG, but API is flexible
              data: cleanBase64
            }
          },
          {
            text: `You are a veteran technical analyst for stock and cryptocurrency markets. 
            Analyze the provided chart image strictly. 
            Identify specific chart patterns (e.g., Head and Shoulders, Double Top, Bull Flag, Cup and Handle).
            Determine the immediate trend.
            Identify key support and resistance price levels visible in the image.
            Provide actionable advice based on standard technical analysis theory.
            
            Return the response in structured JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patternName: { type: Type.STRING, description: "The primary chart pattern identified." },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100." },
            trend: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"] },
            supportLevels: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of price levels acting as support."
            },
            resistanceLevels: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of price levels acting as resistance."
            },
            analysis: { type: Type.STRING, description: "Detailed technical analysis summary." },
            actionableAdvice: { type: Type.STRING, description: "Trading suggestion (e.g., Wait for breakout, Stop loss at X)." }
          },
          required: ["patternName", "confidence", "trend", "supportLevels", "resistanceLevels", "analysis", "actionableAdvice"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as ChartAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze chart pattern. Please ensure the image is clear.");
  }
};