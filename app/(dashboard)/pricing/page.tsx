'use client'

import React from 'react'
import Link from 'next/link'
import { ShimmerButton } from '@/components/ui/shimmer-button'

export default function PricingPage() {
    return (
        <div className="h-full flex items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-muted/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md max-w-2xl w-full mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent mb-6">
                        Şimdilik her şey ücretsiz.
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg mb-8 leading-relaxed">
                        Erken erişim sürecinde tüm premium özellikleri hiçbir ücret ödemeden sınırsızca kullanabilirsiniz.
                    </p>
                    <Link href="/dashboard">
                        <ShimmerButton className="px-10 py-4 text-lg font-bold shadow-xl shadow-primary/20">
                            Keşfetmeye Başla
                        </ShimmerButton>
                    </Link>
                </div>
            </div>
        </div>
    )
}
