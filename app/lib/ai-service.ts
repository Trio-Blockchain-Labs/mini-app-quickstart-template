/**
 * AI Service - Groq Integration
 * Generates persona-based AI responses using Groq's fast inference API
 */

import { PersonaTraits } from "./persona-traits";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant"; // Fast and free tier friendly

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Build a system prompt from persona traits
 */
export function buildPersonaPrompt(persona: PersonaTraits): string {
  return `You are a ${persona.ageRange} year old ${persona.profession}. 

Your communication style is ${persona.tone.toLowerCase()}.
Your reasoning approach is ${persona.reasoningStyle.toLowerCase()}.
Your core value that guides your decisions is ${persona.coreValue.toLowerCase()}.

Respond to questions authentically as this persona. Keep your answers:
- Concise (2-3 sentences max)
- True to your persona's background and values
- Natural and conversational

Never mention that you are an AI or that you are playing a role.`;
}

/**
 * Generate an AI response based on persona traits and a question
 */
export async function generatePersonaAnswer(
  persona: PersonaTraits,
  question: string,
  apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.GROQ_API_KEY;
  
  if (!key) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const systemPrompt = buildPersonaPrompt(persona);
  
  const messages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: question },
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 256,
        temperature: 0.8, // Slight creativity for varied responses
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || "No response generated";
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
}

/**
 * Generate multiple persona answers in parallel (for game rounds)
 */
export async function generateMultipleAnswers(
  personas: { id: string; persona: PersonaTraits }[],
  question: string,
  apiKey?: string
): Promise<{ id: string; answer: string }[]> {
  const results = await Promise.all(
    personas.map(async ({ id, persona }) => {
      try {
        const answer = await generatePersonaAnswer(persona, question, apiKey);
        return { id, answer };
      } catch (error) {
        console.error(`Failed to generate answer for ${id}:`, error);
        return { id, answer: "[Error generating response]" };
      }
    })
  );
  
  return results;
}
