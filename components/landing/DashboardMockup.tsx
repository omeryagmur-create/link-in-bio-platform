'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    GripVertical,
    Link as LinkIcon,
    Image as ImageIcon,
    Video as VideoIcon,
    Type,
    Plus,
    Layout,
    Palette,
    MousePointer2,
    Check
} from 'lucide-react'

const THEMES = [
    { id: 'indigo', primary: '#6366f1', secondary: '#4f46e5', bg: 'bg-indigo-500/10' },
    { id: 'rose', primary: '#f43f5e', secondary: '#e11d48', bg: 'bg-rose-500/10' },
    { id: 'amber', primary: '#f59e0b', secondary: '#d97706', bg: 'bg-amber-500/10' },
    { id: 'emerald', primary: '#10b981', secondary: '#059669', bg: 'bg-emerald-500/10' },
    { id: 'violet', primary: '#8b5cf6', secondary: '#7c3aed', bg: 'bg-violet-500/10' },
]

const BLOCKS = [
    { id: '1', type: 'link', title: 'Latest Video', icon: VideoIcon },
    { id: '2', type: 'link', title: 'My Shop', icon: LinkIcon },
    { id: '3', type: 'link', title: 'Podcast', icon: LinkIcon },
]

export function DashboardMockup() {
    const [activeTheme, setActiveTheme] = useState(THEMES[0])
    const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

    return (
        <div className="w-full h-full bg-[#0a0a0b] flex flex-col md:flex-row overflow-hidden border border-white/10 shadow-2xl rounded-2xl">
            {/* Sidebar / Editor Area */}
            <div className="w-full md:w-[320px] border-r border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col gap-8">
                {/* Header Sim */}
                <div className="flex items-center gap-2 opacity-50 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>

                {/* Blocks Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-white/50 mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest">Blocks</span>
                        <Plus className="w-4 h-4" />
                    </div>
                    <div className="space-y-3">
                        {BLOCKS.map((block) => (
                            <motion.div
                                key={block.id}
                                className="group flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl cursor-default"
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                onHoverStart={() => setHoveredBlock(block.id)}
                                onHoverEnd={() => setHoveredBlock(null)}
                            >
                                <GripVertical className="w-4 h-4 text-white/20" />
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <block.icon className="w-4 h-4 text-white/60" />
                                </div>
                                <span className="text-sm font-medium text-white/80">{block.title}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Theme Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/50 mb-2">
                        <Palette className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Appearance</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setActiveTheme(theme)}
                                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${activeTheme.id === theme.id ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                                    }`}
                                style={{ backgroundColor: theme.primary }}
                            >
                                {activeTheme.id === theme.id && <Check className="w-4 h-4 text-white" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 opacity-30 select-none">
                    <div className="flex items-center gap-2 mb-4">
                        <Layout className="w-4 h-4" />
                        <span className="text-xs">Layout: Classic</span>
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-[#121214] relative flex items-center justify-center p-8 overflow-hidden group">
                {/* Abstract Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
                    <div
                        className="absolute inset-0 transition-colors duration-700"
                        style={{ background: `radial-gradient(circle at center, ${activeTheme.primary}44, transparent 70%)` }}
                    />
                </div>

                {/* Phone Container */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative w-[280px] h-[560px] bg-black rounded-[3rem] border-8 border-[#1a1a1c] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                >
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1c] rounded-b-2xl z-20" />

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center pt-12 p-6 gap-6 relative overflow-hidden">
                        {/* Dynamic Background in Phone */}
                        <div
                            className="absolute inset-0 opacity-10 transition-colors duration-700"
                            style={{ backgroundColor: activeTheme.primary }}
                        />

                        {/* Profile Header */}
                        <div className="flex flex-col items-center gap-4 relative z-10 w-full">
                            <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 relative group">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-white font-bold text-lg">Alex Chen</h3>
                                <p className="text-white/50 text-xs">Digital Creator</p>
                            </div>
                        </div>

                        {/* Blocks */}
                        <div className="w-full space-y-3 relative z-10">
                            {BLOCKS.map((block) => (
                                <motion.div
                                    key={block.id}
                                    className="w-full p-4 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-all"
                                    animate={{
                                        backgroundColor: activeTheme.secondary,
                                        scale: hoveredBlock === block.id ? 1.05 : 1,
                                        boxShadow: hoveredBlock === block.id ? `0 10px 20px ${activeTheme.primary}44` : '0 4px 6px rgba(0,0,0,0.2)'
                                    }}
                                    style={{ color: '#fff' }}
                                >
                                    {block.title}
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto w-full flex justify-center gap-4 py-4 relative z-10 opacity-60">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <VideoIcon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Floating Cursor Simulation (Optional, but adds to "interactive" request) */}
                <motion.div
                    className="absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                        x: hoveredBlock ? 80 : 0,
                        y: hoveredBlock ? -100 : 0,
                    }}
                >
                    <MousePointer2 className="w-6 h-6 text-white shadow-lg" fill="white" />
                </motion.div>
            </div>
        </div>
    )
}
