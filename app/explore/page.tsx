
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/ui/logo'

export const dynamic = 'force-dynamic'

async function getPublishedProfiles() {
    const supabase = await createClient()

    // First get published pages
    const { data: publishedPages } = await supabase
        .from('pages')
        .select('user_id')
        .eq('is_published', true)

    // Get unique user IDs
    const userIds = [...new Set(publishedPages?.map(p => p.user_id) || [])]

    if (userIds.length === 0) {
        return []
    }

    // Fetch profiles for these users
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, avatar_url, tags, created_at')
        .in('id', userIds)
        .not('username', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100)

    return profiles || []
}

export default async function ExplorePage() {
    const profiles = await getPublishedProfiles()

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-border/40 bg-background/60">
                <div className="flex items-center gap-4">
                    <Link href="/" className="hover:opacity-70 transition-opacity">
                        <Logo />
                    </Link>
                    <div className="h-6 w-[1px] bg-border mx-2 hidden md:block"></div>
                    <span className="font-bold text-sm tracking-widest uppercase hidden md:block">Explore</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/login">
                        <button className="text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                            Create Your Page
                        </button>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                        Community Spotlight
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover the best pages created by our community members.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {profiles.map((profile: any) => (
                        <Link
                            key={profile.id}
                            href={`/${profile.username}`}
                            target="_blank"
                            className="group relative bg-muted/30 border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-2xl hover:-translate-y-1 block"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-background shadow-lg">
                                        {profile.avatar_url ? (
                                            <Image
                                                src={profile.avatar_url}
                                                alt={profile.username}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                                {profile.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1 truncate">{profile.display_name || profile.username}</h3>
                                <p className="text-sm text-primary font-medium mb-3">@{profile.username}</p>

                                <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">
                                    {profile.bio || 'Welcome to my page!'}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {profile.tags?.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-background/50 rounded-md border border-border/50">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="h-2 w-full bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
