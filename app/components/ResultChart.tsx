"use client";

interface ResultChartProps {
    results: {
        label: string;
        votes: number;
        playerName: string;
        isWinner: boolean;
    }[];
    totalVotes: number;
}

export function ResultChart({ results, totalVotes }: ResultChartProps) {
    const sortedResults = [...results].sort((a, b) => b.votes - a.votes);
    const maxVotes = Math.max(...results.map((r) => r.votes));

    return (
        <div className="space-y-4">
            {sortedResults.map((result, index) => {
                const percentage = totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0;

                return (
                    <div key={result.label} className="relative">
                        {/* Winner Badge */}
                        {result.isWinner && index === 0 && (
                            <div className="absolute -top-2 -right-2 z-10">
                                <span className="text-2xl">👑</span>
                            </div>
                        )}

                        <div
                            className={`
                p-4 rounded-2xl border-2 transition-all
                ${result.isWinner
                                    ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 shadow-lg"
                                    : "bg-white border-gray-200"
                                }
              `}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-bold
                      ${result.isWinner
                                                ? "bg-yellow-400 text-white"
                                                : "bg-gray-100 text-gray-600"
                                            }
                    `}
                                    >
                                        {result.label}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-800">{result.playerName}</p>
                                        {result.isWinner && (
                                            <p className="text-xs text-yellow-600 font-medium">🏆 Winner!</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-800">{result.votes}</p>
                                    <p className="text-xs text-gray-500">votes</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`
                    h-full rounded-full transition-all duration-1000 ease-out
                    ${result.isWinner
                                            ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                                            : "bg-gradient-to-r from-purple-400 to-blue-400"
                                        }
                  `}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            {/* Percentage */}
                            <p className="text-right text-sm text-gray-500 mt-1">
                                {percentage.toFixed(0)}%
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
