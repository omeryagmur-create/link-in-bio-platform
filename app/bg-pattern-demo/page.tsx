"use client";

import React from 'react';
import { BGPattern } from "@/components/ui/bg-pattern";

export default function BGPatternDemo() {
    return (
        <div className="mx-auto max-w-4xl space-y-12 p-8 py-20 bg-background text-foreground min-h-screen">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter">Background Patterns</h1>
                <p className="text-muted-foreground">Modern background patterns with customizable masking effects.</p>
            </div>

            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/20 overflow-hidden shadow-2xl">
                <BGPattern variant="grid" mask="fade-edges" fill="rgba(13, 89, 242, 0.2)" />
                <h2 className="text-3xl font-bold">Grid Background</h2>
                <p className="text-muted-foreground font-mono">With (fade-edges) Mask</p>
            </div>

            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/20 overflow-hidden shadow-2xl">
                <BGPattern variant="dots" mask="fade-center" fill="rgba(204, 255, 0, 0.3)" />
                <h2 className="text-3xl font-bold">Dots Background</h2>
                <p className="text-muted-foreground font-mono">With (fade-center) Mask</p>
            </div>

            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/20 overflow-hidden shadow-2xl">
                <BGPattern variant="diagonal-stripes" mask="fade-y" fill="rgba(13, 89, 242, 0.15)" />
                <h2 className="text-3xl font-bold">Diagonal Stripes</h2>
                <p className="text-muted-foreground font-mono">With (fade-y) Mask</p>
            </div>

            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/20 overflow-hidden shadow-2xl">
                <BGPattern variant="horizontal-lines" mask="fade-right" fill="rgba(255, 255, 255, 0.05)" />
                <h2 className="text-3xl font-bold">Horizontal Lines</h2>
                <p className="text-muted-foreground font-mono">With (fade-right) Mask</p>
            </div>

            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/20 overflow-hidden shadow-2xl">
                <BGPattern variant="vertical-lines" mask="fade-bottom" fill="rgba(13, 89, 242, 0.1)" />
                <h2 className="text-3xl font-bold">Vertical Lines</h2>
                <p className="text-muted-foreground font-mono">With (fade-bottom) Mask</p>
            </div>

            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/20 overflow-hidden shadow-2xl">
                <BGPattern variant="checkerboard" mask="fade-top" fill="rgba(204, 255, 0, 0.1)" />
                <h2 className="text-3xl font-bold">Checkerboard Background</h2>
                <p className="text-muted-foreground font-mono">With (fade-top) Mask</p>
            </div>
        </div>
    );
}
