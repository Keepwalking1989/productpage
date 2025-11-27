"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex items-center gap-2 p-2 bg-background border border-input rounded-md">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md transition-colors ${theme === "light" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                title="Light Mode"
            >
                <Sun className="h-4 w-4" />
                <span className="sr-only">Light Mode</span>
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md transition-colors ${theme === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                title="Dark Mode"
            >
                <Moon className="h-4 w-4" />
                <span className="sr-only">Dark Mode</span>
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-md transition-colors ${theme === "system" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                title="System Theme"
            >
                <span className="text-xs font-bold">Auto</span>
                <span className="sr-only">System Theme</span>
            </button>
        </div>
    )
}
