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

import { useTranslation } from '@/lib/i18n/provider'

export default function LoginPage() {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            toast.success(t('auth.login_success'))
            router.push('/dashboard')
            router.refresh()
        } catch {
            toast.error(t('auth.generic_error'))
        } finally {
            setLoading(false)
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
                        {t('common.welcome')}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {t('auth.login_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                placeholder={t('common.password')}
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
                                        {t('auth.logging_in')}
                                    </div>
                                ) : (
                                    <span className="text-white dark:text-black">{t('common.login')}</span>
                                )}
                            </ShimmerButton>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        {t('auth.no_account')}{' '}
                        <Link href="/signup" className="text-primary hover:text-primary/80 font-medium hover:underline transition-all">
                            {t('common.signup')}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div >
    )
}
