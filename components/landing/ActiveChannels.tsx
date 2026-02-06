'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Marquee from '@/components/ui/marquee'
import { useTranslation } from '@/lib/i18n/provider'

interface Channel {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    bio: string | null
    tags: string[]
}

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className="group relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4
            border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]
            dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]
            transition-all duration-300 hover:scale-[1.02] mx-4"
        >
            <div className="flex flex-row items-center gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-black/10 dark:border-white/10">
                    <Image
                        className="object-cover"
                        fill
                        alt=""
                        src={img}
                    />
                </div>
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white truncate max-w-[120px]">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-black/40 dark:text-white/40 truncate max-w-[120px]">@{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm line-clamp-2 min-h-[40px] text-muted-foreground">
                {body}
            </blockquote>
        </figure>
    );
};

export function ActiveChannels() {
    const { t } = useTranslation()
    const [channels, setChannels] = useState<Channel[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                console.log('Fetching active channels...')
                const res = await fetch('/api/public/active-channels?limit=20')
                const data = await res.json()
                console.log('Active channels response:', data)
                if (data.profiles) {
                    console.log('Number of profiles:', data.profiles.length)
                    setChannels(data.profiles)
                } else {
                    console.log('No profiles field in response')
                }
            } catch (error) {
                console.error('Failed to fetch channels', error)
            } finally {
                setLoading(false)
            }
        }
        fetchChannels()
    }, [])

    if (loading) return null; // Or skeleton
    // if (channels.length < 5) return null; // Removed check to show even with few profiles

    // Split into two rows if desired, or just one flow. User asked for "single horizontal row".

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-muted/20">
            <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row items-end justify-between gap-6 px-4">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                        {t('landing.community_spotlight') || 'Community Spotlight'}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        {t('landing.community_desc') || 'Discover amazing pages created by our community.'}
                    </p>
                </div>
                <Link href="/explore" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors group">
                    {t('common.view_all') || 'View All'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {channels.map((channel) => (
                        <Link key={channel.id} href={`/${channel.username}`} target="_blank">
                            <ReviewCard
                                img={channel.avatar_url || ''}
                                name={channel.display_name || channel.username}
                                username={channel.username}
                                body={channel.bio || 'Check out my page!'}
                            />
                        </Link>
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent dark:from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent dark:from-background"></div>
            </div>

            <div className="mt-8 md:hidden flex justify-center">
                <Link href="/explore" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
                    {t('common.view_all') || 'View All'} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    )
}
