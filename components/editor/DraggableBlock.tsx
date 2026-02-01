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
                toast.success(`${result.platform} verileri güncellendi`)
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
            toast.success('Blok silindi')
        } catch {
            toast.error('Hata oluştu')
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
            toast.success('Güncellendi')
        } catch {
            toast.error('Hata oluştu')
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
                        <div className="font-medium text-sm">{bData.title || 'Başlıksız Link'}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">{bData.url}</div>
                    </div>
                )
            case 'text':
                return (
                    <div className="flex-1 truncate text-sm">
                        {bData.content || 'Metin içeriği...'}
                    </div>
                )
            case 'image':
                return <div className="flex-1 text-sm font-medium">Resim Bloğu</div>
            case 'video':
                return <div className="flex-1 text-sm font-medium">Video Bloğu</div>
            case 'embed':
                return <div className="flex-1 text-sm font-medium">Eklenti (Müzik/Takvim)</div>
            case 'divider':
                return <div className="flex-1 text-sm font-medium">Ayırıcı</div>
            default:
                return <div className="flex-1 text-sm font-medium uppercase">{block.type} BLOCK</div>
        }
    }

    const renderEditor = () => {
        return (
            <div className="flex-1 space-y-4">
                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                        <TabsTrigger value="content" className="text-xs">İçerik</TabsTrigger>
                        <TabsTrigger value="style" className="text-xs">Stil</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-3 pt-2">
                        {block.type === 'link' && (
                            <>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Başlık</Label>
                                    <Input
                                        placeholder="Link Başlığı"
                                        value={data.title || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, title: e.target.value })}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">URL</Label>
                                        {isFetchingStats && <span className="text-[10px] text-primary animate-pulse">Veriler Çekiliyor...</span>}
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
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Metin İçeriği</Label>
                                <Textarea
                                    placeholder="Buraya yazın..."
                                    value={data.content || ''}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData({ ...data, content: e.target.value })}
                                    className="min-h-[80px] text-sm"
                                />
                            </div>
                        )}

                        {block.type === 'image' && (
                            <div className="space-y-3">
                                <ImageUpload
                                    label="Resim"
                                    value={data.imageUrl || data.url || ''}
                                    onChange={(url) => setData({ ...data, imageUrl: url, url })}
                                />
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Yönlendirilecek Link (Opsiyonel)</Label>
                                    <Input
                                        placeholder="https://..."
                                        value={data.linkUrl || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, linkUrl: e.target.value })}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Açıklama (Opsiyonel)</Label>
                                    <Input
                                        placeholder="Resim altı yazısı"
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
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">YouTube URL</Label>
                                    {isFetchingStats && <span className="text-[10px] text-primary animate-pulse">Veriler Çekiliyor...</span>}
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
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Platform URL (Spotify, YT Music, Takvim)</Label>
                                    <Input
                                        placeholder="https://..."
                                        value={data.url || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, url: e.target.value })}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Veya Embed Kodu</Label>
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
                            <p className="text-xs text-muted-foreground italic">Ayırıcı çizgi ayarları görünüm kısmındadır.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="style" className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Arka Plan</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={data.backgroundColor || '#000000'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, backgroundColor: e.target.value })}
                                        className="h-8 w-8 p-1 cursor-pointer"
                                    />
                                    <Input
                                        placeholder="Özel Renk"
                                        value={data.backgroundColor || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, backgroundColor: e.target.value })}
                                        className="h-8 text-xs flex-1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Yazı Rengi</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={data.textColor || '#ffffff'}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, textColor: e.target.value })}
                                        className="h-8 w-8 p-1 cursor-pointer"
                                    />
                                    <Input
                                        placeholder="Özel Renk"
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
                                    <span className="text-[10px] uppercase font-bold tracking-tight">Widget Yerleşimi</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Genişlik</Label>
                                        <Select
                                            value={String(data.gridSpanX || 1)}
                                            onValueChange={(val) => setData({ ...data, gridSpanX: parseInt(val) })}
                                        >
                                            <SelectTrigger className="h-9 text-xs bg-muted/50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Sütun (Küçük)</SelectItem>
                                                <SelectItem value="2">2 Sütun (Orta)</SelectItem>
                                                <SelectItem value="4">4 Sütun (Geniş)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Yükseklik</Label>
                                        <Select
                                            value={String(data.gridSpanY || 1)}
                                            onValueChange={(val) => setData({ ...data, gridSpanY: parseInt(val) })}
                                        >
                                            <SelectTrigger className="h-9 text-xs bg-muted/50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Satır</SelectItem>
                                                <SelectItem value="2">2 Satır</SelectItem>
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
                        <X className="h-4 w-4 mr-1" /> İptal
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                        <Check className="h-4 w-4 mr-1" /> Kaydet
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
                            <div className="flex-1 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-md text-muted-foreground">
                                        {renderIcon()}
                                    </div>
                                    {renderContentPreview()}
                                </div>
                                <div className="flex gap-1">
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
