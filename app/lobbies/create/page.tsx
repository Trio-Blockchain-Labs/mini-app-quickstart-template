"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function CreateLobbyPage() {
    const router = useRouter();
    const [stake, setStake] = useState(0.001);
    const [maxPlayers, setMaxPlayers] = useState(3);
    const [isCreating, setIsCreating] = useState(false);

    // Stake presets
    const stakePresets = [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1];

    const totalPool = stake * maxPlayers;
    const potentialWin = stake * (maxPlayers - 1);

    const handleCreate = async () => {
        setIsCreating(true);
        // TO DO: Implement createLobby smart contract call
        // Simulating transaction delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/lobby/new/waiting");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => router.push("/lobbies")}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Create Lobby</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Stake Amount Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        💰 Stake Amount
                    </h2>

                    {/* Current Value Display */}
                    <div className="text-center mb-4">
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                            {stake} ETH
                        </p>
                        <p className="text-sm text-gray-500 mt-1">per player</p>
                    </div>

                    {/* Slider */}
                    <input
                        type="range"
                        min={0}
                        max={stakePresets.length - 1}
                        value={stakePresets.indexOf(stake) !== -1 ? stakePresets.indexOf(stake) : 2}
                        onChange={(e) => setStake(stakePresets[parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />

                    {/* Preset Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {stakePresets.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setStake(preset)}
                                className={`
                  px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${stake === preset
                                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }
                `}
                            >
                                {preset} ETH
                            </button>
                        ))}
                    </div>
                </div>

                {/* Player Count Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        👥 Number of Players
                    </h2>

                    <div className="flex justify-center gap-3">
                        {[2, 3, 4, 5].map((count) => (
                            <button
                                key={count}
                                onClick={() => setMaxPlayers(count)}
                                className={`
                  w-14 h-14 rounded-2xl text-lg font-bold transition-all duration-200
                  ${maxPlayers === count
                                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 scale-110"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }
                `}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-5">
                    <h2 className="font-semibold text-purple-700 mb-4">📊 Summary</h2>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Your Stake</span>
                            <span className="font-semibold text-gray-800">{stake} ETH</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Players</span>
                            <span className="font-semibold text-gray-800">{maxPlayers}</span>
                        </div>
                        <div className="h-px bg-purple-200 my-2" />
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Pool</span>
                            <span className="font-bold text-purple-600">{totalPool.toFixed(4)} ETH</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Potential Win</span>
                            <span className="font-bold text-green-600">+{potentialWin.toFixed(4)} ETH</span>
                        </div>
                    </div>
                </div>

                {/* Gas Fee Estimate - TO DO */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">⛽ Estimated Gas Fee</span>
                        <span className="text-gray-400 text-sm">~0.0001 ETH</span>
                    </div>
                </div>
            </div>

            {/* Create Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-white to-transparent">
                <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
            ${isCreating
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl active:scale-[0.98]"
                        }
          `}
                >
                    {isCreating ? (
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
                            Creating...
                        </span>
                    ) : (
                        `🚀 Create Lobby (${stake} ETH)`
                    )}
                </button>
            </div>
        </div>
    );
}
