"use client";

import { useState, useCallback } from "react";
import {
  PERSONA_TRAITS,
  TRAIT_LABELS,
  TRAIT_DESCRIPTIONS,
  PersonaTraits,
  isPersonaComplete,
  createEmptyPersona,
} from "@/app/lib/persona-traits";

interface PersonaBuilderProps {
  onComplete?: (persona: PersonaTraits) => void;
  disabled?: boolean;
}

type TraitCategory = keyof typeof PERSONA_TRAITS;

export function PersonaBuilder({ onComplete, disabled = false }: PersonaBuilderProps) {
  const [persona, setPersona] = useState<Partial<PersonaTraits>>(createEmptyPersona());
  const [activeCategory, setActiveCategory] = useState<TraitCategory>("profession");

  const categories: TraitCategory[] = [
    "profession",
    "ageRange",
    "tone",
    "reasoningStyle",
    "coreValues",
  ];

  const handleTraitSelect = useCallback(
    (category: TraitCategory, value: string) => {
      const key = category === "coreValues" ? "coreValue" : category;
      setPersona((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Auto-advance to next category
      const currentIndex = categories.indexOf(category);
      if (currentIndex < categories.length - 1) {
        setActiveCategory(categories[currentIndex + 1]);
      }
    },
    [categories]
  );

  const handleComplete = useCallback(() => {
    if (isPersonaComplete(persona) && onComplete) {
      onComplete(persona);
    }
  }, [persona, onComplete]);

  const getSelectedValue = (category: TraitCategory): string | undefined => {
    const key = category === "coreValues" ? "coreValue" : category;
    return persona[key as keyof PersonaTraits];
  };

  const completedCount = Object.values(persona).filter(Boolean).length;
  const progressPercent = (completedCount / 5) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Build Your AI Persona
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Select traits to define how your AI will respond
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{completedCount}/5 traits selected</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isSelected = getSelectedValue(category);
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              disabled={disabled}
              className={`
                px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all
                ${isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : isSelected
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {isSelected && "✓ "}
              {TRAIT_LABELS[category]}
            </button>
          );
        })}
      </div>

      {/* Trait Options */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800">{TRAIT_LABELS[activeCategory]}</h3>
          <p className="text-xs text-gray-500">{TRAIT_DESCRIPTIONS[activeCategory]}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PERSONA_TRAITS[activeCategory].map((trait) => {
            const isSelected = getSelectedValue(activeCategory) === trait;
            return (
              <button
                key={trait}
                onClick={() => handleTraitSelect(activeCategory, trait)}
                disabled={disabled}
                className={`
                  p-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}
                `}
              >
                {trait}
              </button>
            );
          })}
        </div>
      </div>

      {/* Persona Preview */}
      {completedCount > 0 && (
        <div className="mt-5 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
          <h4 className="text-xs font-semibold text-purple-700 mb-2">YOUR PERSONA</h4>
          <div className="flex flex-wrap gap-2">
            {persona.profession && (
              <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                👔 {persona.profession}
              </span>
            )}
            {persona.ageRange && (
              <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                📅 {persona.ageRange}
              </span>
            )}
            {persona.tone && (
              <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                💬 {persona.tone}
              </span>
            )}
            {persona.reasoningStyle && (
              <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                🧠 {persona.reasoningStyle}
              </span>
            )}
            {persona.coreValue && (
              <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                ⭐ {persona.coreValue}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        disabled={!isPersonaComplete(persona) || disabled}
        className={`
          w-full mt-5 py-4 rounded-xl font-semibold text-lg transition-all duration-200
          ${isPersonaComplete(persona) && !disabled
            ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 active:scale-[0.98]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isPersonaComplete(persona) ? "🚀 Lock In Persona" : "Complete all traits to continue"}
      </button>
    </div>
  );
}
