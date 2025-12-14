"use client";

import { PersonaBuilder } from "@/app/components/PersonaBuilder";
import { PersonaTraits } from "@/app/lib/persona-traits";
import { useState } from "react";

export default function PersonaTestPage() {
  const [completedPersona, setCompletedPersona] = useState<PersonaTraits | null>(null);

  const handlePersonaComplete = (persona: PersonaTraits) => {
    setCompletedPersona(persona);
    console.log("Persona completed:", persona);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* App Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            ⚔️ AI Persona Battle
          </h1>
          <p className="text-gray-600">
            Create your AI persona and compete!
          </p>
        </div>

        {!completedPersona ? (
          <PersonaBuilder onComplete={handlePersonaComplete} />
        ) : (
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Persona Created!
            </h2>
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(completedPersona, null, 2)}
              </pre>
            </div>
            <button
              onClick={() => setCompletedPersona(null)}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Create Another Persona
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
