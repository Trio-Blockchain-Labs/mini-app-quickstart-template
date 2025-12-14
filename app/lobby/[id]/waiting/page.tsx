"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, ShareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { PlayerAvatar } from "@/app/components/PlayerAvatar";

// Mock data - TO DO: Replace with smart contract data
const MOCK_LOBBY = {
    id: "42",
    stake: 0.001,
    maxPlayers: 3,
    players: [
        { id: "1", name: "Ali", isReady: true, isCurrentUser: true },
        { id: "2", name: "Veli", isReady: false, isCurrentUser: false },
    ],
};

export default function WaitingRoomPage() {
    const router = useRouter();
    const params = useParams();
    const lobbyId = params.id as string;

    const [lobby, setLobby] = useState(MOCK_LOBBY);
    const [copied, setCopied] = useState(false);

    const playerCount = lobby.players.length;
    const isLobbyFull = playerCount >= lobby.maxPlayers;
    const allReady = lobby.players.every((p) => p.isReady);
    const totalPool = lobby.stake * lobby.maxPlayers;

    // Auto-advance when lobby is full and all ready
    useEffect(() => {
        if (isLobbyFull && allReady) {
            const timer = setTimeout(() => {
                router.push(`/lobby/${lobbyId}/persona`);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLobbyFull, allReady, router, lobbyId]);

    const handleShare = async () => {
        const url = `${window.location.origin}/lobby/${lobbyId}/waiting`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            alert(`Share this link: ${url}`);
        }
    };

    const handleLeave = () => {
        // TO DO: Implement leaveLobby smart contract call
        router.push("/lobbies");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={handleLeave}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Lobby #{lobbyId}</h1>
                    <button
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ShareIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Copied Toast */}
                {copied && (
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-pulse">
                        Link copied! ✓
                    </div>
                )}

                {/* Lobby Info Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-purple-600">{lobby.stake}</p>
                            <p className="text-xs text-gray-500">Stake (ETH)</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {playerCount}/{lobby.maxPlayers}
                            </p>
                            <p className="text-xs text-gray-500">Players</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{totalPool.toFixed(4)}</p>
                            <p className="text-xs text-gray-500">Total Pool</p>
                        </div>
                    </div>
                </div>

                {/* Waiting Animation */}
                <div className="text-center py-6">
                    {isLobbyFull && allReady ? (
                        <>
                            <div className="text-5xl mb-4 animate-bounce">🚀</div>
                            <h2 className="text-xl font-bold text-green-600">All Players Ready!</h2>
                            <p className="text-gray-500">Starting game...</p>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center gap-2 mb-4">
                                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Waiting for Players</h2>
                            <p className="text-gray-500">
                                {lobby.maxPlayers - playerCount} more player(s) needed
                            </p>
                        </>
                    )}
                </div>

                {/* Players Grid */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Players</h3>
                    <div className="grid grid-cols-3 gap-6 justify-items-center">
                        {/* Existing Players */}
                        {lobby.players.map((player) => (
                            <PlayerAvatar
                                key={player.id}
                                name={player.name}
                                isReady={player.isReady}
                                isCurrentUser={player.isCurrentUser}
                                size="md"
                            />
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: lobby.maxPlayers - playerCount }).map((_, i) => (
                            <div key={`empty-${i}`} className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-400 text-xl">?</span>
                                </div>
                                <span className="text-sm text-gray-400">Waiting...</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Share Link Card */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-5">
                    <h3 className="font-semibold text-purple-700 mb-3">📤 Invite Friends</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/lobby/${lobbyId}/waiting`}
                            readOnly
                            className="flex-1 px-4 py-3 bg-white rounded-xl border border-purple-200 text-sm text-gray-600 truncate"
                        />
                        <button
                            onClick={handleShare}
                            className="px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Leave Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-white to-transparent">
                <button
                    onClick={handleLeave}
                    className="w-full py-4 rounded-xl font-semibold text-red-500 border-2 border-red-200 bg-white hover:bg-red-50 transition-colors"
                >
                    Leave Lobby (Refund Stake)
                </button>
            </div>
        </div>
    );
}
