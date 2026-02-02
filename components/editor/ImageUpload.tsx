'use client'

import { useState, useRef } from 'react'
import { useTranslation } from '@/lib/i18n/provider'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const { t } = useTranslation()
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error(t('editor.upload.invalid_file'))
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (data.url) {
                onChange(data.url)
                toast.success(t('editor.upload.success'))
            } else {
                throw new Error(data.error || t('editor.upload.failed'))
            }
        } catch (error: any) {
            toast.error(error.message || t('common.error'))
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-2">
            {label && <label className="text-[10px] uppercase font-bold text-muted-foreground">{label}</label>}

            <div className="flex gap-4 items-center">
                {value ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                        <Image src={value} alt="Preview" fill className="object-cover" />
                        <button
                            onClick={() => onChange('')}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all"
                    >
                        {uploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground mt-1">{t('common.preview')}</span>
                            </>
                        )}
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    <p className="text-[10px] text-muted-foreground italic">Veya direkt URL girin:</p>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://..."
                        className="w-full text-xs p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
            />
        </div>
    )
}
