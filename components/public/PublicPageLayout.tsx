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
            className="min-h-screen py-8 px-4"
            style={{
                backgroundColor,
                color: textColor,
                fontFamily,
            }}
        >
            <div className="max-w-2xl mx-auto">
                {/* Profil Header */}
                <div className="text-center mb-8">
                    {/* Avatar */}
                    {profile.avatar_url ? (
                        <div className="mb-4 flex justify-center">
                            <Image
                                src={profile.avatar_url}
                                alt={profile.display_name || profile.username}
                                width={96}
                                height={96}
                                className="rounded-full"
                            />
                        </div>
                    ) : (
                        <div className="mb-4 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-3xl font-bold text-gray-500">
                                    {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Display Name */}
                    <h1 className="text-2xl font-bold mb-2">
                        {profile.display_name || profile.username}
                    </h1>

                    {/* Bio */}
                    {profile.bio && (
                        <p className="text-sm opacity-80 max-w-md mx-auto">
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
                    <p>Powered by Link-in-Bio Platform</p>
                </div>
            </div>
        </div>
    )
}
