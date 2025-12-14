/**
 * Questions API Route
 * GET: Return a random question from the question pool
 */

import { NextResponse } from "next/server";

// Curated question pool for persona battles
// Questions should be open-ended and allow different personas to shine
const QUESTION_POOL = [
  // Life & Philosophy
  "What's the most important lesson you've learned in your career?",
  "How do you handle failure or setbacks?",
  "What does success mean to you?",
  "If you could change one thing about the world, what would it be?",
  
  // Problem Solving
  "How would you solve the problem of climate change?",
  "What's your approach when facing a difficult decision?",
  "How do you prioritize when everything seems urgent?",
  
  // Creativity & Innovation
  "What invention do you think the world needs most right now?",
  "How do you stay creative in your work?",
  "What's an unconventional idea you believe in?",
  
  // Relationships & Society
  "What makes a great leader?",
  "How do you build trust with others?",
  "What's the key to effective communication?",
  
  // Future & Vision
  "Where do you see technology in 10 years?",
  "What skill will be most valuable in the future?",
  "How should society prepare for AI advancement?",
  
  // Personal Growth
  "What habit has had the biggest positive impact on your life?",
  "How do you stay motivated when things get tough?",
  "What advice would you give to your younger self?",
  
  // Ethics & Values
  "Is it ever okay to lie?",
  "How do you balance personal goals with helping others?",
  "What responsibility do successful people have to society?",
];

export async function GET() {
  // Select a random question
  const randomIndex = Math.floor(Math.random() * QUESTION_POOL.length);
  const question = QUESTION_POOL[randomIndex];

  return NextResponse.json({
    success: true,
    question,
    totalQuestions: QUESTION_POOL.length,
  });
}

// Also export the pool for potential use in other parts of the app
export { QUESTION_POOL };
