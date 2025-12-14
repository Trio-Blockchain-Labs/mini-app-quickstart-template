"use client";

import { Avatar, Name } from "@coinbase/onchainkit/identity";

interface PlayerAvatarProps {
    address?: `0x${string}`;
    name?: string;
    isReady?: boolean;
    isCurrentUser?: boolean;
    size?: "sm" | "md" | "lg";
}

export function PlayerAvatar({
    address,
    name,
    isReady = false,
    isCurrentUser = false,
    size = "md",
}: PlayerAvatarProps) {
    const sizeClasses = {
        sm: "w-10 h-10",
        md: "w-14 h-14",
        lg: "w-20 h-20",
    };

    const textSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                {/* Avatar Container */}
                <div
                    className={`
            ${sizeClasses[size]} rounded-full overflow-hidden
            ${isCurrentUser
                            ? "ring-4 ring-purple-500 ring-offset-2"
                            : "ring-2 ring-gray-200"
                        }
            ${isReady ? "ring-green-500" : ""}
          `}
                >
                    {address ? (
                        <Avatar address={address} className="w-full h-full" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                            {name?.[0]?.toUpperCase() || "?"}
                        </div>
                    )}
                </div>

                {/* Ready Indicator */}
                {isReady && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <span className="text-white text-xs">✓</span>
                    </div>
                )}

                {/* Current User Indicator */}
                {isCurrentUser && !isReady && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <span className="text-white text-xs">👤</span>
                    </div>
                )}
            </div>

            {/* Name */}
            <div className="text-center">
                {address ? (
                    <Name address={address} className={`font-medium text-gray-800 ${textSizes[size]}`} />
                ) : (
                    <span className={`font-medium text-gray-800 ${textSizes[size]}`}>
                        {name || "Unknown"}
                    </span>
                )}
                {isCurrentUser && (
                    <span className="block text-xs text-purple-600">(You)</span>
                )}
            </div>
        </div>
    );
}
