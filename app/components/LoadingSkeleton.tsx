"use client";

interface LoadingSkeletonProps {
    type?: "card" | "text" | "avatar" | "button";
    count?: number;
}

export function LoadingSkeleton({ type = "card", count = 1 }: LoadingSkeletonProps) {
    const items = Array.from({ length: count }, (_, i) => i);

    const renderSkeleton = (key: number) => {
        switch (type) {
            case "avatar":
                return (
                    <div key={key} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                );
            case "text":
                return (
                    <div key={key} className="space-y-2 animate-pulse">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                );
            case "button":
                return (
                    <div
                        key={key}
                        className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                    />
                );
            case "card":
            default:
                return (
                    <div
                        key={key}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-pulse"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-4" />
                        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
                    </div>
                );
        }
    };

    return <>{items.map(renderSkeleton)}</>;
}
