"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PersonaBuilder } from "@/app/components/PersonaBuilder";
import { PersonaTraits } from "@/app/lib/persona-traits";
import { PlayerAvatar } from "@/app/components/PlayerAvatar";

// Mock data - TO DO: Replace with real data
const MOCK_PLAYERS = [
    { id: "1", name: "Ali", isReady: false, isCurrentUser: true },
    { id: "2", name: "Veli", isReady: true, isCurrentUser: false },
    { id: "3", name: "Ayşe", isReady: false, isCurrentUser: false },
];

export default function PersonaSelectionPage() {
    const router = useRouter();
    const params = useParams();
    const lobbyId = params.id as string;

    const [players, setPlayers] = useState(MOCK_PLAYERS);
    const [isLocked, setIsLocked] = useState(false);
    const [myPersona, setMyPersona] = useState<PersonaTraits | null>(null);

    const readyCount = players.filter((p) => p.isReady).length;
    const allReady = readyCount === players.length;

    // Auto-advance when all players are ready
    useEffect(() => {
        if (allReady) {
            const timer = setTimeout(() => {
                router.push(`/lobby/${lobbyId}/question`);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [allReady, router, lobbyId]);

    const handlePersonaComplete = (persona: PersonaTraits) => {
        setMyPersona(persona);
        setIsLocked(true);
        // TO DO: Send persona to backend
        // Update current player as ready
        setPlayers((prev) =>
            prev.map((p) => (p.isCurrentUser ? { ...p, isReady: true } : p))
        );
        console.log("Persona locked:", persona);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-8">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold text-gray-800">Build Your Persona</h1>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            Lobby #{lobbyId}
                        </span>
                    </div>

                    {/* Player Status Bar */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                        <div className="flex -space-x-2">
                            {players.map((player) => (
                                <div
                                    key={player.id}
                                    className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${player.isReady
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {player.isReady ? "✓" : player.name[0]}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            <span className="font-semibold text-green-600">{readyCount}</span>/{players.length} ready
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* All Ready State */}
                {allReady && (
                    <div className="mb-6 p-6 bg-green-50 rounded-2xl border border-green-200 text-center">
                        <div className="text-5xl mb-3 animate-bounce">🎉</div>
                        <h2 className="text-xl font-bold text-green-700">All Personas Locked!</h2>
                        <p className="text-green-600">Preparing questions...</p>
                    </div>
                )}

                {/* PersonaBuilder or Locked State */}
                {isLocked ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-3">🔒</div>
                            <h2 className="text-xl font-bold text-gray-800">Persona Locked!</h2>
                            <p className="text-gray-500">Waiting for other players...</p>
                        </div>

                        {/* Persona Summary */}
                        {myPersona && (
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-purple-700 mb-3">YOUR AI PERSONA</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                        👔 {myPersona.profession}
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                        📅 {myPersona.ageRange}
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                        💬 {myPersona.tone}
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                        🧠 {myPersona.reasoningStyle}
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                        ⭐ {myPersona.coreValue}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Waiting for others */}
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">Player Status</h4>
                            <div className="space-y-2">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className={`flex items-center justify-between p-3 rounded-xl ${player.isReady ? "bg-green-50" : "bg-gray-50"
                                            }`}
                                    >
                                        <span className="font-medium text-gray-800">
                                            {player.name} {player.isCurrentUser && "(You)"}
                                        </span>
                                        {player.isReady ? (
                                            <span className="text-green-600 text-sm font-medium">✓ Ready</span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">Selecting...</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <PersonaBuilder onComplete={handlePersonaComplete} />
                )}
            </div>
        </div>
    );
}
