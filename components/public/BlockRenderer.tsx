'use client'

import { Block } from '@/types'
import { LinkBlock } from './blocks/LinkBlock'
import { TextBlock } from './blocks/TextBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { VideoBlock } from './blocks/VideoBlock'
import { DividerBlock } from './blocks/DividerBlock'

import { EmbedBlock } from './blocks/EmbedBlock'

interface BlockRendererProps {
    block: Block
    theme: any
    layoutType?: 'classic' | 'special'
}

export function BlockRenderer({ block, theme, layoutType = 'classic' }: BlockRendererProps) {
    const props = { block, theme, layoutType }

    switch (block.type) {
        case 'link':
            return <LinkBlock {...props} />
        case 'text':
            return <TextBlock {...props} />
        case 'image':
            return <ImageBlock {...props} />
        case 'video':
            return <VideoBlock {...props} />
        case 'divider':
            return <DividerBlock {...props} />
        case 'embed':
            return <EmbedBlock {...props} />
        default:
            return null
    }
}
