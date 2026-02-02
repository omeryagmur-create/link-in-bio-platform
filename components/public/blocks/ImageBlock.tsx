'use client'

import { Block } from '@/types'
import Image from 'next/image'
import { getBlockStyle, ThemeConfig } from '@/lib/theme'
import { useTranslation } from '@/lib/i18n/provider'

interface ImageBlockProps {
    block: Block
    theme: ThemeConfig
    layoutType?: 'classic' | 'special'
}

export function ImageBlock({ block, theme, layoutType = 'classic' }: ImageBlockProps) {
    const { t } = useTranslation()
    const data = block.data as any
    const imageUrl = data.imageUrl || data.url || ''
    const alt = data.alt || t('editor.blocks.types.image')
    const caption = data.caption || ''
    const linkUrl = data.linkUrl || ''

    const styles = getBlockStyle(block, theme)

    const content = imageUrl ? (
        <div
            className={`relative w-full h-full overflow-hidden shadow-sm ${linkUrl ? 'cursor-pointer' : ''}`}
            style={{ borderRadius: styles.borderRadius }}
        >
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
                sizes="(max-width: 768px) 100vw, 672px"
            />
            {layoutType === 'special' && caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs font-medium">{caption}</p>
                </div>
            )}
        </div>
    ) : (
        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">
            {t('public.no_image')}
        </div>
    )

    const trackClick = async () => {
        if (!linkUrl) return
        try {
            await fetch('/api/analytics/block-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockId: block.id, pageId: block.page_id }),
            })
        } catch (error) {
            console.error('Analytics error:', error)
        }
        window.open(linkUrl, '_blank', 'noopener,noreferrer')
    }

    const wrappedContent = linkUrl ? (
        <div
            onClick={trackClick}
            className="block h-full w-full transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
            {content}
        </div>
    ) : content

    if (layoutType === 'special') {
        return <div className="w-full h-full">{wrappedContent}</div>
    }

    return (
        <div className="w-full">
            {wrappedContent}
            {caption && (
                <p className="text-sm text-center mt-2 opacity-70" style={{ fontFamily: styles.fontFamily }}>
                    {caption}
                </p>
            )}
        </div>
    )
}
