/**
 * Persona Traits System
 * Defines constrained trait categories for AI persona creation
 */

export const PERSONA_TRAITS = {
  profession: [
    "Engineer",
    "Doctor", 
    "Artist",
    "Teacher",
    "Entrepreneur",
    "Scientist",
    "Writer",
    "Lawyer",
  ],
  ageRange: ["18-25", "26-35", "36-50", "50+"],
  tone: [
    "Professional",
    "Friendly",
    "Academic",
    "Humorous",
    "Direct",
    "Empathetic",
  ],
  reasoningStyle: [
    "Analytical",
    "Creative",
    "Practical",
    "Theoretical",
    "Intuitive",
  ],
  coreValues: [
    "Honesty",
    "Innovation",
    "Tradition",
    "Freedom",
    "Community",
    "Individualism",
  ],
} as const;

// Type definitions
export type Profession = (typeof PERSONA_TRAITS.profession)[number];
export type AgeRange = (typeof PERSONA_TRAITS.ageRange)[number];
export type Tone = (typeof PERSONA_TRAITS.tone)[number];
export type ReasoningStyle = (typeof PERSONA_TRAITS.reasoningStyle)[number];
export type CoreValue = (typeof PERSONA_TRAITS.coreValues)[number];

export interface PersonaTraits {
  profession: Profession;
  ageRange: AgeRange;
  tone: Tone;
  reasoningStyle: ReasoningStyle;
  coreValue: CoreValue;
}

// Trait category labels for UI
export const TRAIT_LABELS: Record<keyof typeof PERSONA_TRAITS, string> = {
  profession: "Profession",
  ageRange: "Age Range",
  tone: "Communication Tone",
  reasoningStyle: "Reasoning Style",
  coreValues: "Core Value",
};

// Trait descriptions for tooltips/help text
export const TRAIT_DESCRIPTIONS: Record<keyof typeof PERSONA_TRAITS, string> = {
  profession: "The professional background that shapes your persona's expertise",
  ageRange: "Age range influencing life experience and perspective",
  tone: "How your persona communicates with others",
  reasoningStyle: "The approach your persona uses to solve problems",
  coreValues: "The fundamental value that guides your persona's decisions",
};

// Helper to create an empty persona (for initial state)
export function createEmptyPersona(): Partial<PersonaTraits> {
  return {
    profession: undefined,
    ageRange: undefined,
    tone: undefined,
    reasoningStyle: undefined,
    coreValue: undefined,
  };
}

// Helper to check if persona is complete
export function isPersonaComplete(persona: Partial<PersonaTraits>): persona is PersonaTraits {
  return !!(
    persona.profession &&
    persona.ageRange &&
    persona.tone &&
    persona.reasoningStyle &&
    persona.coreValue
  );
}

// Generate a hash of persona traits (for on-chain storage)
export function hashPersonaTraits(persona: PersonaTraits): string {
  const traitString = `${persona.profession}-${persona.ageRange}-${persona.tone}-${persona.reasoningStyle}-${persona.coreValue}`;
  // Simple hash for demo - in production use keccak256
  return btoa(traitString);
}
