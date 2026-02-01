'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Link as LinkIcon, Type, Image as ImageIcon, Video, MoreHorizontal, LayoutGrid, Music } from 'lucide-react'
import { toast } from 'sonner'
import { Block } from '@/types'

interface AddBlockDialogProps {
    pageId: string
    onBlockAdded: (block: Block) => void
}

const BLOCK_TYPES = [
    { type: 'link', label: 'Link', icon: LinkIcon, initialData: { title: 'Yeni Link', url: '' } },
    { type: 'text', label: 'Yazı', icon: Type, initialData: { content: 'Metin içeriği...', align: 'center' } },
    { type: 'image', label: 'Görsel', icon: ImageIcon, initialData: { url: '', caption: '' } },
    { type: 'video', label: 'Video', icon: Video, initialData: { url: '', caption: '' } },
    { type: 'embed', label: 'Eklenti', icon: Music, initialData: { url: '', embedCode: '' } },
    { type: 'divider', label: 'Ayırıcı', icon: MoreHorizontal, initialData: {} },
]

export function AddBlockDialog({ pageId, onBlockAdded }: AddBlockDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleAdd = async (type: string, initialData: any) => {
        setLoading(true)
        try {
            const res = await fetch('/api/blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page_id: pageId,
                    type,
                    data: initialData
                })
            })

            if (!res.ok) throw new Error('Failed')

            const block = await res.json()
            onBlockAdded(block)
            setOpen(false)
            toast.success(`${type} bloğu eklendi`)
        } catch {
            toast.error('Blok eklenemedi')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Blok Ekle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Blok Seçin</DialogTitle>
                    <DialogDescription>
                        Sayfanıza eklemek istediğiniz içerik türünü seçin.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {BLOCK_TYPES.map((item) => (
                        <Button
                            key={item.type}
                            variant="outline"
                            className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                            onClick={() => handleAdd(item.type, item.initialData)}
                            disabled={loading}
                        >
                            <item.icon className="h-6 w-6" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
