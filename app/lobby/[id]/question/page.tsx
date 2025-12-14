"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Mock data - TO DO: Replace with API call
const MOCK_QUESTION = "Yapay zeka insanlığın geleceği için bir tehdit mi yoksa fırsat mı?";

const MOCK_PERSONA = {
    profession: "Software Engineer",
    ageRange: "30-40",
    tone: "Analytical",
    reasoningStyle: "Logical",
    coreValue: "Innovation",
};

export default function QuestionPage() {
    const router = useRouter();
    const params = useParams();
    const lobbyId = params.id as string;

    const [phase, setPhase] = useState<"loading" | "question" | "generating" | "answer">("loading");
    const [aiResponse, setAiResponse] = useState<string>("");
    const [isReady, setIsReady] = useState(false);

    // Simulate loading question
    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase("question");
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerateAnswer = async () => {
        setPhase("generating");

        // TO DO: Call POST /api/ai-response with persona and question
        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Mock AI response
        const mockResponse = `Yapay zeka, doğru yönetildiğinde insanlığın en büyük fırsatlarından biri olabilir. Bir yazılım mühendisi olarak, teknolojinin nasıl işlediğini anlıyorum ve bu da beni iyimser yapıyor.

Evet, riskler var - iş kayıpları, gizlilik endişeleri, önyargılı algoritmalar. Ancak tarih boyunca her büyük teknolojik devrim benzer korkular yarattı. Kritik olan, bu teknolojiyi etik ve sorumlu bir şekilde geliştirmektir.

İnovasyon değerime sadık kalarak söyleyebilirim ki: yapay zeka, sağlık, eğitim, iklim değişikliği gibi en zorlu sorunlarımızı çözmemize yardımcı olabilir. Tehdit değil, ustaca kullanılması gereken güçlü bir araç.`;

        setAiResponse(mockResponse);
        setPhase("answer");
    };

    const handleReady = () => {
        setIsReady(true);
        // TO DO: Notify backend that player is ready
        setTimeout(() => {
            router.push(`/lobby/${lobbyId}/vote`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">AI Response</h1>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        Lobby #{lobbyId}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Loading State */}
                {phase === "loading" && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
                        <p className="text-gray-600">Loading question...</p>
                    </div>
                )}

                {/* Question Card */}
                {phase !== "loading" && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">❓</span>
                            <h2 className="font-semibold text-gray-700">Today&apos;s Question</h2>
                        </div>
                        <p className="text-xl font-medium text-gray-800 leading-relaxed">
                            {MOCK_QUESTION}
                        </p>
                    </div>
                )}

                {/* Your Persona Reminder */}
                {phase === "question" && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-4">
                        <h3 className="text-sm font-semibold text-purple-700 mb-2">YOUR AI PERSONA</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600">
                                👔 {MOCK_PERSONA.profession}
                            </span>
                            <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600">
                                💬 {MOCK_PERSONA.tone}
                            </span>
                            <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600">
                                🧠 {MOCK_PERSONA.reasoningStyle}
                            </span>
                        </div>
                    </div>
                )}

                {/* Generate Button */}
                {phase === "question" && (
                    <button
                        onClick={handleGenerateAnswer}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl active:scale-[0.98] transition-all"
                    >
                        🤖 Generate AI Response
                    </button>
                )}

                {/* Generating State */}
                {phase === "generating" && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                        <div className="text-6xl mb-4 animate-pulse">🤖</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">AI is thinking...</h3>
                        <p className="text-gray-500 mb-4">Generating response based on your persona</p>
                        <div className="flex justify-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}

                {/* AI Response */}
                {phase === "answer" && (
                    <>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🤖</span>
                                <h3 className="font-semibold text-gray-700">Your AI&apos;s Answer</h3>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {aiResponse}
                                </p>
                            </div>
                        </div>

                        {/* Ready Button */}
                        <button
                            onClick={handleReady}
                            disabled={isReady}
                            className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all
                ${isReady
                                    ? "bg-green-500 text-white"
                                    : "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl active:scale-[0.98]"
                                }
              `}
                        >
                            {isReady ? "✓ Ready! Waiting for others..." : "✓ I'm Ready to Vote"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
