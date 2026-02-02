import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

export interface ThemeConfig {
    backgroundColor: string
    textColor: string
    buttonColor: string
    buttonTextColor: string
    font: string
    buttonStyle: 'rounded' | 'sharp' | 'pill' | 'soft'
}

export const defaultTheme: ThemeConfig = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#000000',
    buttonTextColor: '#ffffff',
    font: 'Inter',
    buttonStyle: 'rounded'
}

export const popularFonts = [
    { name: 'Inter', family: 'Inter, sans-serif' },
    { name: 'Poppins', family: 'Poppins, sans-serif' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif' },
    { name: 'Outfit', family: 'Outfit, sans-serif' },
    { name: 'Sora', family: 'Sora, sans-serif' },
    { name: 'Syne', family: 'Syne, sans-serif' },
    { name: 'Playfair Display', family: 'Playfair Display, serif' },
    { name: 'Bricolage Grotesque', family: 'Bricolage Grotesque, sans-serif' },
    { name: 'Space Grotesk', family: 'Space Grotesk, sans-serif' },
    { name: 'Fraunces', family: 'Fraunces, serif' },
]

export const getButtonStyle = (style: string) => {
    switch (style) {
        case 'sharp': return '0px'
        case 'pill': return '9999px'
        case 'soft': return '16px'
        case 'rounded':
        default: return '8px'
    }
}

export const getBlockStyle = (block: any, theme: ThemeConfig) => {
    const data = block.data || {}
    return {
        backgroundColor: data.backgroundColor || theme.buttonColor,
        textColor: data.textColor || theme.buttonTextColor,
        borderRadius: getButtonStyle(theme.buttonStyle),
        fontFamily: popularFonts.find(f => f.name === theme.font)?.family || 'sans-serif'
    }
}

export const themePresets = [
    {
        name: 'editor.theme.presets_list.classic',
        theme: defaultTheme
    },
    {
        name: 'editor.theme.presets_list.dark',
        theme: {
            backgroundColor: '#09090b',
            textColor: '#fafafa',
            buttonColor: '#fafafa',
            buttonTextColor: '#09090b',
            font: 'Inter',
            buttonStyle: 'rounded'
        }
    },
    {
        name: 'editor.theme.presets_list.ocean',
        theme: {
            backgroundColor: '#f0f9ff',
            textColor: '#0c4a6e',
            buttonColor: '#0284c7',
            buttonTextColor: '#ffffff',
            font: 'Poppins',
            buttonStyle: 'pill'
        }
    },
    {
        name: 'editor.theme.presets_list.modern_soft',
        theme: {
            backgroundColor: '#fafaf9',
            textColor: '#1c1917',
            buttonColor: '#1c1917',
            buttonTextColor: '#ffffff',
            font: 'Outfit',
            buttonStyle: 'soft'
        }
    },
    {
        name: 'editor.theme.presets_list.luxury',
        theme: {
            backgroundColor: '#1a1a1a',
            textColor: '#d4af37',
            buttonColor: '#d4af37',
            buttonTextColor: '#1a1a1a',
            font: 'Playfair Display',
            buttonStyle: 'sharp'
        }
    }
]
