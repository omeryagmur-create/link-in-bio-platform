'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, User, Mail, Shield, CheckCircle2, Globe, ExternalLink, Info } from 'lucide-react'

export default function SettingsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [primaryPage, setPrimaryPage] = useState<any>(null)
    const [customDomain, setCustomDomain] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(data)

                // Fetch primary page
                const { data: pageData } = await supabase
                    .from('pages')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('is_primary', true)
                    .maybeSingle()

                if (pageData) {
                    setPrimaryPage(pageData)
                    setCustomDomain(pageData.custom_domain || '')
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [supabase])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: profile.display_name,
                    bio: profile.bio,
                    username: profile.username
                })
                .eq('id', user.id)

            if (error) throw error
            toast.success('Profil başarıyla kaydedildi')
        } catch (error: any) {
            toast.error(error.message || 'Bir hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    const handleSaveDomain = async (e: React.FormEvent) => {
        e.preventDefault()
        if (profile?.subscription_tier !== 'pro') {
            toast.error('Özel alan adı sadece Pro üyeler içindir.')
            return
        }

        setSaving(true)
        try {
            const { error } = await supabase
                .from('pages')
                .update({ custom_domain: customDomain })
                .eq('id', primaryPage.id)

            if (error) throw error
            toast.success('Özel alan adı kaydedildi')
        } catch (error: any) {
            toast.error(error.message || 'Bir hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hesap Ayarları</h1>
                <p className="text-muted-foreground">Profilinizi ve hesap tercihlerinizi yönetin.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Settings */}
                <Card className="border-none shadow-sm bg-white">
                    <form onSubmit={handleSaveProfile}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Genel Profil
                            </CardTitle>
                            <CardDescription>Halk açık sayfanızda görünen bilgileri güncelleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Kullanıcı Adı</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">link.bio/</span>
                                        <Input
                                            id="username"
                                            value={profile?.username || ''}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase() })}
                                            className="pl-[68px]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Görünen İsim</Label>
                                    <Input
                                        id="displayName"
                                        value={profile?.display_name || ''}
                                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                                        placeholder="Adınız Soyadınız"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input
                                    id="bio"
                                    value={profile?.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Kendinizden bahsedin..."
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 px-6 py-4 rounded-b-xl border-t">
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Değişiklikleri Kaydet
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Custom Domain Settings */}
                <Card className={`border-none shadow-sm ${profile?.subscription_tier === 'pro' ? 'bg-white' : 'bg-slate-50 opacity-80'}`}>
                    <form onSubmit={handleSaveDomain}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-primary" />
                                    Özel Alan Adı (Domain)
                                </div>
                                {profile?.subscription_tier !== 'pro' && (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">PRO</span>
                                )}
                            </CardTitle>
                            <CardDescription>Sayfanızı kendi domain adresinizde yayınlayın (örn: www.isminiz.com).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {profile?.subscription_tier !== 'pro' ? (
                                <div className="p-6 text-center border-2 border-dashed rounded-2xl bg-white/50">
                                    <p className="text-sm text-slate-600 mb-4">Özel alan adı bağlamak için Pro hesaba ihtiyacınız var.</p>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href="/pricing">Planları Karşılaştır</a>
                                    </Button>
                                </div>
                            ) : !primaryPage ? (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                                    <Info className="w-5 h-5 text-amber-500 mt-0.5" />
                                    <div className="text-sm text-amber-800">
                                        Henüz bir ana sayfanız bulunmuyor. Dashboard'dan bir sayfayı "Ana Sayfa" olarak ayarlayın.
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="customDomain">Alan Adınız</Label>
                                        <Input
                                            id="customDomain"
                                            value={customDomain}
                                            onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                                            placeholder="isminiz.com"
                                        />
                                    </div>

                                    {customDomain && (
                                        <div className="p-4 rounded-xl bg-slate-50 border space-y-3">
                                            <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                <ExternalLink className="w-3 h-3" />
                                                DNS Ayarları
                                            </p>
                                            <p className="text-xs text-slate-600">Domaininizi bağlamak için aşağıdaki kayıtları DNS sağlayıcınıza (Godaddy, Namecheap, etc.) ekleyin:</p>
                                            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                                                <div className="text-slate-400">Type</div>
                                                <div className="text-slate-400">Name</div>
                                                <div className="text-slate-400">Value</div>

                                                <div className="font-bold">A</div>
                                                <div>@</div>
                                                <div className="font-bold">76.76.21.21</div>

                                                <div className="font-bold">CNAME</div>
                                                <div>www</div>
                                                <div className="font-bold">cname.vercel-dns.com</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        {profile?.subscription_tier === 'pro' && primaryPage && (
                            <CardFooter className="bg-slate-50/50 px-6 py-4 rounded-b-xl border-t">
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Alan Adını Kaydet
                                </Button>
                            </CardFooter>
                        )}
                    </form>
                </Card>

                {/* Account Security (Read Only for now) */}
                <Card className="border-none shadow-sm bg-white/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Güvenlik & Hesap
                        </CardTitle>
                        <CardDescription>E-posta ve giriş yöntemleriniz.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-white">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">E-posta Adresi</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>Değiştir</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Status */}
                <Card className="border-none shadow-sm bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                Plan Durumu
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${profile?.subscription_tier === 'pro' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                {profile?.subscription_tier?.toUpperCase() || 'FREE'}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600">
                            {profile?.subscription_tier === 'pro'
                                ? 'Tüm Pro özelliklerin keyfini çıkarıyorsunuz. Bento Grid, sınırsız sayfa ve gelişmiş analizler aktif.'
                                : 'Şu an Ücretsiz planı kullanıyorsunuz. Pro\'ya geçerek kısıtlamaları kaldırabilirsiniz.'}
                        </p>
                    </CardContent>
                    <CardFooter>
                        {profile?.subscription_tier !== 'pro' && (
                            <Button variant="default" className="w-full sm:w-auto" asChild>
                                <a href="/pricing">Pro'ya Yükselt</a>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
