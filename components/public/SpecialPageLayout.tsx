'use client'

import { Block } from '@/types'
import { BlockRenderer } from './BlockRenderer'
import Image from 'next/image'
import { popularFonts, getButtonStyle } from '@/lib/theme'
import { Trash2, Move, Share2, FileText, ChevronLeft, Plus, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/provider'
import { motion, AnimatePresence } from 'framer-motion'

interface Profile {
    id: string
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
    tags?: string[] | null
}

interface Page {
    id: string
    title: string
    theme: any
    layout_type: string
}

interface SpecialPageLayoutProps {
    profile: Profile
    page: Page
    blocks: Block[]
    isEditing?: boolean
    onUpdateBlock?: (block: Block) => void
    onDeleteBlock?: (id: string) => void
    onReorderBlocks?: (blocks: Block[]) => void
    onUpdateProfile?: (profile: any) => void
    previewMode?: 'mobile' | 'desktop'
}

export function SpecialPageLayout({
    profile,
    page,
    blocks,
    isEditing = false,
    onUpdateBlock,
    onDeleteBlock,
    onReorderBlocks,
    onUpdateProfile,
    previewMode = 'desktop'
}: SpecialPageLayoutProps) {
    const { t } = useTranslation()
    const theme = page.theme || {}
    const backgroundColor = theme.backgroundColor || '#fdf7f7'
    const textColor = theme.textColor || '#2d2d2d'
    const fontName = theme.font || 'Fraunces'
    const fontFamily = popularFonts.find(f => f.name === fontName)?.family || 'serif'

    const initials = (profile.display_name || profile.username || 'U').charAt(0).toUpperCase()

    // Tags Handling
    const [isAddingTag, setIsAddingTag] = useState(false)
    const [newTag, setNewTag] = useState('')
    const tags = profile.tags || []

    const handleAddTag = async () => {
        if (!newTag.trim()) return
        const updatedTags = [...tags, newTag.trim()]
        if (onUpdateProfile) {
            onUpdateProfile({ ...profile, tags: updatedTags })

            // Sync with DB
            try {
                await fetch('/api/profile', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tags: updatedTags })
                })
            } catch {
                toast.error(t('common.error'))
            }
        }
        setNewTag('')
        setIsAddingTag(false)
    }

    const handleRemoveTag = async (tagToRemove: string) => {
        const updatedTags = tags.filter(t => t !== tagToRemove)
        if (onUpdateProfile) {
            onUpdateProfile({ ...profile, tags: updatedTags })

            // Sync with DB
            try {
                await fetch('/api/profile', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tags: updatedTags })
                })
            } catch {
                toast.error(t('common.error'))
            }
        }
    }

    // Interactive States for Grid
    const [dragging, setDragging] = useState<{ id: string; type: 'resize' | 'move'; axis?: 'x' | 'y'; initialValue?: number; initialMouseX: number; initialMouseY: number; currentIndex?: number } | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const getClientCoords = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        return { x: e.clientX, y: e.clientY }
    }

    // Resize Logic
    const startResize = (e: React.MouseEvent | React.TouchEvent, id: string, axis: 'x' | 'y', initialValue: number) => {
        // Prevent scrolling on mobile while resizing
        if (e.type === 'touchstart') {
            document.body.style.overflow = 'hidden';
        }

        e.stopPropagation();
        const coords = getClientCoords(e);

        setDragging({
            id,
            type: 'resize',
            axis,
            initialValue,
            initialMouseX: coords.x,
            initialMouseY: coords.y
        });
    }

    // Move Logic
    const startMove = (e: React.MouseEvent | React.TouchEvent, id: string, index: number) => {
        if (!isEditing) return;
        if ((e.target as HTMLElement).closest('.action-handle')) return;

        // Prevent scrolling on mobile while dragging
        if (e.type === 'touchstart') {
            document.body.style.overflow = 'hidden';
        }

        const coords = getClientCoords(e);
        setDragging({
            id,
            type: 'move',
            initialMouseX: coords.x,
            initialMouseY: coords.y,
            currentIndex: index
        });
        setDragOverIndex(index);
    }

    useEffect(() => {
        if (!dragging) return;

        const handleMove = (e: MouseEvent | TouchEvent) => {
            // Prevent default behavior if needed (e.g. scroll)
            if (e.cancelable && e.type === 'touchmove') {
                e.preventDefault();
            }

            const coords = getClientCoords(e);

            if (dragging.type === 'resize' && onUpdateBlock) {
                const block = blocks.find(b => b.id === dragging.id);
                if (!block) return;

                const gridElement = gridRef.current;
                if (!gridElement) return;

                const rect = gridElement.getBoundingClientRect();
                const columns = previewMode === 'mobile' ? 2 : 4;
                const cellWidth = rect.width / columns;
                const cellHeight = previewMode === 'mobile' ? 140 : 160;

                const deltaX = coords.x - dragging.initialMouseX;
                const deltaY = coords.y - dragging.initialMouseY;

                const data = (block.data as any) || {};

                if (dragging.axis === 'x') {
                    const step = Math.round(deltaX / cellWidth);
                    let newVal = (dragging.initialValue || 1) + step;
                    newVal = Math.max(1, Math.min(columns, newVal));

                    const key = previewMode === 'mobile' ? 'mobileSpanX' : 'gridSpanX';
                    if (data[key] !== newVal) {
                        onUpdateBlock({ ...block, data: { ...data, [key]: newVal } });
                    }
                } else {
                    const step = Math.round(deltaY / cellHeight);
                    let newVal = (dragging.initialValue || 1) + step;
                    newVal = Math.max(1, Math.min(4, newVal));

                    const key = previewMode === 'mobile' ? 'mobileSpanY' : 'gridSpanY';
                    if (data[key] !== newVal) {
                        onUpdateBlock({ ...block, data: { ...data, [key]: newVal } });
                    }
                }
            }
            else if (dragging.type === 'move') {
                const elements = document.elementsFromPoint(coords.x, coords.y);
                const widgetElement = elements.find(el => el.hasAttribute('data-widget-index'));
                if (widgetElement) {
                    const hoverIndex = parseInt(widgetElement.getAttribute('data-widget-index')!);
                    if (hoverIndex !== dragOverIndex) {
                        setDragOverIndex(hoverIndex);
                    }
                }
            }
        };

        const handleEnd = () => {
            document.body.style.overflow = ''; // Restore scrolling

            if (dragging?.type === 'move' && dragOverIndex !== null && dragging.currentIndex !== undefined && dragging.currentIndex !== dragOverIndex) {
                const newBlocks = [...blocks];
                const [movedBlock] = newBlocks.splice(dragging.currentIndex, 1);
                newBlocks.splice(dragOverIndex, 0, movedBlock);
                onReorderBlocks?.(newBlocks);
            }
            setDragging(null);
            setDragOverIndex(null);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
            document.body.style.overflow = ''; // Ensure overflow restoration on cleanup
        };
    }, [dragging, blocks, onUpdateBlock, onReorderBlocks, previewMode, dragOverIndex]);

    return (
        <div
            className="min-h-full transition-all duration-500 overflow-x-hidden w-full flex flex-col relative"
            style={{ backgroundColor, color: textColor, fontFamily }}
        >
            {/* Top Navigation Row Removed as requested */}

            <div className={`mx-auto w-full ${previewMode === 'mobile' ? 'px-6 pb-12' : 'max-w-[1200px] px-8 py-10 pb-32'}`}>
                <div className={`flex ${previewMode === 'mobile' ? 'flex-col' : 'flex-row gap-12 items-start'}`}>

                    {/* Profile Sidebar - Smaller Size */}
                    <div className={`${previewMode === 'mobile' ? 'w-full mb-12' : 'w-[280px] sticky top-12'}`}>
                        <div className="relative mb-6 group">
                            <div className={`${previewMode === 'mobile' ? 'w-40 h-40 mx-auto' : 'w-52 h-52'} rounded-[2.5rem] overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative transform rotate-1 hover:rotate-0 transition-transform duration-700`}>
                                {profile.avatar_url ? (
                                    <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">{initials}</div>
                                )}
                            </div>
                        </div>

                        <div className={`space-y-5 ${previewMode === 'mobile' ? 'text-center' : ''}`}>
                            <h1 className={`${previewMode === 'mobile' ? 'text-3xl' : 'text-4xl'} font-bold tracking-tight leading-tight mb-3`}>
                                {profile.display_name || profile.username || t('public.not_found')}
                            </h1>

                            {profile.bio && (
                                <div className="space-y-4">
                                    <p className="text-base opacity-80 leading-relaxed font-sans max-w-sm mx-auto lg:mx-0">
                                        {profile.bio}
                                    </p>

                                    {/* Editable Tags */}
                                    <div className={`flex flex-wrap gap-2 ${previewMode === 'mobile' ? 'justify-center' : ''}`}>
                                        {tags.map((tag, i) => (
                                            <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[11px] font-semibold group/tag">
                                                {tag}
                                                {isEditing && (
                                                    <button onClick={() => handleRemoveTag(tag)} className="opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-red-500">
                                                        <X className="h-2.5 w-2.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {isEditing && (
                                            <div className="flex items-center gap-1">
                                                {isAddingTag ? (
                                                    <div className="flex items-center gap-1 bg-white border rounded-full px-2 py-0.5 shadow-sm">
                                                        <input
                                                            autoFocus
                                                            className="text-[11px] outline-none bg-transparent w-20"
                                                            placeholder="..."
                                                            value={newTag}
                                                            onChange={(e) => setNewTag(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                            onBlur={() => !newTag && setIsAddingTag(false)}
                                                        />
                                                        <button onClick={handleAddTag} className="text-primary"><Plus className="h-3 w-3" /></button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsAddingTag(true)}
                                                        className="w-6 h-6 rounded-full border border-dashed border-black/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Share button removed as requested */}
                        </div>
                    </div>

                    {/* Bento Grid */}
                    <div className="flex-1 w-full" ref={gridRef}>
                        <div className={`grid gap-4 ${previewMode === 'mobile' ? 'grid-cols-2 auto-rows-[135px]' : 'grid-cols-4 auto-rows-[160px]'} ${isEditing ? 'border-2 border-dashed border-primary/5 rounded-[2.5rem] p-4 -m-4' : ''}`}>
                            <AnimatePresence>
                                {blocks.map((block, index) => {
                                    const data = (block.data as any) || {}
                                    const spanX = previewMode === 'mobile' ? (data.mobileSpanX || 1) : (data.gridSpanX || 1)
                                    const spanY = previewMode === 'mobile' ? (data.mobileSpanY || 1) : (data.gridSpanY || 1)
                                    const isBeingDragged = dragging?.type === 'move' && dragging.id === block.id;

                                    return (
                                        <motion.div
                                            layout
                                            key={block.id}
                                            data-widget-index={index}
                                            onMouseDown={(e) => startMove(e, block.id, index)}
                                            onTouchStart={(e) => startMove(e, block.id, index)}
                                            className={`group relative ${spanX === 1 ? 'col-span-1' : spanX === 2 ? 'col-span-2' : spanX === 3 ? 'col-span-3' : 'col-span-4'
                                                } ${spanY === 1 ? 'row-span-1' : spanY === 2 ? 'row-span-2' : spanY === 3 ? 'row-span-3' : 'row-span-4'
                                                } ${isBeingDragged ? 'opacity-30 z-50' : 'z-10'} ${dragOverIndex === index && dragging?.type === 'move' && !isBeingDragged ? 'scale-[1.02]' : ''}`}
                                            transition={{
                                                layout: { duration: 0.3, ease: "easeInOut" }
                                            }}
                                        >
                                            <div className={`h-full w-full relative group/widget ${isEditing ? 'hover:z-30 cursor-grab active:cursor-grabbing' : ''}`}>
                                                <div
                                                    className="h-full w-full overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] transition-all duration-300"
                                                    style={{ borderRadius: getButtonStyle(theme.buttonStyle) }}
                                                >
                                                    <BlockRenderer block={block} theme={theme} layoutType="special" />
                                                </div>

                                                {isEditing && (
                                                    <>
                                                        <div
                                                            className="absolute inset-0 border-2 border-transparent group-hover/widget:border-primary/40 pointer-events-none z-20 transition-all"
                                                            style={{ borderRadius: getButtonStyle(theme.buttonStyle) }}
                                                        ></div>

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDeleteBlock?.(block.id); }}
                                                            className={`absolute -top-3 -right-3 p-2 bg-black text-white rounded-full transition-all z-40 border-2 border-white hover:bg-red-500 action-handle shadow-lg ${previewMode === 'mobile' ? 'opacity-100' : 'opacity-0 group-hover/widget:opacity-100'}`}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>

                                                        {/* Resize Handles - Right */}
                                                        <div
                                                            onMouseDown={(e) => startResize(e, block.id, 'x', spanX)}
                                                            onTouchStart={(e) => startResize(e, block.id, 'x', spanX)}
                                                            className={`absolute top-1/2 -right-2 -translate-y-1/2 w-6 h-10 flex items-center justify-center cursor-ew-resize z-40 action-handle ${previewMode === 'mobile' ? 'opacity-100' : 'opacity-0 group-hover/widget:opacity-100'}`}
                                                        >
                                                            <div className="w-2.5 h-2.5 bg-white border-2 border-primary rounded-full shadow-md"></div>
                                                        </div>

                                                        {/* Resize Handles - Left */}
                                                        <div
                                                            onMouseDown={(e) => startResize(e, block.id, 'x', spanX)}
                                                            onTouchStart={(e) => startResize(e, block.id, 'x', spanX)}
                                                            className={`absolute top-1/2 -left-2 -translate-y-1/2 w-6 h-10 flex items-center justify-center cursor-ew-resize z-40 action-handle ${previewMode === 'mobile' ? 'opacity-100' : 'opacity-0 group-hover/widget:opacity-100'}`}
                                                        >
                                                            <div className="w-2.5 h-2.5 bg-white border-2 border-primary rounded-full shadow-md"></div>
                                                        </div>

                                                        {/* Resize Handles - Bottom */}
                                                        <div
                                                            onMouseDown={(e) => startResize(e, block.id, 'y', spanY)}
                                                            onTouchStart={(e) => startResize(e, block.id, 'y', spanY)}
                                                            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-6 flex items-center justify-center cursor-ns-resize z-40 action-handle ${previewMode === 'mobile' ? 'opacity-100' : 'opacity-0 group-hover/widget:opacity-100'}`}
                                                        >
                                                            <div className="w-2.5 h-2.5 bg-white border-2 border-primary rounded-full shadow-md"></div>
                                                        </div>

                                                        {/* Resize Handles - Top */}
                                                        <div
                                                            onMouseDown={(e) => startResize(e, block.id, 'y', spanY)}
                                                            onTouchStart={(e) => startResize(e, block.id, 'y', spanY)}
                                                            className={`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-6 flex items-center justify-center cursor-ns-resize z-40 action-handle ${previewMode === 'mobile' ? 'opacity-100' : 'opacity-0 group-hover/widget:opacity-100'}`}
                                                        >
                                                            <div className="w-2.5 h-2.5 bg-white border-2 border-primary rounded-full shadow-md"></div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
