'use client'

import { Block } from '@/types'

import { getBlockStyle, ThemeConfig } from '@/lib/theme'

interface DividerBlockProps {
    block: Block
    theme: ThemeConfig
}

export function DividerBlock({ block, theme }: DividerBlockProps) {
    const styles = getBlockStyle(block, theme)
    const color = styles.textColor || theme.textColor || '#000000'

    return (
        <div className="py-6 px-2">
            <hr
                className="border-0 h-[1.5px] w-full"
                style={{
                    backgroundColor: color,
                    opacity: 0.15,
                }}
            />
        </div>
    )
}
