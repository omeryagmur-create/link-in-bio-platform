'use client'

import { useEffect } from 'react'
import { BlockRenderer } from './BlockRenderer'
import { Block } from '@/types'
import Image from 'next/image'
import { popularFonts } from '@/lib/theme'

import { SpecialPageLayout } from './SpecialPageLayout'

interface Profile {
    id: string
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
}

interface Page {
    id: string
    title: string
    theme: any
    layout_type: 'classic' | 'special'
}

interface PublicPageLayoutProps {
    profile: Profile
    page: Page
    blocks: Block[]
}

export function PublicPageLayout({ profile, page, blocks }: PublicPageLayoutProps) {
    // Analytics... (keep existing useEffect)
    useEffect(() => {
        const trackPageView = async () => {
            try {
                await fetch('/api/analytics/page-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pageId: page.id }),
                })
            } catch (error) {
                console.error('Analytics error:', error)
            }
        }

        trackPageView()
    }, [page.id])

    if (page.layout_type === 'special') {
        return <SpecialPageLayout profile={profile} page={page} blocks={blocks} />
    }

    // Existing Classic Layout...

    // Tema değerlerini parse et
    const theme = page.theme || {}
    const backgroundColor = theme.backgroundColor || '#ffffff'
    const textColor = theme.textColor || '#000000'
    const fontName = theme.font || 'Inter'
    const fontFamily = popularFonts.find(f => f.name === fontName)?.family || 'sans-serif'

    return (
        <div
            className="min-h-screen transition-all duration-500 relative"
            style={{
                backgroundColor,
                color: textColor,
                fontFamily,
            }}
        >
            {/* Desktop Navigation Mockup (matching SpecialPageLayout) - Only visible on desktop if needed, or keeping it clean */}
            <div className="hidden md:flex w-full justify-between items-center p-6 max-w-[1200px] mx-auto">
                {/* Visual parity with Special Layout nav */}
                <div className="flex gap-4 opacity-0"> {/* Hidden but keeping space for layout parity if needed */}
                    <div className="w-10 h-10" />
                </div>
            </div>

            <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-8 md:py-10 pb-32">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                    {/* Profil Sidebar / Header */}
                    <div className="w-full md:w-[280px] md:sticky md:top-12 flex flex-col items-center md:items-start text-center md:text-left">
                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className="w-32 h-32 md:w-52 md:h-52 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative transform md:rotate-1">
                                {profile.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt={profile.display_name || profile.username}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl md:text-4xl font-bold text-slate-400">
                                        {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-3 md:space-y-5">
                            <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                                {profile.display_name || profile.username}
                            </h1>
                            {profile.bio && (
                                <p className="text-sm md:text-base opacity-80 leading-relaxed max-w-sm">
                                    {profile.bio}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Content Area - Classic blocks */}
                    <div className="w-full flex-1 max-w-2xl md:max-w-[640px]">
                        <div className="space-y-4 w-full">
                            {blocks.map((block) => (
                                <BlockRenderer
                                    key={block.id}
                                    block={block}
                                    theme={theme}
                                />
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-16 text-center text-xs opacity-50 pb-12">
                            <p>Powered by Link-in-Bio Platform</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
