'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, BarChart3, Loader2, LogOut, Settings, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            await supabase.auth.signOut()
            router.push('/login')
            router.refresh()
        } catch (error) {
            toast.error('Çıkış yapılırken hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const navItems = [
        { label: 'Sayfalarım', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Analiz', icon: BarChart3, href: '/analytics' },
        { label: 'Planım', icon: Sparkles, href: '/pricing' },
    ]

    const isEditor = pathname?.includes('/editor/')

    if (isEditor) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col">
                <main className="flex-1 flex flex-col h-full bg-white">
                    {children}
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-8">
                        <div className="font-bold text-xl tracking-tighter text-primary">Link Platform</div>
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className={`gap-2 h-9 px-4 ${pathname === item.href ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/settings">
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                            Çıkış
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto py-10 px-6">
                <div className="max-w-[1200px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
