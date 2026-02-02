'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Loader2, Layout, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { useTranslation } from '@/lib/i18n/provider'

// Slugify utility
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
}

export function CreatePageDialog() {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [layoutType, setLayoutType] = useState<'classic' | 'special'>('classic')
    const router = useRouter()

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        if (!slug || slug === slugify(title)) {
            setSlug(slugify(newTitle))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, slug, layout_type: layoutType }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || t('common.error'))
            }

            toast.success(t('common.success'))
            setOpen(false)
            setTitle('')
            setSlug('')
            setLayoutType('classic')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> {t('dashboard.create_page')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('dashboard.create_page')}</DialogTitle>
                    <DialogDescription>
                        {t('dashboard.create_page_desc')}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <Label className="text-sm font-semibold">{t('dashboard.layout_choice')}</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setLayoutType('classic')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${layoutType === 'classic' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Layout className={`h-4 w-4 ${layoutType === 'classic' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="font-bold text-sm">{t('editor.layout.classic')}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">{t('dashboard.layout_classic_desc')}</p>
                            </div>
                            <div
                                onClick={() => setLayoutType('special')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${layoutType === 'special' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className={`h-4 w-4 ${layoutType === 'special' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="font-bold text-sm">{t('editor.layout.special')}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">{t('dashboard.layout_special_desc')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">{t('dashboard.page_title_label')}</Label>
                        <Input
                            id="title"
                            placeholder={t('dashboard.page_title_placeholder')}
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">{t('dashboard.page_url_label')}</Label>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">link-platform.com/</span>
                            <Input
                                id="slug"
                                placeholder={t('dashboard.page_url_placeholder')}
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('dashboard.create_confirm')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
