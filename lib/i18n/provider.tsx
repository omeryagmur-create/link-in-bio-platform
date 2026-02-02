'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import tr from './dictionaries/tr.json'
import en from './dictionaries/en.json'
import ru from './dictionaries/ru.json'
import de from './dictionaries/de.json'

type Language = 'tr' | 'en' | 'ru' | 'de'

const dictionaries = {
    tr,
    en,
    ru,
    de,
}

type Dictionary = typeof tr

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr')

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang && dictionaries[savedLang]) {
            setLanguage(savedLang)
        }
    }, [])

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('language', lang)
    }

    // Simple nested key accessor (e.g., "common.save")
    const t = (path: string): string => {
        const keys = path.split('.')
        let result: any = dictionaries[language]

        for (const key of keys) {
            if (result && result[key]) {
                result = result[key]
            } else {
                return path // Fallback to key name if not found
            }
        }

        return typeof result === 'string' ? result : path
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider')
    }
    return context
}
