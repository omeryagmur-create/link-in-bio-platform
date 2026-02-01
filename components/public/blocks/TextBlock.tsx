'use client'

import { Block } from '@/types'
import { getBlockStyle, ThemeConfig } from '@/lib/theme'
import { Quote } from 'lucide-react'

interface TextBlockProps {
    block: Block
    theme: ThemeConfig
    layoutType?: 'classic' | 'special'
}

export function TextBlock({ block, theme, layoutType = 'classic' }: TextBlockProps) {
    const data = block.data as any
    const content = data.content || ''
    const styles = getBlockStyle(block, theme)

    if (layoutType === 'special') {
        const isSmall = (data.gridSpanX || 1) === 1

        return (
            <div
                className={`w-full h-full p-6 flex flex-col justify-center relative overflow-hidden text-center group`}
                style={{
                    backgroundColor: styles.backgroundColor,
                    color: styles.textColor,
                    borderRadius: styles.borderRadius,
                    fontFamily: styles.fontFamily
                }}
            >
                {!isSmall && (
                    <Quote className="absolute -top-4 -left-4 w-24 h-24 opacity-5 transform -rotate-12 transition-transform group-hover:rotate-0" />
                )}
                <p className={`${isSmall ? 'text-sm' : 'text-xl md:text-2xl'} font-medium leading-relaxed relative z-10`}>
                    {content}
                </p>
            </div>
        )
    }

    return (
        <div
            className="w-full text-center p-6"
            style={{
                backgroundColor: styles.backgroundColor,
                color: styles.textColor,
                borderRadius: styles.borderRadius,
                fontFamily: styles.fontFamily
            }}
        >
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
    )
}
