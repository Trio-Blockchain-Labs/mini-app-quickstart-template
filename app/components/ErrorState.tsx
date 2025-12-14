"use client";

import { useRouter } from "next/navigation";

interface ErrorStateProps {
    title?: string;
    message?: string;
    emoji?: string;
    showRetry?: boolean;
    showHome?: boolean;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    message = "Please try again later",
    emoji = "😵",
    showRetry = true,
    showHome = true,
    onRetry,
}: ErrorStateProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">{message}</p>
            <div className="flex gap-3">
                {showRetry && (
                    <button
                        onClick={onRetry || (() => window.location.reload())}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        Try Again
                    </button>
                )}
                {showHome && (
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Go Home
                    </button>
                )}
            </div>
        </div>
    );
}

// Specific error variants
export function NotFoundError() {
    return (
        <ErrorState
            title="Page Not Found"
            message="The page you're looking for doesn't exist"
            emoji="🔍"
            showRetry={false}
        />
    );
}

export function NetworkError() {
    return (
        <ErrorState
            title="Network Error"
            message="Please check your internet connection"
            emoji="📡"
        />
    );
}

export function WalletError() {
    return (
        <ErrorState
            title="Wallet Not Connected"
            message="Please connect your wallet to continue"
            emoji="👛"
            showRetry={false}
        />
    );
}

export function LobbyFullError() {
    const router = useRouter();
    return (
        <ErrorState
            title="Lobby Full"
            message="This lobby is already at maximum capacity"
            emoji="🚫"
            showRetry={false}
            onRetry={() => router.push("/lobbies")}
        />
    );
}
