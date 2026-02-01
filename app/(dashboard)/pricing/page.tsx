'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, Sparkles, Zap } from 'lucide-react'
import { toast } from 'sonner'

const plans = [
    {
        name: 'Ücretsiz',
        price: '0',
        description: 'Bireysel kullanım için temel özellikler.',
        features: [
            '1 Adet Yayınlanmış Sayfa',
            'Klasik Liste Görünümü',
            'Son 7 Günlük Analiz',
            'Standart Temalar',
            'Link-in-bio Platform Logosu'
        ],
        buttonText: 'Mevcut Plan',
        highlight: false,
        tier: 'free'
    },
    {
        name: 'Pro',
        price: '149',
        description: 'İçerik üreticileri ve markalar için tam güç.',
        features: [
            'Sınırsız Sayfa Oluşturma',
            'Özel Bento (Special) Layout',
            'Gelişmiş Analizler (90 Gün)',
            'Özel Yazı Tipleri ve Renkler',
            'Platform Logosunu Kaldırma',
            'Öncelikli Destek'
        ],
        buttonText: 'Pro\'ya Geç',
        highlight: true,
        tier: 'pro'
    }
]

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null)

    const handleUpgrade = async (tier: string) => {
        if (tier === 'free') return

        setLoading(tier)
        try {
            // Mock upgrade process
            await new Promise(resolve => setTimeout(resolve, 1500))

            // In real app, this would redirect to Stripe Checkout
            // For now, let's just show a success message or handle it as a future task
            toast.success('Pro plan seçildi! (Ödeme sistemi yakında eklenecek)')
        } catch (error) {
            toast.error('Bir hata oluştu')
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="space-y-12 py-4">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Sana uygun planı seç
                </h1>
                <p className="text-xl text-muted-foreground">
                    Potansiyelini serbest bırak. İstediğin zaman iptal edebilirsin.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
                {plans.map((plan) => (
                    <Card
                        key={plan.tier}
                        className={`relative flex flex-col overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${plan.highlight ? 'border-primary ring-4 ring-primary/5 scale-105' : 'border-border'
                            }`}
                    >
                        {plan.highlight && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                En Popüler
                            </div>
                        )}

                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                            <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold tracking-tight">₺{plan.price}</span>
                                <span className="text-muted-foreground font-medium">/ay</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 pt-6 flex-grow">
                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="p-8 pt-0">
                            <Button
                                className={`w-full h-12 text-base font-bold transition-all ${plan.highlight
                                        ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                    }`}
                                onClick={() => handleUpgrade(plan.tier)}
                                disabled={loading !== null || plan.tier === 'free'}
                            >
                                {loading === plan.tier ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    plan.buttonText
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Support Message */}
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Kurumsal bir çözüm mü arıyorsunuz?</h3>
                <p className="text-sm text-muted-foreground mb-6">Özel entegrasyonlar ve çoklu kullanıcı yönetimi için bizimle iletişime geçin.</p>
                <Button variant="outline" className="rounded-full px-8">Satışla Görüş</Button>
            </div>
        </div>
    )
}
