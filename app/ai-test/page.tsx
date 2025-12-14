"use client";

import { PersonaBuilder } from "@/app/components/PersonaBuilder";
import { PersonaTraits } from "@/app/lib/persona-traits";
import { useState } from "react";

export default function AITestPage() {
  const [persona, setPersona] = useState<PersonaTraits | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchRandomQuestion = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (data.success) {
        setQuestion(data.question);
      }
    } catch (err) {
      console.error("Failed to fetch question:", err);
    }
  };

  const generateAnswer = async () => {
    if (!persona || !question) return;
    
    setLoading(true);
    setError("");
    setAnswer("");
    
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, question }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Failed to generate response");
      }
    } catch (err) {
      setError("Network error - check console");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🤖 AI Test Page</h1>
          <p className="text-gray-600">Test persona-based AI generation</p>
        </div>

        {!persona ? (
          <PersonaBuilder onComplete={setPersona} />
        ) : (
          <div className="space-y-6">
            {/* Persona Summary */}
            <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-2">Your Persona</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  👔 {persona.profession}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  📅 {persona.ageRange}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  💬 {persona.tone}
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  🧠 {persona.reasoningStyle}
                </span>
                <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  ⭐ {persona.coreValue}
                </span>
              </div>
              <button
                onClick={() => setPersona(null)}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Change Persona
              </button>
            </div>

            {/* Question Section */}
            <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700">Question</h3>
                <button
                  onClick={fetchRandomQuestion}
                  className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  🎲 Random Question
                </button>
              </div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter a question or click Random Question..."
                className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateAnswer}
              disabled={!question || loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                question && !loading
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "⏳ Generating..." : "✨ Generate AI Response"}
            </button>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                ❌ {error}
              </div>
            )}

            {/* Answer Display */}
            {answer && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <h3 className="font-semibold text-purple-700 mb-2">AI Response</h3>
                <p className="text-gray-700 leading-relaxed">{answer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
