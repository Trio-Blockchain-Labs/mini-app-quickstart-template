"use client";

interface AnswerCardProps {
    id: string;
    label: string;
    content: string;
    isSelected?: boolean;
    isDisabled?: boolean;
    isOwn?: boolean;
    voteCount?: number;
    showVotes?: boolean;
    onClick?: () => void;
}

export function AnswerCard({
    id,
    label,
    content,
    isSelected = false,
    isDisabled = false,
    isOwn = false,
    voteCount = 0,
    showVotes = false,
    onClick,
}: AnswerCardProps) {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled || isOwn}
            className={`
        w-full text-left p-5 rounded-2xl border-2 transition-all duration-200
        ${isOwn
                    ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
                    : isSelected
                        ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-400 shadow-lg shadow-purple-500/20"
                        : isDisabled
                            ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                            : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer"
                }
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span
                        className={`
              w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
              ${isSelected
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }
            `}
                    >
                        {label}
                    </span>
                    <span className="text-sm text-gray-500">
                        {isOwn ? "Your Answer" : `Answer ${label}`}
                    </span>
                </div>

                {/* Selection Indicator */}
                <div
                    className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${isSelected
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-300"
                        }
          `}
                >
                    {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
            </div>

            {/* Content */}
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                {content}
            </p>

            {/* Vote Count (shown in results) */}
            {showVotes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Votes</span>
                        <span className="font-bold text-purple-600">{voteCount}</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${Math.min(voteCount * 33.33, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Own Answer Badge */}
            {isOwn && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">You cannot vote for your own answer</span>
                </div>
            )}
        </button>
    );
}
