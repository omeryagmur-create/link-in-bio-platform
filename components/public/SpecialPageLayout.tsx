'use client'

import { Block } from '@/types'
import { BlockRenderer } from './BlockRenderer'
import Image from 'next/image'
import { popularFonts, getButtonStyle } from '@/lib/theme'
import { Trash2, Move, Share2, FileText, ChevronLeft, Plus, X, Scaling, Check, ArrowRight, Expand } from 'lucide-react'
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

    // Interaction States
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [resizingBlockId, setResizingBlockId] = useState<string | null>(null);
    const [dragging, setDragging] = useState<{ id: string; type: 'resize' | 'move'; axis?: 'x' | 'y'; initialValue?: number; initialMouseX: number; initialMouseY: number; currentIndex?: number } | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Helpers
    const getClientCoords = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        return { x: e.clientX, y: e.clientY }
    }

    // Resize Start
    const startResize = (e: React.MouseEvent | React.TouchEvent, id: string, axis: 'x' | 'y', initialValue: number) => {
        if (e.type === 'touchstart') document.body.style.overflow = 'hidden';
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


    // Move Start
    const startMove = (e: React.MouseEvent | React.TouchEvent, id: string, index: number) => {
        if (!isEditing) return;
        if (resizingBlockId) return; // Don't move while resizing

        if (e.type === 'touchstart') document.body.style.overflow = 'hidden';

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
            if (e.cancelable && e.type === 'touchmove') e.preventDefault();
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
                    // Live reorder: immediately swap positions as user drags
                    if (hoverIndex !== dragOverIndex && hoverIndex >= 0 && hoverIndex < blocks.length && dragging.currentIndex !== undefined) {
                        // Perform live reorder
                        const newBlocks = [...blocks];
                        const [movedBlock] = newBlocks.splice(dragging.currentIndex, 1);
                        newBlocks.splice(hoverIndex, 0, movedBlock);

                        // Update blocks immediately
                        onReorderBlocks?.(newBlocks);

                        // Update currentIndex to new position
                        setDragging({
                            ...dragging,
                            currentIndex: hoverIndex
                        });
                        setDragOverIndex(hoverIndex);
                    }
                }
            }
        };

        const handleEnd = () => {
            document.body.style.overflow = '';
            // No need to reorder here anymore, it's done during drag
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
            document.body.style.overflow = '';
        };
    }, [dragging, blocks, onUpdateBlock, onReorderBlocks, previewMode, dragOverIndex]);

    return (
        <div
            className="min-h-full transition-all duration-500 overflow-x-hidden w-full flex flex-col relative"
            style={{ backgroundColor, color: textColor, fontFamily }}
            onClick={() => {
                setActiveBlockId(null);
                // Only clear resizing if explicitly cancelled? Or standard behavior
                // User said "confirm button to stop". So clicking background shouldn't stop it maybe?
                // Let's keep resizing active until check is pressed.
            }}
        >
            <div className={`mx-auto w-full ${previewMode === 'mobile' ? 'px-6 pb-12' : 'max-w-[1200px] px-8 py-10 pb-32'}`}>
                <div className={`flex ${previewMode === 'mobile' ? 'flex-col' : 'flex-row gap-12 items-start'}`}>

                    {/* Profile Section */}
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
                                                    <button onClick={() => setIsAddingTag(true)} className="w-6 h-6 rounded-full border border-dashed border-black/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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

                                    const isResizing = resizingBlockId === block.id;
                                    const isActive = activeBlockId === block.id;
                                    const isBeingDragged = dragging?.type === 'move' && dragging.id === block.id;

                                    return (
                                        <motion.div
                                            layout
                                            key={block.id}
                                            data-widget-index={index}
                                            onClick={(e) => {
                                                if (isEditing) {
                                                    e.stopPropagation();
                                                    // If we are already resizing another block, maybe switch?
                                                    // User said: Click -> Option "Change Size" -> Click that -> Enable Resize
                                                    if (!isResizing) {
                                                        setActiveBlockId(block.id);
                                                    }
                                                }
                                            }}
                                            className={`group relative ${spanX === 1 ? 'col-span-1' : spanX === 2 ? 'col-span-2' : spanX === 3 ? 'col-span-3' : 'col-span-4'
                                                } ${spanY === 1 ? 'row-span-1' : spanY === 2 ? 'row-span-2' : spanY === 3 ? 'row-span-3' : 'row-span-4'
                                                } ${isBeingDragged ? 'opacity-30 z-50' : 'z-10'} ${dragOverIndex === index && dragging?.type === 'move' && !isBeingDragged ? 'scale-[1.02]' : ''}`}
                                            transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                                        >
                                            <div className={`h-full w-full relative group/widget`}>
                                                <div
                                                    className="h-full w-full overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] transition-all duration-300"
                                                    style={{
                                                        borderRadius: getButtonStyle(theme.buttonStyle),
                                                        border: (isActive || isResizing) ? '2px solid var(--primary)' : undefined
                                                    }}
                                                >
                                                    <BlockRenderer block={block} theme={theme} layoutType="special" />

                                                    {isEditing && !isResizing && (
                                                        // Only allow dragging if NOT resizing
                                                        <div
                                                            className="absolute inset-0 cursor-move z-10"
                                                            onMouseDown={(e) => startMove(e, block.id, index)}
                                                            onTouchStart={(e) => startMove(e, block.id, index)}
                                                        />
                                                    )}
                                                </div>

                                                {isEditing && (
                                                    <>
                                                        {/* Active State Controls (When clicked but not resizing) */}
                                                        {isActive && !isResizing && (
                                                            <div className="absolute -top-3 right-2 z-50 flex gap-2 animate-in fade-in zoom-in duration-200">

                                                                {/* Move Handle (Explicit) - Primary for reordering */}
                                                                <div
                                                                    className="bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-black/5 action-handle"
                                                                    onMouseDown={(e) => { e.stopPropagation(); startMove(e, block.id, index); }}
                                                                    onTouchStart={(e) => { e.stopPropagation(); startMove(e, block.id, index); }}
                                                                    title={t('editor.blocks.move') || 'Move'}
                                                                >
                                                                    <Move className="w-4 h-4" />
                                                                </div>

                                                                {/* Resize Toggle */}
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setResizingBlockId(block.id); setActiveBlockId(block.id); }}
                                                                    className="bg-primary text-white p-2 rounded-full shadow-lg hover:brightness-110 transition-all action-handle"
                                                                    title={t('editor.blocks.resize') || 'Resize'}
                                                                >
                                                                    <Scaling className="w-4 h-4" />
                                                                </button>

                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onDeleteBlock?.(block.id); }}
                                                                    className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-red-500 transition-colors action-handle"
                                                                    title={t('common.delete') || 'Delete'}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Resize Confirmation (Only when resizing) */}
                                                        {isResizing && (
                                                            <div className="absolute -top-4 right-0 left-0 z-50 flex justify-center">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setResizingBlockId(null); setActiveBlockId(null); }}
                                                                    className="bg-green-500 text-white text-xs px-4 py-1.5 rounded-full shadow-xl font-bold flex items-center gap-1 hover:scale-105 transition-transform action-handle animate-in fade-in zoom-in"
                                                                >
                                                                    <Check className="w-3 h-3" /> {t('common.done') || 'Done'}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Resize Handles (Only when resizing) */}
                                                        {isResizing && (
                                                            <>
                                                                <div onMouseDown={(e) => startResize(e, block.id, 'x', spanX)} onTouchStart={(e) => startResize(e, block.id, 'x', spanX)} className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-ew-resize z-50 action-handle bg-white rounded-full shadow-md border-2 border-primary hover:scale-110 transition-transform">
                                                                    <ArrowRight className="w-4 h-4 text-primary" />
                                                                </div>
                                                                <div onMouseDown={(e) => startResize(e, block.id, 'y', spanY)} onTouchStart={(e) => startResize(e, block.id, 'y', spanY)} className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center cursor-ns-resize z-50 action-handle bg-white rounded-full shadow-md border-2 border-primary hover:scale-110 transition-transform rotate-90">
                                                                    <ArrowRight className="w-4 h-4 text-primary" />
                                                                </div>
                                                            </>
                                                        )}
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
