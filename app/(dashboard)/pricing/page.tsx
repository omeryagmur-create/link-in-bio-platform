import React from 'react'
import Link from 'next/link'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useTranslation } from '@/lib/i18n/provider'
import { Sparkles } from 'lucide-react'

export default function PricingPage() {
    const { t } = useTranslation()

    return (
        <div className="h-full flex items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-muted/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md max-w-2xl w-full mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full border border-primary/20 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        {t('dashboard.status_draft') === 'Draft' ? 'Early Access Bonus' :
                            t('dashboard.status_draft') === 'Черновик' ? 'Бонус раннего доступа' :
                                t('dashboard.status_draft') === 'Entwurf' ? 'Early Access Bonus' :
                                    'Erken Erişim Bonusu'}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent mb-6">
                        {t('pricing.title')}
                    </h1>

                    <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg mb-8 leading-relaxed">
                        {t('pricing.early_access_bonus')}
                    </p>

                    <Link href="/dashboard">
                        <ShimmerButton className="px-10 py-4 text-lg font-bold shadow-xl shadow-primary/20">
                            {t('pricing.cta')}
                        </ShimmerButton>
                    </Link>
                </div>
            </div>
        </div>
    )
}
