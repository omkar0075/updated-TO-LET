
import { GoogleGenAI } from "@google/genai";
import { Property } from "../types";

// Helper to safely access environment variables
const getEnv = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key] || '';
    }
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch (e) {}
  return '';
};

const apiKey = getEnv('VITE_GEMINI_API_KEY') || getEnv('API_KEY');

export const getPropertyInsight = async (property: Property): Promise<string> => {
  if (!apiKey) {
    return "AI insights are currently unavailable (API key missing).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Updated to a stable available model
      contents: `You are a helpful student housing expert in India. 
      Analyze this property and provide a 3-sentence helpful summary for a student.
      Property Type: ${property.propertyType}
      Room Type: ${property.roomType}
      Rent: ₹${property.rent}
      Address: ${property.address}
      Description: ${property.description}
      
      Focus on value for money, neighborhood safety, and suitability for a student.`,
    });
    return response.text || "Could not generate insight at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI assistant is currently resting. Please check the description manually!";
  }
};
