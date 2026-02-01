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
import { ShimmerButton } from '@/components/ui/shimmer-button'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Login attempt with:', email)
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.error('Login error:', error)
                toast.error(error.message)
                return
            }

            toast.success('Başarıyla giriş yapıldı')
            router.push('/dashboard')
            router.refresh()
        } catch {
            toast.error('Giriş yapılırken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Ambient Background Effect */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

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
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" x2="3" y1="12" y2="12" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Hoşgeldiniz
                    </CardTitle>
                    <CardDescription className="text-base">
                        Link-in-Bio platformuna giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Button variant="outline" className="w-full relative overflow-hidden group hover:border-primary/50 transition-colors" onClick={handleGoogleLogin}>
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Google ile Devam Et
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground backdrop-blur-sm bg-white/50 dark:bg-black/50 rounded-full">
                                    veya e-posta ile
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="grid gap-4">
                            <div className="grid gap-2">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Şifre"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Giriş Yapılıyor...
                                        </div>
                                    ) : (
                                        <span className="text-white dark:text-black">Giriş Yap</span>
                                    )}
                                </ShimmerButton>
                            </div>
                        </form>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Hesabınız yok mu?{' '}
                        <Link href="/signup" className="text-primary hover:text-primary/80 font-medium hover:underline transition-all">
                            Kayıt Ol
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
