'use client'

import { Block } from '@/types'
import { ExternalLink, ArrowUpRight, Instagram, Twitter, Github, Youtube, MessageCircle, MapPin, Globe } from 'lucide-react'
import { getBlockStyle, ThemeConfig } from '@/lib/theme'

interface LinkBlockProps {
    block: Block
    theme: ThemeConfig
    layoutType?: 'classic' | 'special'
}

export function LinkBlock({ block, theme, layoutType = 'classic' }: LinkBlockProps) {
    const data = block.data as any
    const url = data.url || '#'
    const title = data.title || 'Link'
    const description = data.description || ''

    const styles = getBlockStyle(block, theme)

    const handleClick = async () => {
        try {
            await fetch('/api/analytics/block-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockId: block.id, pageId: block.page_id }),
            })
        } catch (error) {
            console.error('Analytics error:', error)
        }
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    const getPlatformInfo = () => {
        const lowerUrl = url.toLowerCase()
        const lowerTitle = title.toLowerCase()

        if (lowerUrl.includes('instagram.com') || lowerTitle.includes('instagram')) {
            return {
                icon: <Instagram className="w-8 h-8" />,
                label: 'Instagram',
                colorClass: 'bg-pink-50 text-pink-600',
            }
        }
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') || lowerTitle.includes('twitter') || lowerTitle.includes(' x ')) {
            return {
                icon: <Twitter className="w-8 h-8" />,
                label: 'X',
                colorClass: 'bg-slate-50 text-black',
            }
        }
        if (lowerUrl.includes('tiktok.com') || lowerTitle.includes('tiktok')) {
            return {
                icon: <MessageCircle className="w-8 h-8" />,
                label: 'TikTok',
                colorClass: 'bg-slate-100 text-black',
            }
        }
        if (lowerUrl.includes('youtube.com') || lowerTitle.includes('youtube')) {
            return {
                icon: <Youtube className="w-8 h-8" />,
                label: 'YouTube',
                colorClass: 'bg-red-50 text-red-600',
            }
        }
        if (lowerUrl.includes('github.com') || lowerTitle.includes('github')) {
            return {
                icon: <Github className="w-8 h-8" />,
                label: 'GitHub',
                colorClass: 'bg-slate-100 text-slate-800',
            }
        }

        return {
            icon: <Globe className="w-8 h-8" />,
            label: 'Website',
            colorClass: 'bg-blue-50 text-blue-600',
        }
    }

    if (layoutType === 'special') {
        const platform = getPlatformInfo()
        const isSmall = (data.gridSpanX || 1) <= 1

        return (
            <button
                onClick={handleClick}
                className="w-full h-full p-5 lg:p-6 flex flex-col justify-between group text-left relative overflow-hidden active:scale-[0.98] transition-all"
            >
                <div className="flex justify-between items-start w-full relative z-10">
                    <div
                        className={`p-4 ${platform.colorClass} shadow-inner group-hover:scale-110 transition-transform duration-500`}
                        style={{ borderRadius: styles.borderRadius }}
                    >
                        {platform.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>

                <div className="space-y-1 relative z-10">
                    <h3 className={`font-bold leading-tight ${isSmall ? 'text-base' : 'text-xl'} text-current group-hover:underline decoration-2 underline-offset-4`}>
                        {title}
                    </h3>
                    <p className="text-[10px] opacity-40 font-bold uppercase tracking-wider">{platform.label.toLowerCase()}.com</p>
                    {!isSmall && description && (
                        <p className="text-xs opacity-50 mt-2 line-clamp-2">{description}</p>
                    )}
                </div>

                {/* Subtle background decoration */}
                <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${platform.colorClass} opacity-[0.03] group-hover:scale-150 transition-transform duration-1000`}></div>
            </button>
        )
    }

    return (
        <button
            onClick={handleClick}
            className="w-full text-left p-4 transition-transform hover:scale-[1.02] active:scale-95 shadow-sm"
            style={{
                backgroundColor: styles.backgroundColor,
                color: styles.textColor,
                borderRadius: styles.borderRadius,
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="font-semibold">{title}</div>
                    {description && (
                        <div className="text-sm opacity-80 mt-1">{description}</div>
                    )}
                </div>
                <ExternalLink className="w-5 h-5 ml-3 flex-shrink-0" />
            </div>
        </button>
    )
}
