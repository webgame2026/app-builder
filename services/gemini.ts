
import { GoogleGenAI, Type } from "@google/genai";
import { AppConcept, ChatMessage } from "../types";

export const generateAppConcept = async (
  prompt: string, 
  history: ChatMessage[], 
  currentConcept: AppConcept | null
): Promise<{ concept: AppConcept; thought: string }> => {
  // FIX: Create a new GoogleGenAI instance inside the function to ensure up-to-date API key usage.
  const ai = new GoogleGenAI({ apiKey: process.env.AIzaSyDR9krpZNzrT9M9DiEhuBMaLs18WDFME8A });
  
  const conversationContext = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
  const filesContext = currentConcept 
    ? `CURRENT APP STATE:\n${currentConcept.files.map(f => `--- ${f.name} ---\n${f.content}`).join('\n')}`
    : "No existing app state. This is a new project.";

  try {
    // FIX: Using 'gemini-3-pro-preview' for complex coding and architectural reasoning tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        CONTEXT:
        ${conversationContext}
        
        ${filesContext}

        USER REQUEST:
        "${prompt}"

        INSTRUCTION:
        1. If this is a new project, design a complete, functional app architecture.
        2. If there are existing files, MODIFY them to satisfy the user request while maintaining consistency.
        3. The "previewCode" MUST be a single, standalone HTML string including Tailwind CSS via CDN and any necessary JavaScript. It must be a high-quality, fully interactive UI that demonstrates the app.
        4. The "files" array should contain:
           - index.html (the full preview code)
           - manifest.json (A PWA manifest for home screen installation)
           - sw.js (A basic service worker for offline support)
           - capacitor.config.json (Configuration for native mobile wrapping)
           - README.md (Instructions on how to build for Android/iOS)
        5. Always return the FULL current state of all files.
        6. The "thought" field should explain your technical decisions.
      `,
      config: {
        systemInstruction: "You are a world-class senior mobile systems engineer. You build robust, aesthetically pleasing, and native-ready web applications. Your output is always a valid JSON object matching the requested schema. Ensure the apps you build are PWA (Progressive Web App) compliant so they can be 'installed' on Android/iOS via the browser.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thought: { type: Type.STRING, description: "Your architectural reasoning." },
            concept: {
              type: Type.OBJECT,
              properties: {
                appName: { type: Type.STRING },
                tagLine: { type: Type.STRING },
                summary: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetAudience: { type: Type.STRING },
                colorPalette: {
                  type: Type.OBJECT,
                  properties: {
                    primary: { type: Type.STRING },
                    secondary: { type: Type.STRING },
                    accent: { type: Type.STRING }
                  },
                  required: ["primary", "secondary", "accent"]
                },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                uiStructure: {
                  type: Type.OBJECT,
                  properties: {
                    screens: { type: Type.ARRAY, items: { type: Type.STRING } },
                    mainNavigation: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["screens", "mainNavigation"]
                },
                files: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      content: { type: Type.STRING }
                    },
                    required: ["name", "content"]
                  }
                },
                previewCode: { type: Type.STRING }
              },
              required: ["appName", "tagLine", "summary", "features", "targetAudience", "colorPalette", "techStack", "uiStructure", "files", "previewCode"]
            }
          },
          required: ["thought", "concept"]
        }
      }
    });

    // FIX: Correctly access the .text property from GenerateContentResponse (do not use as a method).
    const text = response.text;
    if (!text) {
      throw new Error("EMPTY_RESPONSE");
    }
    
    try {
      const parsed = JSON.parse(text);
      return {
        concept: parsed.concept as AppConcept,
        thought: parsed.thought as string
      };
    } catch (e) {
      throw new Error("PARSE_ERROR");
    }
  } catch (err: any) {
    throw err;
  }
};
