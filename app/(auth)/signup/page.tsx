'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { ShimmerButton } from '@/components/ui/shimmer-button'

// Validation schema
const signupSchema = z.object({
    username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalı').regex(/^[a-zA-Z0-9_-]+$/, 'Sadece harf, rakam, tire ve alt çizgi kullanılabilir'),
    email: z.string().email('Geçersiz e-posta adresi'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

export default function SignupPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Signup initiation:', formData.email)
        setLoading(true)

        try {
            // Validate form
            const result = signupSchema.safeParse(formData)
            if (!result.success) {
                const message = result.error.issues[0].message
                toast.error(message)
                setLoading(false)
                return
            }

            // 1. Sign up user
            // options.data içinde gönderdiğimiz 'username', SQL trigger tarafından 'profiles' tablosuna yazılacak.
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        username: formData.username,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (authError) {
                console.error('Auth signup error:', authError)
                if (authError.message.includes('Database error')) {
                    toast.error('Veritabanı hatası: Bu kullanıcı adı veya e-posta zaten kullanımda olabilir.')
                } else {
                    toast.error(authError.message)
                }
                setLoading(false)
                return
            }

            if (authData.user) {
                console.log('Signup successful, awaiting confirmation')
                toast.success('Hesap oluşturuldu! Lütfen e-postanıza gönderilen onay linkine tıklayın.', {
                    duration: 6000,
                })
                router.push('/login')
            }
        } catch (err: any) {
            console.error('Signup exception:', err)
            toast.error('Beklenmedik bir hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Ambient Background Effect */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <Card className="relative border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl dark:bg-black/20 dark:border-white/10">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-primary"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" x2="19" y1="8" y2="14" />
                            <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Hesap Oluştur
                    </CardTitle>
                    <CardDescription className="text-base">
                        Saniyeler içinde sayfanızı oluşturun
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="grid gap-4">
                        <div className="grid gap-2">
                            <Input
                                id="username"
                                placeholder="kullanici_adi"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                className="bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <p className="text-[10px] text-muted-foreground px-1 italic">
                                Sadece harf, rakam ve alt çizgi.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="e-posta@örnek.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                id="password"
                                type="password"
                                placeholder="Şifre (en az 6 karakter)"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div className="mt-2">
                            <ShimmerButton
                                type="submit"
                                className="w-full text-center font-medium"
                                background="#000000"
                                shimmerColor="#ffffff"
                                shimmerSize="2px"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Hesap Oluşturuluyor...
                                    </div>
                                ) : (
                                    <span className="text-white dark:text-black">Kayıt Ol</span>
                                )}
                            </ShimmerButton>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Zaten bir hesabınız var mı?{' '}
                        <Link href="/login" className="text-primary hover:text-primary/80 font-medium hover:underline transition-all">
                            Giriş Yap
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

