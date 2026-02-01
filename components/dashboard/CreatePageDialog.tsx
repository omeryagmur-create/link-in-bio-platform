'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Loader2, Layout, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

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
                throw new Error(data.error || 'Bir hata oluştu')
            }

            toast.success('Sayfa oluşturuldu')
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
                    <Plus className="mr-2 h-4 w-4" /> Yeni Sayfa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Yeni Sayfa Oluştur</DialogTitle>
                    <DialogDescription>
                        Sayfanız için bir tasarım ve adres belirleyin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <Label className="text-sm font-semibold">Tasarım Seçimi</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setLayoutType('classic')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${layoutType === 'classic' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Layout className={`h-4 w-4 ${layoutType === 'classic' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="font-bold text-sm">Klasik</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">Dikey liste şeklinde, klasik link-in-bio görünümü.</p>
                            </div>
                            <div
                                onClick={() => setLayoutType('special')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${layoutType === 'special' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className={`h-4 w-4 ${layoutType === 'special' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="font-bold text-sm">Özel (Premium)</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">Modern, kart tabanlı ve ızgara yerleşimli dinamik tasarım.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Sayfa Başlığı</Label>
                        <Input
                            id="title"
                            placeholder="Örn: Kişisel Linklerim"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Sayfa Linki (URL)</Label>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">link-platform.com/</span>
                            <Input
                                id="slug"
                                placeholder="kullanici-adi"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Vazgeç</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sayfayı Oluştur
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
