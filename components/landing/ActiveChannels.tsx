'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/provider'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

// Mock data for active channels/pages
const activeChannels = [
    {
        id: '1',
        name: 'Sarah Designs',
        username: '@sarah.ui',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        bio: 'Digital Designer & Content Creator',
        tags: ['Design', 'UI/UX'],
        color: 'bg-pink-500/10 text-pink-500',
    },
    {
        id: '2',
        name: 'Tech Insider',
        username: '@tech.insider',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
        bio: 'Latest tech news and reviews daily.',
        tags: ['Tech', 'News'],
        color: 'bg-blue-500/10 text-blue-500',
    },
    {
        id: '3',
        name: 'Fitness Pro',
        username: '@fit.life',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fitness',
        bio: 'Personal trainer ensuring you get fit.',
        tags: ['Fitness', 'Health'],
        color: 'bg-green-500/10 text-green-500',
    },
    {
        id: '4',
        name: 'Photo Journey',
        username: '@photo.j',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Photo',
        bio: 'Capturing moments around the world.',
        tags: ['Photography', 'Travel'],
        color: 'bg-purple-500/10 text-purple-500',
    },
    {
        id: '5',
        name: 'Dev Station',
        username: '@code.master',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev',
        bio: 'Coding tutorials and developer tips.',
        tags: ['Coding', 'Dev'],
        color: 'bg-orange-500/10 text-orange-500',
    },
    {
        id: '6',
        name: 'Music Vibes',
        username: '@music.vibes',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Music',
        bio: 'Independent artist sharing new beats.',
        tags: ['Music', 'Art'],
        color: 'bg-indigo-500/10 text-indigo-500',
    }
]

export function ActiveChannels() {
    const { t } = useTranslation()

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                            {t('landing.active_channels_title') || 'Active Channels'}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            {t('landing.active_channels_desc') || 'Explore trending pages created by our community members.'}
                        </p>
                    </div>
                    <Link href="/explore" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeChannels.map((channel, idx) => (
                        <motion.div
                            key={channel.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-muted/20 border border-white/5 rounded-3xl p-6 hover:bg-muted/40 transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border border-white/10">
                                        <Image
                                            src={channel.avatar}
                                            alt={channel.name}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{channel.name}</h3>
                                        <p className="text-sm text-muted-foreground">{channel.username}</p>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-full ${channel.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-6 line-clamp-2 min-h-[3rem]">
                                {channel.bio}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {channel.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium border border-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 md:hidden flex justify-center">
                    <Link href="/explore" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
