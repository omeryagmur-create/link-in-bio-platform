'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Search, Share2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface SeoSettingsProps {
    pageId: string
    subscriptionTier: string
}

export function SeoSettings({ pageId, subscriptionTier }: SeoSettingsProps) {
    const isPro = subscriptionTier === 'pro'
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [seoData, setSeoData] = useState({
        seo_title: '',
        seo_description: '',
        title: ''
    })

    useEffect(() => {
        const fetchSeoData = async () => {
            const { data, error } = await supabase
                .from('pages')
                .select('title, seo_title, seo_description')
                .eq('id', pageId)
                .single()

            if (data) {
                setSeoData({
                    title: data.title || '',
                    seo_title: data.seo_title || '',
                    seo_description: data.seo_description || ''
                })
            }
            setLoading(false)
        }

        fetchSeoData()
    }, [pageId, supabase])

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase
                .from('pages')
                .update({
                    seo_title: seoData.seo_title,
                    seo_description: seoData.seo_description
                })
                .eq('id', pageId)

            if (error) throw error
            toast.success('SEO ayarları kaydedildi')
        } catch (error: any) {
            toast.error(error.message || 'Bir hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    SEO & Paylaşım
                </h2>
                {isPro && (
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Kaydet
                    </Button>
                )}
            </div>

            {!isPro ? (
                <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-100 p-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                        <Search className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">Premium SEO Özellikleri</h3>
                        <p className="text-slate-600 max-w-sm mx-auto">
                            Arama motoru optimizasyonu ve sosyal medya paylaşım ayarlarını özelleştirerek daha fazla kişiye ulaşın.
                        </p>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-2 text-left bg-white/50 p-6 rounded-2xl w-full max-w-xs">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Özel Meta Başlıkları (Title)
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Meta Açıklamaları (Description)
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Sosyal Medya Paylaşım Görünümü
                        </li>
                    </ul>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" asChild>
                        <a href="/pricing">Pro'ya Geç ve Aktive Et</a>
                    </Button>
                </Card>
            ) : (
                <>
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium">Arama Motoru Önizlemesi</CardTitle>
                            <CardDescription>Sayfanızın Google aramalarında nasıl görüneceğini kontrol edin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl border bg-slate-50 space-y-1">
                                <div className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer truncate">
                                    {seoData.seo_title || seoData.title || 'Sayfa Başlığı'}
                                </div>
                                <div className="text-[#006621] text-sm">
                                    link.bio/slug
                                </div>
                                <div className="text-[#545454] text-sm line-clamp-2">
                                    {seoData.seo_description || 'Sayfanız için bir açıklama girerek arama sonuçlarında daha iyi görünmesini sağlayın.'}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="seo_title">SEO Başlığı</Label>
                                    <Input
                                        id="seo_title"
                                        value={seoData.seo_title}
                                        onChange={(e) => setSeoData({ ...seoData, seo_title: e.target.value })}
                                        placeholder="Arama motoru başlığı (opsiyonel)"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Boş bırakılırsa normal sayfa başlığı kullanılır.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="seo_description">SEO Açıklaması</Label>
                                    <Textarea
                                        id="seo_description"
                                        value={seoData.seo_description}
                                        onChange={(e) => setSeoData({ ...seoData, seo_description: e.target.value })}
                                        placeholder="Sayfa hakkında kısa bir açıklama..."
                                        className="resize-none h-24"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Share2 className="w-4 h-4 text-blue-500" />
                                Sosyal Medya Önizlemesi
                            </CardTitle>
                            <CardDescription>WhatsApp, Facebook ve Twitter paylaşımlarında görünüm.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-xl border overflow-hidden bg-slate-50">
                                <div className="aspect-video bg-slate-200 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                                    <Info className="w-8 h-8 text-slate-400 relative z-10" />
                                </div>
                                <div className="p-3 bg-white space-y-1">
                                    <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">link.bio</div>
                                    <div className="text-sm font-bold truncate">{seoData.seo_title || seoData.title || 'Sayfa Başlığı'}</div>
                                    <div className="text-xs text-slate-500 line-clamp-1">{seoData.seo_description || 'Sayfa açıklaması...'}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
