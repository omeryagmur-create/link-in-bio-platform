'use client'

import { Block } from '@/types'
import { getBlockStyle, ThemeConfig } from '@/lib/theme'
import { Youtube, Play } from 'lucide-react'
import Image from 'next/image'

interface VideoBlockProps {
    block: Block
    theme: ThemeConfig
    layoutType?: 'classic' | 'special'
}

export function VideoBlock({ block, theme, layoutType = 'classic' }: VideoBlockProps) {
    const data = block.data as any
    const videoUrl = data.videoUrl || data.url || ''
    const title = data.title || 'YouTube'

    // Extract video ID from YouTube URL
    const getYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    const videoId = getYouTubeID(videoUrl)
    const styles = getBlockStyle(block, theme)

    if (layoutType === 'special') {
        const spanX = data.gridSpanX || 1
        const spanY = data.gridSpanY || 1

        // LARGE MODE: Video Grid
        if (spanX >= 2 && spanY >= 2) {
            return (
                <div className="w-full h-full p-6 bg-red-50/10 flex flex-col gap-5 group">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200"
                            style={{ borderRadius: styles.borderRadius }}
                        >
                            <Youtube className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base leading-tight">{title}</h3>
                            <p className="text-[10px] opacity-40 font-bold uppercase tracking-wider">youtube.com</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-grow min-h-0">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="relative aspect-video overflow-hidden bg-slate-200 group/vid cursor-pointer shadow-sm border border-black/5"
                                style={{ borderRadius: styles.borderRadius }}
                            >
                                <Image
                                    src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=300&auto=format&fit=crop&sig=${i}`}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover group-hover/vid:scale-110 transition-transform duration-700 opacity-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 transition-all bg-black/30 backdrop-blur-[2px]">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                        <Play className="w-5 h-5 text-white fill-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        // SMALL MODE: Embed
        return (
            <div className="w-full h-full group overflow-hidden bg-white">
                {videoId ? (
                    <div className="w-full h-full relative">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="w-full h-full p-6 flex flex-col justify-between">
                        <div
                            className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center shadow-inner"
                            style={{ borderRadius: styles.borderRadius }}
                        >
                            <Youtube className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{title}</h3>
                            <p className="text-[10px] opacity-40 font-bold uppercase tracking-wider">youtube.com</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            {videoId ? (
                <div
                    className="aspect-video w-full overflow-hidden shadow-sm"
                    style={{ borderRadius: styles.borderRadius }}
                >
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">
                    Geçerli bir YouTube URL&apos;si girin
                </div>
            )}
        </div>
    )
}
