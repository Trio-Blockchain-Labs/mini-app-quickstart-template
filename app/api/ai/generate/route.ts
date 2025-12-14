/**
 * AI Generate API Route
 * POST: Generate AI response based on persona traits and question
 */

import { NextRequest, NextResponse } from "next/server";
import { generatePersonaAnswer } from "@/app/lib/ai-service";
import { PersonaTraits, isPersonaComplete } from "@/app/lib/persona-traits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { persona, question } = body as {
      persona: Partial<PersonaTraits>;
      question: string;
    };

    // Validate inputs
    if (!persona || !isPersonaComplete(persona)) {
      return NextResponse.json(
        { error: "Invalid or incomplete persona traits" },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Generate AI response
    const answer = await generatePersonaAnswer(persona, question.trim());

    return NextResponse.json({
      success: true,
      answer,
      persona: {
        profession: persona.profession,
        tone: persona.tone,
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    
    const message = error instanceof Error ? error.message : "Unknown error";
    
    // Check for API key issues
    if (message.includes("GROQ_API_KEY")) {
      return NextResponse.json(
        { error: "AI service not configured. Please set GROQ_API_KEY." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response", details: message },
      { status: 500 }
    );
  }
}
