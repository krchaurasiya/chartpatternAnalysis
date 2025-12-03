import { GoogleGenAI, Type } from "@google/genai";
import { ChartAnalysisResult, RLDecision } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export const analyzeChartImage = async (base64Image: string): Promise<ChartAnalysisResult> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/png", data: cleanBase64 } },
          {
            text: `You are a veteran technical analyst. Analyze the chart image.
            Identify chart patterns, trend, support/resistance.
            Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patternName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            trend: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"] },
            supportLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            resistanceLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            analysis: { type: Type.STRING },
            actionableAdvice: { type: Type.STRING }
          },
          required: ["patternName", "confidence", "trend", "supportLevels", "resistanceLevels", "analysis", "actionableAdvice"]
        }
      }
    });

    if (!response.text) throw new Error("No response");
    return JSON.parse(response.text) as ChartAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze chart pattern.");
  }
};

export const consultRLAgent = async (base64Image: string, marketContext: string): Promise<RLDecision> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/png", data: cleanBase64 } },
          {
            text: `Act as a Deep Reinforcement Learning (RL) Trading Agent. 
            Your State Space is the visual chart data provided.
            Your Action Space is [BUY, SELL, HOLD].
            Market Context: ${marketContext}
            
            Task:
            1. Analyze the 'State' (Trends, Volume, Volatility).
            2. Compute a policy action (Action with highest expected reward).
            3. Estimate the Reward/Risk ratio.
            
            Return the optimal policy in JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
            confidence: { type: Type.NUMBER, description: "Model certainty 0-100" },
            rewardRiskRatio: { type: Type.NUMBER },
            suggestedEntry: { type: Type.STRING },
            stopLoss: { type: Type.STRING },
            takeProfit: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            detectedState: {
              type: Type.OBJECT,
              properties: {
                trend: { type: Type.STRING },
                volatility: { type: Type.STRING },
                keyLevels: { type: Type.STRING }
              }
            }
          },
          required: ["action", "confidence", "rewardRiskRatio", "suggestedEntry", "stopLoss", "takeProfit", "reasoning", "detectedState"]
        }
      }
    });

    if (!response.text) throw new Error("No response from Agent");
    return JSON.parse(response.text) as RLDecision;

  } catch (error) {
    console.error("RL Agent Error:", error);
    throw new Error("RL Agent failed to converge on a decision.");
  }
};