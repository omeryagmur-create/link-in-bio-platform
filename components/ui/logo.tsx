"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    iconClassName?: string
    textClassName?: string
    showText?: boolean
}

export function Logo({ className, iconClassName, textClassName, showText = true }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
            <div className={cn(
                "h-10 w-10 border-2 border-primary rounded-full flex items-center justify-center group-hover:bg-primary transition-all duration-300",
                iconClassName
            )}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300"
                >
                    <path d="M16.5 8.5c2.2 0 4 1.8 4 3.5s-1.8 3.5-4 3.5c-1.5 0-3-1.5-4.5-3.5s-3-3.5-4.5-3.5c-2.2 0-4 1.8-4 3.5s1.8 3.5 4 3.5" />
                </svg>
            </div>
            {showText && (
                <span className={cn("text-xl font-black tracking-tight text-foreground", textClassName)}>
                    Infinite<span className="text-primary">Link</span>
                </span>
            )}
        </div>
    )
}
