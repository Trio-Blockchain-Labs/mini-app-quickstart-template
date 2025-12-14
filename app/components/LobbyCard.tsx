"use client";

import { useRouter } from "next/navigation";

interface LobbyCardProps {
    id: string;
    stake: number;
    playerCount: number;
    maxPlayers: number;
    createdAt: string;
    isActive?: boolean;
}

export function LobbyCard({
    id,
    stake,
    playerCount,
    maxPlayers,
    createdAt,
    isActive = true,
}: LobbyCardProps) {
    const router = useRouter();
    const isFull = playerCount >= maxPlayers;

    const handleJoin = () => {
        // TO DO: Implement joinLobby smart contract call
        router.push(`/lobby/${id}/waiting`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Lobi #{id}</h3>
                <span
                    className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-300"
                        }`}
                />
            </div>

            {/* Info Grid */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                        💰 Stake
                    </span>
                    <span className="font-semibold text-gray-800">{stake} ETH</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                        👥 Players
                    </span>
                    <span className="font-semibold text-gray-800">
                        {playerCount}/{maxPlayers}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                        ⏱️ Created
                    </span>
                    <span className="text-gray-600 text-sm">{createdAt}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                        🏆 Total Pool
                    </span>
                    <span className="font-bold text-purple-600">
                        {(stake * maxPlayers).toFixed(4)} ETH
                    </span>
                </div>
            </div>

            {/* Player Progress Bar */}
            <div className="mb-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${isFull
                                ? "bg-gray-400"
                                : "bg-gradient-to-r from-purple-500 to-blue-500"
                            }`}
                        style={{ width: `${(playerCount / maxPlayers) * 100}%` }}
                    />
                </div>
            </div>

            {/* Join Button */}
            <button
                onClick={handleJoin}
                disabled={isFull}
                className={`
          w-full py-3 rounded-xl font-semibold transition-all duration-200
          ${isFull
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl active:scale-[0.98]"
                    }
        `}
            >
                {isFull ? "Full" : "Join →"}
            </button>
        </div>
    );
}
