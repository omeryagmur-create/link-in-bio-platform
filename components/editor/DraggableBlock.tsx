'use client'

import * as React from 'react'
import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Block } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { GripVertical, Trash2, Edit, Check, X, Type, Link as LinkIcon, Image as ImageIcon, Video as VideoIcon, Minus, Grid2X2, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/provider'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { ImageUpload } from './ImageUpload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DraggableBlockProps {
    block: Block
    onDelete: (id: string) => void
    onUpdate: (block: Block) => void
    layoutType?: 'classic' | 'special'
}

export function DraggableBlock({ block, onDelete, onUpdate, layoutType = 'classic' }: DraggableBlockProps) {
    const { t } = useTranslation()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: block.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const [isEditing, setIsEditing] = useState(false)
    const [data, setData] = useState(block.data as any)
    const [isFetchingStats, setIsFetchingStats] = useState(false)

    const fetchSocialStats = async (url: string) => {
        if (!url || !url.includes('http')) return

        const isSocial = ['instagram.com', 'twitter.com', 'x.com', 'tiktok.com', 'youtube.com', 'youtu.be'].some(p => url.toLowerCase().includes(p))
        if (!isSocial) return

        setIsFetchingStats(true)
        try {
            const res = await fetch('/api/social/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })
            const result = await res.json()
            if (result.statCount) {
                setData((prev: any) => ({ ...prev, statCount: result.statCount }))
                toast.success(`${result.platform} ${t('common.updated')}`)
            }
        } catch {
            console.error('Stats fetch failed')
        } finally {
            setIsFetchingStats(false)
        }
    }

    const handleDelete = async () => {
        try {
            await fetch(`/api/blocks/${block.id}`, { method: 'DELETE' })
            onDelete(block.id)
            toast.success(t('editor.blocks.deleted'))
        } catch {
            toast.error(t('common.error'))
        }
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/blocks/${block.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data })
            })
            const updated = await res.json()
            onUpdate(updated)
            setIsEditing(false)
            toast.success(t('editor.blocks.updated'))
        } catch {
            toast.error(t('common.error'))
        }
    }

    const renderIcon = () => {
        switch (block.type) {
            case 'link': return <LinkIcon className="h-4 w-4" />
            case 'text': return <Type className="h-4 w-4" />
            case 'image': return <ImageIcon className="h-4 w-4" />
            case 'video': return <VideoIcon className="h-4 w-4" />
            case 'embed': return <Music className="h-4 w-4" />
            case 'divider': return <Minus className="h-4 w-4" />
            default: return <Edit className="h-4 w-4" />
        }
    }

    const renderContentPreview = () => {
        const bData = block.data as any
        switch (block.type) {
            case 'link':
                return (
                    <div className="flex-1">
                        <div className="font-medium text-sm">{bData.title || t('editor.blocks.untitled_link')}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">{bData.url}</div>
                    </div>
                )
            case 'text':
                return (
                    <div className="flex-1 truncate text-sm min-w-0">
                        {bData.content || t('editor.blocks.text_placeholder')}
                    </div>
                )
            case 'image':
                return <div className="flex-1 text-sm font-medium">{t('editor.blocks.types.image')}</div>
            case 'video':
                return <div className="flex-1 text-sm font-medium">{t('editor.blocks.types.video')}</div>
            case 'embed':
                return <div className="flex-1 text-sm font-medium">{t('editor.blocks.types.embed')}</div>
            case 'divider':
                return <div className="flex-1 text-sm font-medium">{t('editor.blocks.types.divider')}</div>
            default:
                return <div className="flex-1 text-sm font-medium uppercase">{block.type} BLOCK</div>
        }
    }

    const renderEditor = () => {
        return (
            <div className="flex-1 space-y-4">
                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                        <TabsTrigger value="content" className="text-xs">{t('editor.blocks.editor.content')}</TabsTrigger>
                        <TabsTrigger value="style" className="text-xs">{t('editor.blocks.editor.style')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-3 pt-2">
                        {block.type === 'link' && (
                            <>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.editor.title')}</Label>
                                    <Input
                                        placeholder={t('editor.blocks.editor.placeholder_title')}
                                        value={data.title || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, title: e.target.value })}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.editor.url')}</Label>
                                        {isFetchingStats && <span className="text-[10px] text-primary animate-pulse">{t('editor.blocks.editor.fetching')}</span>}
                                    </div>
                                    <Input
                                        placeholder="https://..."
                                        value={data.url || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, url: e.target.value })}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => fetchSocialStats(e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </>
                        )}

                        {block.type === 'text' && (
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.types.text')}</Label>
                                <Textarea
                                    placeholder={t('editor.blocks.editor.placeholder_text')}
                                    value={data.content || ''}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData({ ...data, content: e.target.value })}
                                    className="min-h-[80px] text-sm"
                                />
                            </div>
                        )}

                        {block.type === 'image' && (
                            <div className="space-y-3">
                                <ImageUpload
                                    label={t('editor.blocks.editor.image_label')}
                                    value={data.imageUrl || data.url || ''}
                                    onChange={(url) => setData({ ...data, imageUrl: url, url })}
                                />
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.editor.link_url')}</Label>
                                    <Input
                                        placeholder="https://..."
                                        value={data.linkUrl || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, linkUrl: e.target.value })}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.editor.caption')}</Label>
                                    <Input
                                        placeholder={t('editor.blocks.editor.caption_placeholder')}
                                        value={data.caption || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, caption: e.target.value })}
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {block.type === 'video' && (
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.editor.video_url')}</Label>
                                    {isFetchingStats && <span className="text-[10px] text-primary animate-pulse">{t('editor.blocks.editor.fetching')}</span>}
                                </div>
                                <Input
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={data.videoUrl || data.url || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const val = e.target.value;
                                        setData({ ...data, videoUrl: val, url: val });
                                    }}
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => fetchSocialStats(e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>
                        )}

                        {block.type === 'embed' && (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.editor.platform_url')}</Label>
                                    <Input
                                        placeholder="https://..."
                                        value={data.url || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, url: e.target.value })}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.blocks.editor.embed_code')}</Label>
                                    <Textarea
                                        placeholder="<iframe... "
                                        value={data.embedCode || ''}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData({ ...data, embedCode: e.target.value })}
                                        className="h-20 text-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {block.type === 'divider' && (
                            <p className="text-xs text-muted-foreground italic">{t('editor.blocks.editor.divider_hint')}</p>
                        )}
                    </TabsContent>

                    <TabsContent value="style" className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.theme.background')}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={data.backgroundColor || '#000000'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, backgroundColor: e.target.value })}
                                        className="h-8 w-8 p-1 cursor-pointer"
                                    />
                                    <Input
                                        placeholder={t('editor.theme.colors')}
                                        value={data.backgroundColor || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, backgroundColor: e.target.value })}
                                        className="h-8 text-xs flex-1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('editor.theme.text')}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={data.textColor || '#ffffff'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, textColor: e.target.value })}
                                        className="h-8 w-8 p-1 cursor-pointer"
                                    />
                                    <Input
                                        placeholder={t('editor.theme.colors')}
                                        value={data.textColor || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, textColor: e.target.value })}
                                        className="h-8 text-xs flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grid Controls for Special Layout */}
                        {layoutType === 'special' && (
                            <div className="space-y-4 pt-4 border-t mt-2">
                                <div className="flex items-center gap-2 text-primary">
                                    <Grid2X2 className="h-3 w-3" />
                                    <span className="text-[10px] uppercase font-bold tracking-tight">{t('editor.blocks.editor.widget_placement')}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">{t('editor.blocks.editor.width')}</Label>
                                        <Select
                                            value={String(data.gridSpanX || 1)}
                                            onValueChange={(val) => setData({ ...data, gridSpanX: parseInt(val) })}
                                        >
                                            <SelectTrigger className="h-9 text-xs bg-muted/50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 {t('editor.blocks.editor.columns')} ({t('editor.blocks.editor.small')})</SelectItem>
                                                <SelectItem value="2">2 {t('editor.blocks.editor.columns')} ({t('editor.blocks.editor.medium')})</SelectItem>
                                                <SelectItem value="4">4 {t('editor.blocks.editor.columns')} ({t('editor.blocks.editor.wide')})</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">{t('editor.blocks.editor.height')}</Label>
                                        <Select
                                            value={String(data.gridSpanY || 1)}
                                            onValueChange={(val) => setData({ ...data, gridSpanY: parseInt(val) })}
                                        >
                                            <SelectTrigger className="h-9 text-xs bg-muted/50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 {t('editor.blocks.editor.rows')}</SelectItem>
                                                <SelectItem value="2">2 {t('editor.blocks.editor.rows')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="flex gap-2 justify-end pt-2 border-t">
                    <Button size="sm" variant="ghost" onClick={() => {
                        setData(block.data);
                        setIsEditing(false);
                    }}>
                        <X className="h-4 w-4 mr-1" /> {t('common.cancel')}
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        <Check className="h-4 w-4 mr-1" /> {t('common.save')}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div ref={setNodeRef} style={style} className="relative group touch-none mb-3">
            <Card className={`transition-all ${isEditing ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}>
                <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                        <div {...attributes} {...listeners} className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                            <GripVertical className="h-5 w-5" />
                        </div>

                        {isEditing ? renderEditor() : (
                            <div className="flex-1 flex items-center justify-between min-w-0">
                                <div className="flex flex-1 items-center gap-3 min-w-0 overflow-hidden">
                                    <div className="p-2 bg-muted rounded-md text-muted-foreground shrink-0">
                                        {renderIcon()}
                                    </div>
                                    {renderContentPreview()}
                                </div>
                                <div className="flex gap-1 shrink-0 ml-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setIsEditing(true)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleDelete}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
