'use client'

import { Block } from '@/types'
import { getBlockStyle, ThemeConfig } from '@/lib/theme'
import { Music, Calendar, Radio } from 'lucide-react'

interface EmbedBlockProps {
    block: Block
    theme: ThemeConfig
    layoutType?: 'classic' | 'special'
}

export function EmbedBlock({ block, theme, layoutType = 'classic' }: EmbedBlockProps) {
    const data = block.data as any
    const url = data.url || ''
    const embedCode = data.embedCode || ''
    const styles = getBlockStyle(block, theme)

    const isSpotify = url.includes('spotify.com')
    const isSoundCloud = url.includes('soundcloud.com')
    const isGoogleCalendar = url.includes('calendar.google.com')
    const isYouTubeMusic = url.includes('music.youtube.com')

    const getSpotifyEmbedUrl = (url: string) => {
        if (!url) return ''
        // Handle playlist and track
        try {
            const urlObj = new URL(url)
            const path = urlObj.pathname
            const parts = path.split('/').filter(p => p)
            const type = parts[0] // playlist or track
            const id = parts[1]
            return `https://open.spotify.com/embed/${type}/${id}`
        } catch (e) {
            return ''
        }
    }

    const getYouTubeMusicEmbedUrl = (url: string) => {
        if (!url) return ''
        try {
            const urlObj = new URL(url)
            const v = urlObj.searchParams.get('v')
            if (v) return `https://www.youtube.com/embed/${v}`

            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
            const match = url.match(regExp)
            const id = (match && match[2].length === 11) ? match[2] : null
            return id ? `https://www.youtube.com/embed/${id}` : ''
        } catch (e) {
            return ''
        }
    }

    if (layoutType === 'special') {
        return (
            <div className="w-full h-full group overflow-hidden bg-white">
                {isSpotify && (
                    <iframe
                        src={getSpotifyEmbedUrl(url)}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="encrypted-media"
                        className="rounded-3xl"
                        loading="lazy"
                    />
                )}
                {isSoundCloud && (
                    <iframe
                        width="100%"
                        height="100%"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                        className="rounded-3xl"
                        loading="lazy"
                    />
                )}
                {isYouTubeMusic && (
                    <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeMusicEmbedUrl(url)}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-3xl"
                        loading="lazy"
                    />
                )}
                {isGoogleCalendar && (
                    <div className="w-full h-full p-6 flex flex-col items-center bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-4 self-start">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Calendar</span>
                        </div>
                        <iframe
                            src={url.includes('embed') ? url : `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(url)}&ctz=Europe%2FIstanbul`}
                            style={{ border: 0 }}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            className="rounded-3xl border border-black/5 bg-white shadow-sm"
                            loading="lazy"
                        />
                    </div>
                )}
                {!isSpotify && !isSoundCloud && !isGoogleCalendar && !isYouTubeMusic && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50/50">
                        {embedCode ? (
                            <div
                                className="w-full h-full flex items-center justify-center rounded-3xl overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: embedCode }}
                            />
                        ) : (
                            <div className="text-center space-y-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Radio className="w-12 h-12 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Embed Content</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                <iframe
                    src={isSpotify ? getSpotifyEmbedUrl(url) : isYouTubeMusic ? getYouTubeMusicEmbedUrl(url) : url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="encrypted-media"
                    loading="lazy"
                />
            </div>
        </div>
    )
}
