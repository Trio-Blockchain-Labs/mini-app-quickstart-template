"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LobbyCard } from "@/app/components/LobbyCard";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

// Mock data - TO DO: Replace with smart contract data
const MOCK_LOBBIES = [
    {
        id: "42",
        stake: 0.001,
        playerCount: 2,
        maxPlayers: 3,
        createdAt: "5 min ago",
        isActive: true,
    },
    {
        id: "41",
        stake: 0.005,
        playerCount: 1,
        maxPlayers: 3,
        createdAt: "12 min ago",
        isActive: true,
    },
    {
        id: "40",
        stake: 0.01,
        playerCount: 3,
        maxPlayers: 3,
        createdAt: "20 min ago",
        isActive: true,
    },
    {
        id: "39",
        stake: 0.0005,
        playerCount: 2,
        maxPlayers: 4,
        createdAt: "35 min ago",
        isActive: true,
    },
];

type SortOption = "newest" | "stake-high" | "stake-low" | "available";

export default function LobbiesPage() {
    const router = useRouter();
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const sortedLobbies = [...MOCK_LOBBIES].sort((a, b) => {
        switch (sortBy) {
            case "stake-high":
                return b.stake - a.stake;
            case "stake-low":
                return a.stake - b.stake;
            case "available":
                return (b.maxPlayers - b.playerCount) - (a.maxPlayers - a.playerCount);
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => router.push("/")}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Game Lobbies</h1>
                    <button
                        onClick={() => router.push("/lobbies/create")}
                        className="p-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-lg shadow-purple-500/30"
                    >
                        <PlusIcon className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Sort Options */}
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
                    {[
                        { key: "newest", label: "Newest" },
                        { key: "stake-high", label: "Stake ↑" },
                        { key: "stake-low", label: "Stake ↓" },
                        { key: "available", label: "Available" },
                    ].map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setSortBy(option.key as SortOption)}
                            className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${sortBy === option.key
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }
              `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lobby Stats */}
            <div className="p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-purple-600">{MOCK_LOBBIES.length}</p>
                            <p className="text-xs text-gray-500">Active Lobbies</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {MOCK_LOBBIES.filter(l => l.playerCount < l.maxPlayers).length}
                            </p>
                            <p className="text-xs text-gray-500">Open Spots</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {MOCK_LOBBIES.reduce((acc, l) => acc + l.stake * l.maxPlayers, 0).toFixed(3)}
                            </p>
                            <p className="text-xs text-gray-500">Total ETH</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lobby List */}
            <div className="px-4 pb-8 space-y-4">
                {sortedLobbies.map((lobby) => (
                    <LobbyCard key={lobby.id} {...lobby} />
                ))}

                {sortedLobbies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-5xl mb-4">🏠</p>
                        <p className="text-gray-500">No active lobbies</p>
                        <button
                            onClick={() => router.push("/lobbies/create")}
                            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium"
                        >
                            Create First Lobby
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
