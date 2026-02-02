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

import { useTranslation } from '@/lib/i18n/provider'

export function PublicPageLayout({ profile, page, blocks }: PublicPageLayoutProps) {
    const { t } = useTranslation()
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
            className="min-h-screen py-8 px-4"
            style={{
                backgroundColor,
                color: textColor,
                fontFamily,
            }}
        >
            <div className="max-w-2xl mx-auto">
                {/* Profil Header */}
                <div className="text-center mb-12">
                    {/* Avatar */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
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
                    </div>

                    {/* Display Name */}
                    <h1 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">
                        {profile.display_name || profile.username}
                    </h1>

                    {/* Bio */}
                    {profile.bio && (
                        <p className="text-sm md:text-base opacity-80 max-w-md mx-auto leading-relaxed">
                            {profile.bio}
                        </p>
                    )}
                </div>

                {/* Bloklar */}
                <div className="space-y-4">
                    {blocks.map((block) => (
                        <BlockRenderer
                            key={block.id}
                            block={block}
                            theme={theme}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm opacity-50">
                    <p>{t('public.powered_by')}</p>
                </div>
            </div>
        </div>
    )
}
