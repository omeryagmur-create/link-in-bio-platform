'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Page } from '@/types'
import Link from 'next/link'
import { ExternalLink, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PageListProps {
    pages: Page[]
}

export function PageList({ pages }: PageListProps) {
    const router = useRouter()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            const res = await fetch(`/api/pages/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Silme işlemi başarısız')

            toast.success('Sayfa silindi')
            router.refresh()
        } catch {
            toast.error('Sayfa silinirken bir hata oluştu')
        } finally {
            setDeletingId(null)
        }
    }

    if (pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <h3 className="mt-4 text-lg font-semibold">Henüz hiç sayfanız yok</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    İlk sayfanızı oluşturarak paylaşımlarınızı bir araya getirin.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
                <Card key={page.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="truncate">{page.title}</CardTitle>
                        <CardDescription className="truncate">/{page.slug}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span className={`inline-block h-2 w-2 rounded-full ${page.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span>{page.is_published ? 'Yayında' : 'Taslak'}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
                        <Link href={`/editor/${page.id}`} passHref>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-3 w-3" /> Düzenle
                            </Button>
                        </Link>
                        <div className="flex space-x-2">
                            {page.is_published && (
                                <Link href={`/${page.slug}`} target="_blank">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                            )}

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Bu sayfayı silmek üzeresiniz. Bu işlem geri alınamaz.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>İptal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(page.id)} className="bg-destructive hover:bg-destructive/90">
                                            {deletingId === page.id ? 'Siliniyor...' : 'Sil'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
