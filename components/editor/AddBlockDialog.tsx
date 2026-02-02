'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Link as LinkIcon, Type, Image as ImageIcon, Video, MoreHorizontal, LayoutGrid, Music } from 'lucide-react'
import { toast } from 'sonner'
import { Block } from '@/types'

import { useTranslation } from '@/lib/i18n/provider'

interface AddBlockDialogProps {
    pageId: string
    onBlockAdded: (block: Block) => void
}

export function AddBlockDialog({ pageId, onBlockAdded }: AddBlockDialogProps) {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const BLOCK_TYPES = [
        { type: 'link', label: t('editor.blocks.types.link'), icon: LinkIcon, initialData: { title: t('editor.blocks.initial_data.link_title'), url: '' } },
        { type: 'text', label: t('editor.blocks.types.text'), icon: Type, initialData: { content: t('editor.blocks.initial_data.text_content'), align: 'center' } },
        { type: 'image', label: t('editor.blocks.types.image'), icon: ImageIcon, initialData: { url: '', caption: '' } },
        { type: 'video', label: t('editor.blocks.types.video'), icon: Video, initialData: { url: '', caption: '' } },
        { type: 'embed', label: t('editor.blocks.types.embed'), icon: Music, initialData: { url: '', embedCode: '' } },
        { type: 'divider', label: t('editor.blocks.types.divider'), icon: MoreHorizontal, initialData: {} },
    ]

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
            toast.success(`${t('editor.blocks.types.' + type)} ${t('editor.blocks.added')}`)
        } catch {
            toast.error(t('common.error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> {t('editor.blocks.add')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('editor.blocks.choose')}</DialogTitle>
                    <DialogDescription>
                        {t('editor.blocks.choose_desc')}
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
