"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultChart } from "@/app/components/ResultChart";

// Mock data - TO DO: Replace with smart contract data
const MOCK_RESULTS = {
    question: "Yapay zeka insanlığın geleceği için bir tehdit mi yoksa fırsat mı?",
    winner: {
        id: "2",
        name: "Veli",
        label: "B",
        reward: 0.03,
    },
    results: [
        { label: "A", votes: 1, playerName: "Ali", isWinner: false },
        { label: "B", votes: 2, playerName: "Veli", isWinner: true },
        { label: "C", votes: 0, playerName: "Ayşe", isWinner: false },
    ],
    totalVotes: 3,
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
};

// Confetti component
function Confetti() {
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

    useEffect(() => {
        const colors = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-3 h-3 animate-bounce"
                    style={{
                        left: `${particle.left}%`,
                        top: "-20px",
                        backgroundColor: particle.color,
                        animation: `fall 3s ease-in-out ${particle.delay}s forwards`,
                        borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}

export default function ResultPage() {
    const router = useRouter();
    const params = useParams();
    const lobbyId = params.id as string;

    const [showConfetti, setShowConfetti] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Show details after confetti
        const timer = setTimeout(() => {
            setShowDetails(true);
        }, 1000);

        // Hide confetti after a while
        const confettiTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(confettiTimer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-32">
            {/* Confetti */}
            {showConfetti && <Confetti />}

            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">Results</h1>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Game Complete
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Winner Announcement */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-300 p-6 text-center shadow-lg">
                    <div className="text-6xl mb-4 animate-bounce">🏆</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {MOCK_RESULTS.winner.name} Wins!
                    </h2>
                    <p className="text-yellow-700 mb-4">
                        Answer {MOCK_RESULTS.winner.label} received the most votes
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md">
                        <span className="text-3xl">💰</span>
                        <span className="text-2xl font-bold text-green-600">
                            +{MOCK_RESULTS.winner.reward} ETH
                        </span>
                    </div>
                </div>

                {/* Vote Distribution */}
                {showDetails && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 animate-fade-in">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            📊 Vote Distribution
                        </h3>
                        <ResultChart results={MOCK_RESULTS.results} totalVotes={MOCK_RESULTS.totalVotes} />
                    </div>
                )}

                {/* Question Recap */}
                {showDetails && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">❓</span>
                            <span className="text-sm font-medium text-gray-500">Question</span>
                        </div>
                        <p className="text-gray-800">{MOCK_RESULTS.question}</p>
                    </div>
                )}

                {/* Transaction Info */}
                {showDetails && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-4">
                        <h4 className="text-sm font-semibold text-purple-700 mb-2">⛓️ On-Chain Transaction</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                {MOCK_RESULTS.txHash}
                            </span>
                            <a
                                href={`https://basescan.org/tx/${MOCK_RESULTS.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 text-sm font-medium hover:underline"
                            >
                                View on Basescan →
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-white to-transparent space-y-3">
                <button
                    onClick={() => router.push("/lobbies")}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl active:scale-[0.98] transition-all"
                >
                    🎮 Play Again
                </button>
                <button
                    onClick={() => router.push("/")}
                    className="w-full py-3 rounded-xl font-semibold text-gray-600 border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                    Back to Home
                </button>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}
