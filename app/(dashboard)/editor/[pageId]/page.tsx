'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/provider'
// Force redeploy trigger
import { BlockEditor } from '@/components/editor/BlockEditor'

export default function EditorPage() {
    const params = useParams()
    const pageId = params.pageId as string
    const supabase = createClient()
    const { t } = useTranslation()
    const [page, setPage] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPageData = async () => {
            // Fetch Page
            const { data: pageData, error: pageError } = await supabase
                .from('pages')
                .select('*')
                .eq('id', pageId)
                .single()

            if (pageError) {
                toast.error(t('common.error'))
                setLoading(false)
                return
            }
            setPage(pageData)

            // Fetch Profile
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(profileData)
            }

            setLoading(false)
        }

        fetchPageData()
    }, [pageId, supabase, t])

    const [isPublishing, setIsPublishing] = useState(false)
    const [isUnpublishing, setIsUnpublishing] = useState(false)
    const [internalSaving, setInternalSaving] = useState(false)

    const handleUnpublish = async () => {
        setIsUnpublishing(true)
        try {
            const res = await fetch(`/api/pages/${pageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_published: false })
            })
            if (!res.ok) throw new Error()
            setPage({ ...page, is_published: false })
            toast.success(t('common.success'))
        } catch {
            toast.error(t('common.error'))
        } finally {
            setIsUnpublishing(false)
        }
    }

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            const res = await fetch(`/api/pages/${pageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_published: true })
            })
            if (!res.ok) throw new Error()
            setPage({ ...page, is_published: true })
            toast.success(t('common.success'))
        } catch {
            toast.error(t('common.error'))
        } finally {
            setIsPublishing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!page) {
        return <div>{t('public.not_found')}</div>
    }

    const previewUrl = profile?.username ? `/${profile.username}` : `/${page.slug}`

    return (
        <div className="flex h-screen flex-col">
            <header className="flex h-14 items-center justify-between border-b px-4 bg-background">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-semibold">{page.title}</h1>
                            {!page.is_published && (
                                <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase">{t('dashboard.status_draft')}</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">{previewUrl}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {page.is_published && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUnpublish}
                            disabled={isUnpublishing || internalSaving}
                            className="h-8 border-slate-200"
                        >
                            {isUnpublishing ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                            {isUnpublishing ? t('common.unpublishing') : t('common.unpublish')}
                        </Button>
                    )}
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handlePublish}
                        disabled={isPublishing || internalSaving || (page.is_published && !internalSaving)}
                        className={`${page.is_published && !internalSaving ? 'bg-emerald-600 hover:bg-emerald-700' : ''} h-8 min-w-[100px]`}
                    >
                        {isPublishing || internalSaving ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        ) : page.is_published ? (
                            <Save className="w-3 h-3 mr-2" />
                        ) : null}
                        {internalSaving ? t('common.saving') : page.is_published ? t('common.updated') : t('common.publish')}
                    </Button>
                    <Link href={previewUrl} target='_blank'>
                        <Button variant="outline" size="sm" className="h-8 border-slate-200">{t('common.preview')}</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                <BlockEditor
                    pageId={pageId}
                    initialTheme={page.theme}
                    profile={profile}
                    onProfileUpdate={setProfile}
                    layoutType={page.layout_type}
                    onLayoutChange={(newLayout) => setPage({ ...page, layout_type: newLayout })}
                    onSavingChange={setInternalSaving}
                />
            </main>
        </div>
    )
}
