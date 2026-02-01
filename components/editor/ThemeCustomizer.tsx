'use client'

import { ThemeConfig, themePresets, popularFonts, getButtonStyle } from '@/lib/theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Layout, Grid, Lock } from 'lucide-react'
import Link from 'next/link'

interface ThemeCustomizerProps {
    theme: ThemeConfig
    onChange: (theme: ThemeConfig) => void
    layoutType: 'classic' | 'special'
    onLayoutChange: (layout: 'classic' | 'special') => void
    subscriptionTier: string
}

export function ThemeCustomizer({ theme, onChange, layoutType, onLayoutChange, subscriptionTier }: ThemeCustomizerProps) {
    const isPro = subscriptionTier === 'pro'

    const handleChange = (key: keyof ThemeConfig, value: string) => {
        onChange({ ...theme, [key]: value })
    }

    const applyPreset = (presetTheme: any) => {
        onChange({ ...theme, ...presetTheme })
    }

    return (
        <div className="space-y-8">
            {/* Sayfa Düzeni Bölümü */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Sayfa Düzeni</Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onLayoutChange('classic')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${layoutType === 'classic'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-slate-100 hover:border-slate-200 text-slate-500'
                            }`}
                    >
                        <Layout className="w-6 h-6" />
                        <span className="text-sm font-bold">Klasik Liste</span>
                    </button>

                    <div className="relative group">
                        <button
                            onClick={() => onLayoutChange('special')}
                            className={`w-full flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${layoutType === 'special'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                }`}
                        >
                            <Grid className="w-6 h-6" />
                            <span className="text-sm font-bold flex items-center gap-1">
                                Bento Grid
                                {!isPro && <Lock className="w-3 h-3 text-amber-500" />}
                            </span>
                        </button>

                        {!isPro && (
                            <Link
                                href="/pricing"
                                className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full shadow-lg opacity-100 scale-100 group-hover:scale-110 transition-transform"
                                title="Pro Gerektirir"
                            >
                                <Sparkles className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Temalar Bölümü */}
            <div>
                <Label className="text-base font-semibold mb-3 block">Hazır Temalar</Label>
                <div className="grid grid-cols-2 gap-2">
                    {themePresets.map((preset) => (
                        <div
                            key={preset.name}
                            className={`cursor-pointer border-2 rounded-xl p-3 hover:border-primary transition-all ${
                                // Preseti kontrol etmek zor ama basitleştirelim
                                'border-slate-100'
                                }`}
                            onClick={() => applyPreset(preset.theme)}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className="w-5 h-5 rounded-full border shadow-sm"
                                    style={{ backgroundColor: preset.theme.backgroundColor }}
                                />
                                <span className="text-sm font-semibold">{preset.name}</span>
                            </div>
                            <div
                                className="h-8 w-full rounded-lg text-[10px] font-bold flex items-center justify-center shadow-sm"
                                style={{
                                    backgroundColor: preset.theme.buttonColor,
                                    color: preset.theme.buttonTextColor,
                                    borderRadius: getButtonStyle(preset.theme.buttonStyle)
                                }}
                            >
                                Örnek
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-4">
                <Label className="text-base font-semibold">Renkler</Label>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bgColor" className="text-xs text-slate-500 font-bold uppercase tracking-wider">Arka Plan</Label>
                        <div className="relative group">
                            <Input
                                id="bgColor"
                                type="color"
                                value={theme.backgroundColor || ''}
                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                className="h-10 w-full p-1 cursor-pointer rounded-lg border-2 border-slate-100 group-hover:border-slate-200 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="textColor" className="text-xs text-slate-500 font-bold uppercase tracking-wider">Metin</Label>
                        <Input
                            id="textColor"
                            type="color"
                            value={theme.textColor || ''}
                            onChange={(e) => handleChange('textColor', e.target.value)}
                            className="h-10 w-full p-1 cursor-pointer rounded-lg border-2 border-slate-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="btnColor" className="text-xs text-slate-500 font-bold uppercase tracking-wider">Buton</Label>
                        <Input
                            id="btnColor"
                            type="color"
                            value={theme.buttonColor || ''}
                            onChange={(e) => handleChange('buttonColor', e.target.value)}
                            className="h-10 w-full p-1 cursor-pointer rounded-lg border-2 border-slate-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="btnTextColor" className="text-xs text-slate-500 font-bold uppercase tracking-wider">Buton Metni</Label>
                        <Input
                            id="btnTextColor"
                            type="color"
                            value={theme.buttonTextColor || ''}
                            onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                            className="h-10 w-full p-1 cursor-pointer rounded-lg border-2 border-slate-100"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <Label className="text-base font-semibold">Tipografi & Stil</Label>

                <div className="space-y-3">
                    <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Buton Şekli</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={theme.buttonStyle === 'sharp' ? 'default' : 'outline'}
                            className="rounded-none w-full h-10 font-bold"
                            onClick={() => handleChange('buttonStyle', 'sharp')}
                        >
                            Köşeli
                        </Button>
                        <Button
                            variant={theme.buttonStyle === 'rounded' ? 'default' : 'outline'}
                            className="rounded-md w-full h-10 font-bold"
                            onClick={() => handleChange('buttonStyle', 'rounded')}
                        >
                            Yumuşak
                        </Button>
                        <Button
                            variant={theme.buttonStyle === 'soft' ? 'default' : 'outline'}
                            className="rounded-xl w-full h-10 font-bold"
                            onClick={() => handleChange('buttonStyle', 'soft')}
                        >
                            Yuvarlak
                        </Button>
                        <Button
                            variant={theme.buttonStyle === 'pill' ? 'default' : 'outline'}
                            className="rounded-full w-full h-10 font-bold"
                            onClick={() => handleChange('buttonStyle', 'pill')}
                        >
                            Oval
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Yazı Tipi</Label>
                    <Select value={theme.font} onValueChange={(val) => handleChange('font', val)}>
                        <SelectTrigger className="h-11 rounded-xl border-2 border-slate-100">
                            <SelectValue placeholder="Font Seçin" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] rounded-xl border-2">
                            {popularFonts.map((font) => (
                                <SelectItem key={font.name} value={font.name} className="py-3">
                                    <span style={{ fontFamily: font.family }} className="text-base">{font.name}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
