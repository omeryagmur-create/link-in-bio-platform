"use client";
import { BGPattern } from "@/components/ui/bg-pattern";

export default function DemoOne() {
    return (
        <div className="mx-auto max-w-4xl space-y-5 p-8">
            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 overflow-hidden bg-background">
                <BGPattern variant="grid" mask="fade-edges" className="opacity-40" />
                <h2 className="text-3xl font-bold">Grid Background</h2>
                <p className="text-muted-foreground font-mono">With (fade-edges) Mask</p>
            </div>
            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 overflow-hidden bg-background">
                <BGPattern variant="dots" mask="fade-center" className="opacity-40" />
                <h2 className="text-3xl font-bold">Dots Background</h2>
                <p className="text-muted-foreground font-mono">With (fade-center) Mask</p>
            </div>
            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 overflow-hidden bg-background">
                <BGPattern variant="diagonal-stripes" mask="fade-y" className="opacity-40" />
                <h2 className="text-3xl font-bold">Diagonal Stripes</h2>
                <p className="text-muted-foreground font-mono">With (fade-y) Mask</p>
            </div>
            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 overflow-hidden bg-background">
                <BGPattern variant="horizontal-lines" mask="fade-right" className="opacity-40" />
                <h2 className="text-3xl font-bold">Horizontal Lines</h2>
                <p className="text-muted-foreground font-mono">With (fade-right) Mask</p>
            </div>
            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 overflow-hidden bg-background">
                <BGPattern variant="vertical-lines" mask="fade-bottom" className="opacity-40" />
                <h2 className="text-3xl font-bold">Vertical Lines</h2>
                <p className="text-muted-foreground font-mono">With (fade-bottom) Mask</p>
            </div>
            <div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 overflow-hidden bg-background">
                <BGPattern variant="checkerboard" mask="fade-top" className="opacity-40" />
                <h2 className="text-3xl font-bold">Checkerboard Background</h2>
                <p className="text-muted-foreground font-mono">With (fade-top) Mask</p>
            </div>
        </div>
    );
}
