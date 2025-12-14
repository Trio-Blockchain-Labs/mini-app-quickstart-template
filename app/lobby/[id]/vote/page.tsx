"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AnswerCard } from "@/app/components/AnswerCard";

// Mock data - TO DO: Replace with real answers from backend
const MOCK_QUESTION = "Yapay zeka insanlığın geleceği için bir tehdit mi yoksa fırsat mı?";

const MOCK_ANSWERS = [
    {
        id: "A",
        label: "A",
        content: "Yapay zeka, doğru yönetildiğinde insanlığın en büyük fırsatlarından biri olabilir. Teknolojinin nasıl işlediğini anlıyorum ve bu da beni iyimser yapıyor. Kritik olan, bu teknolojiyi etik ve sorumlu bir şekilde geliştirmektir.",
        isOwn: true,
    },
    {
        id: "B",
        label: "B",
        content: "Bir sağlık profesyoneli olarak, yapay zekanın tanı ve tedavi süreçlerinde devrim yaratabileceğini görüyorum. Empati ve insan dokunuşu yerine geçemez, ama doktorlara güçlü bir yardımcı olabilir. Fırsat olarak görüyorum.",
        isOwn: false,
    },
    {
        id: "C",
        label: "C",
        content: "Sanat ve yaratıcılık perspektifinden bakıldığında, yapay zeka hem tehdit hem de fırsat. İnsan duygusu ve deneyiminin yerini alamaz, ama yeni yaratım biçimleri keşfetmemizi sağlayabilir. Dengeyi bulmak önemli.",
        isOwn: false,
    },
];

export default function VotePage() {
    const router = useRouter();
    const params = useParams();
    const lobbyId = params.id as string;

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = async () => {
        if (!selectedAnswer) return;

        setIsVoting(true);
        // TO DO: Call vote smart contract (ON-CHAIN)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setHasVoted(true);
        setIsVoting(false);

        // Navigate to results after short delay
        setTimeout(() => {
            router.push(`/lobby/${lobbyId}/result`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-32">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">Vote</h1>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        Lobby #{lobbyId}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Question Reminder */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">❓</span>
                        <span className="text-sm font-medium text-gray-500">Question</span>
                    </div>
                    <p className="text-gray-800 font-medium">{MOCK_QUESTION}</p>
                </div>

                {/* Voting Instructions */}
                {!hasVoted && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-4">
                        <p className="text-sm text-purple-700">
                            🗳️ <strong>Vote for the best answer!</strong> You cannot vote for your own answer.
                        </p>
                    </div>
                )}

                {/* Voted Confirmation */}
                {hasVoted && (
                    <div className="bg-green-50 rounded-2xl border border-green-200 p-6 text-center">
                        <div className="text-5xl mb-3">✅</div>
                        <h2 className="text-xl font-bold text-green-700">Vote Submitted!</h2>
                        <p className="text-green-600 text-sm">On-chain transaction confirmed</p>
                        <p className="text-gray-500 text-sm mt-2">Loading results...</p>
                    </div>
                )}

                {/* Answer Cards */}
                <div className="space-y-3">
                    {MOCK_ANSWERS.map((answer) => (
                        <AnswerCard
                            key={answer.id}
                            id={answer.id}
                            label={answer.label}
                            content={answer.content}
                            isOwn={answer.isOwn}
                            isSelected={selectedAnswer === answer.id}
                            isDisabled={hasVoted || isVoting}
                            onClick={() => !answer.isOwn && setSelectedAnswer(answer.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Vote Button */}
            {!hasVoted && (
                <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-white to-transparent">
                    <button
                        onClick={handleVote}
                        disabled={!selectedAnswer || isVoting}
                        className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
              ${!selectedAnswer
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : isVoting
                                    ? "bg-purple-400 text-white cursor-wait"
                                    : "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl active:scale-[0.98]"
                            }
            `}
                    >
                        {isVoting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Submitting Vote...
                            </span>
                        ) : selectedAnswer ? (
                            `🗳️ Vote for Answer ${selectedAnswer}`
                        ) : (
                            "Select an answer to vote"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
