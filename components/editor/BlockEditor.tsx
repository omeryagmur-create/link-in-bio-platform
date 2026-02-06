'use client'

import { useState, useEffect } from 'react'
import { Block } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Smartphone, Monitor, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DraggableBlock } from '@/components/editor/DraggableBlock'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeCustomizer } from '@/components/editor/ThemeCustomizer'
import { ThemeConfig, defaultTheme, popularFonts } from '@/lib/theme'
import { BlockRenderer } from '@/components/public/BlockRenderer'
import { AddBlockDialog } from '@/components/editor/AddBlockDialog'
import { ProfileEditor } from '@/components/editor/ProfileEditor'
import { SeoSettings } from '@/components/editor/SeoSettings'
import Image from 'next/image'
import { SpecialPageLayout } from '@/components/public/SpecialPageLayout'
import { useTranslation } from '@/lib/i18n/provider'

interface BlockEditorProps {
    pageId: string
    initialTheme: ThemeConfig | null
    profile: any
    onProfileUpdate: (profile: any) => void
    layoutType: 'classic' | 'special'
    onLayoutChange: (layout: 'classic' | 'special') => void
    onSavingChange?: (isSaving: boolean) => void
}

export function BlockEditor({ pageId, initialTheme, profile, onProfileUpdate, layoutType, onLayoutChange, onSavingChange }: BlockEditorProps) {
    const { t } = useTranslation()
    const [blocks, setBlocks] = useState<Block[]>([])
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
    const [theme, setTheme] = useState<ThemeConfig>({
        ...defaultTheme,
        ...(initialTheme || {})
    })
    const [loading, setLoading] = useState(true)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const res = await fetch(`/api/blocks?pageId=${pageId}`)
                const data = await res.json()
                if (Array.isArray(data)) {
                    setBlocks(data)
                }
            } catch {
                toast.error(t('common.error'))
            } finally {
                setLoading(false)
            }
        }

        fetchBlocks()
    }, [pageId, t])

    const handleThemeChange = async (newTheme: ThemeConfig) => {
        setTheme(newTheme)
        onSavingChange?.(true)
        try {
            await fetch(`/api/pages/${pageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme })
            })
            // Revalidate public page
            const identifier = profile?.username || pageId
            await fetch('/api/revalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: `/${identifier}` })
            })
        } catch {
            toast.error(t('editor.theme.title') + ' ' + t('common.error'))
        } finally {
            onSavingChange?.(false)
        }
    }

    const handleLayoutChangeLocal = async (newLayout: 'classic' | 'special') => {
        onSavingChange?.(true)
        try {
            const res = await fetch(`/api/pages/${pageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ layout_type: newLayout })
            })

            if (res.status === 403) {
                const data = await res.json()
                toast.error(data.error)
                return
            }

            if (!res.ok) throw new Error()

            onLayoutChange(newLayout)
            toast.success(t('common.updated'))

            // Revalidate public page
            const identifier = profile?.username || pageId
            await fetch('/api/revalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: `/${identifier}` })
            })
        } catch {
            toast.error(t('common.error'))
        } finally {
            onSavingChange?.(false)
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)

                const newItems = arrayMove(items, oldIndex, newIndex)
                syncOrder(newItems)
                return newItems
            })
        }
    }

    const syncOrder = async (items: Block[]) => {
        const updates = items.map((item, index) => ({
            id: item.id,
            position: index
        }))

        try {
            await fetch('/api/blocks/reorder', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates })
            })
        } catch {
            toast.error(t('common.error'))
        }
    }

    const handleAddBlock = (newBlock: Block) => {
        setBlocks([...blocks, newBlock])
    }

    const handleDeleteBlock = async (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id))
        try {
            await fetch(`/api/blocks/${id}`, { method: 'DELETE' })
        } catch {
            toast.error(t('common.error'))
        }
    }

    const handleUpdateBlock = (updatedBlock: Block) => {
        setBlocks(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b))
    }

    const handleUpdateBlockWithSync = async (updatedBlock: Block) => {
        handleUpdateBlock(updatedBlock)
        try {
            const res = await fetch(`/api/blocks/${updatedBlock.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: updatedBlock.data })
            })
            if (!res.ok) throw new Error()
        } catch {
            toast.error(t('common.error'))
        }
    }

    const initials = (profile?.display_name || profile?.username || 'U').charAt(0).toUpperCase()

    return (
        <div className="flex h-full">
            <div className="w-full max-w-md border-r bg-muted/10 p-4 overflow-y-auto">
                <Tabs defaultValue="blocks" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="profile" className="text-xs">{t('editor.tabs.profile')}</TabsTrigger>
                        <TabsTrigger value="blocks" className="text-xs">{t('editor.tabs.content')}</TabsTrigger>
                        <TabsTrigger value="theme" className="text-xs">{t('editor.tabs.theme')}</TabsTrigger>
                        <TabsTrigger value="seo" className="text-xs">{t('editor.tabs.seo')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <ProfileEditor profile={profile} onUpdate={onProfileUpdate} />
                    </TabsContent>

                    <TabsContent value="blocks">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-semibold">{t('editor.tabs.content')}</h2>
                            <AddBlockDialog pageId={pageId} onBlockAdded={handleAddBlock} />
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={blocks.map(b => b.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {blocks.map((block) => (
                                        <DraggableBlock
                                            key={block.id}
                                            block={block}
                                            onDelete={handleDeleteBlock}
                                            onUpdate={handleUpdateBlock}
                                            layoutType={layoutType}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        {blocks.length === 0 && !loading && (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                {t('editor.blocks.empty')}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="theme">
                        <ThemeCustomizer
                            theme={theme}
                            onChange={handleThemeChange}
                            layoutType={layoutType}
                            onLayoutChange={handleLayoutChangeLocal}
                            subscriptionTier={profile?.subscription_tier || 'free'}
                        />
                    </TabsContent>

                    <TabsContent value="seo">
                        <SeoSettings pageId={pageId} />
                    </TabsContent>
                </Tabs>
            </div>

            <div className="flex-1 bg-gray-100 flex flex-col items-center p-4 relative overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex bg-white rounded-full shadow-sm p-1 z-30">
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
                        title={t('editor.preview.mobile')}
                    >
                        <Smartphone className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
                        title={t('editor.preview.desktop')}
                    >
                        <Monitor className="h-4 w-4" />
                    </button>
                </div>

                <div className={`transition-all duration-700 flex flex-col items-center ${previewMode === 'mobile'
                    ? 'h-[740px] w-[360px] mockup-phone border-gray-800 bg-gray-800 rounded-[3rem] p-2 shadow-2xl scale-[0.8] justify-center mt-[-60px]'
                    : 'w-full flex items-center justify-center pt-8 scale-[0.45] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] 2xl:scale-[0.9] origin-top'
                    } relative`}>

                    {previewMode === 'mobile' ? (
                        <>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-20"></div>
                            <div
                                className="h-full w-full overflow-hidden flex flex-col relative z-10 transition-colors duration-300 rounded-[2.5rem]"
                                style={{
                                    backgroundColor: theme.backgroundColor,
                                    color: theme.textColor,
                                    fontFamily: popularFonts.find(f => f.name === theme.font)?.family || 'sans-serif'
                                }}
                            >
                                <div className="flex-1 overflow-y-auto scrollbar-hide">
                                    {layoutType === 'special' ? (
                                        <SpecialPageLayout
                                            profile={profile}
                                            page={{ id: pageId, title: '', theme, layout_type: 'special' }}
                                            blocks={blocks}
                                            isEditing={true}
                                            onUpdateBlock={handleUpdateBlockWithSync}
                                            onDeleteBlock={handleDeleteBlock}
                                            onReorderBlocks={setBlocks}
                                            onUpdateProfile={onProfileUpdate}
                                            previewMode="mobile"
                                        />
                                    ) : (
                                        <div className="p-4">
                                            <div className="flex flex-col items-center pt-8 mb-6 text-center">
                                                <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 overflow-hidden border-2 border-white/20 relative shadow-sm">
                                                    {profile?.avatar_url ? (
                                                        <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold text-xl">{initials}</div>
                                                    )}
                                                </div>
                                                <h2 className="text-lg font-bold mb-1">{profile?.display_name || profile?.username || t('public.not_found')}</h2>
                                                {profile?.bio && <p className="text-xs opacity-70 max-w-[400px]">{profile.bio}</p>}
                                            </div>
                                            <div className="mx-auto space-y-3 w-full">
                                                {blocks.map(block => <BlockRenderer key={block.id} block={block} theme={theme} />)}
                                            </div>
                                            <div className="mt-12 text-center text-[10px] opacity-50 pb-8">
                                                <p>{t('public.powered_by')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            {/* Improved Monitor Mockup */}
                            <div className="w-[1280px] aspect-video bg-[#1a1a1a] rounded-[40px] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.3)] border-[12px] border-[#2a2a2a] relative ring-1 ring-white/10">
                                {/* Browser Header */}
                                <div className="w-full h-10 bg-[#f1f3f4] rounded-t-[12px] flex items-center px-4 gap-3 border-b border-black/10">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#ffbc2e]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                                    </div>
                                    <div className="flex-1 max-w-md mx-auto bg-white h-7 px-4 rounded-md flex items-center gap-2 border border-black/5 shadow-sm">
                                        <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                                        <div className="w-48 h-2.5 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="w-16"></div> {/* Spacer for balance */}
                                </div>

                                {/* Content Area */}
                                <div className="w-full h-[calc(100%-40px)] overflow-hidden bg-white rounded-b-[12px]">
                                    <div
                                        className="h-full w-full overflow-y-auto"
                                        style={{
                                            backgroundColor: theme.backgroundColor,
                                            color: theme.textColor,
                                            fontFamily: popularFonts.find(f => f.name === theme.font)?.family || 'sans-serif'
                                        }}
                                    >
                                        {layoutType === 'special' ? (
                                            <SpecialPageLayout
                                                profile={profile}
                                                page={{ id: pageId, title: '', theme, layout_type: 'special' }}
                                                blocks={blocks}
                                                isEditing={true}
                                                onUpdateBlock={handleUpdateBlockWithSync}
                                                onDeleteBlock={handleDeleteBlock}
                                                onReorderBlocks={setBlocks}
                                                onUpdateProfile={onProfileUpdate}
                                                previewMode="desktop"
                                            />
                                        ) : (
                                            <div className="p-8">
                                                <div className="flex flex-col items-center pt-12 mb-10 text-center">
                                                    <div className="w-52 h-52 rounded-[2.5rem] mb-6 overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative transform rotate-1">
                                                        {profile?.avatar_url ? (
                                                            <Image src={profile.avatar_url} alt={profile.display_name || 'Profile'} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-4xl">{initials}</div>
                                                        )}
                                                    </div>
                                                    <h2 className="text-4xl font-bold mb-3 tracking-tight">{profile?.display_name || profile?.username || t('public.not_found')}</h2>
                                                    {profile?.bio && <p className="text-base opacity-80 max-w-[600px] leading-relaxed">{profile.bio}</p>}
                                                </div>

                                                <div className="mx-auto space-y-4 max-w-[640px]">
                                                    {blocks.map(block => (
                                                        <BlockRenderer
                                                            key={block.id}
                                                            block={block}
                                                            theme={theme}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="mt-16 text-center text-xs opacity-50 pb-12">
                                                    <p>{t('public.powered_by')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stand */}
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-2xl shadow-lg -mt-1"></div>
                                <div className="w-80 h-3 bg-slate-800 rounded-full shadow-xl"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
