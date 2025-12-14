"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check for saved preference or system preference
        const saved = localStorage.getItem("theme");
        if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newValue = !isDark;
        setIsDark(newValue);
        localStorage.setItem("theme", newValue ? "dark" : "light");
        document.documentElement.classList.toggle("dark", newValue);
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
            )}
        </button>
    );
}
