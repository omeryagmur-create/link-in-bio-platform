'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImageUpload } from './ImageUpload'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

interface ProfileEditorProps {
    profile: any
    onUpdate: (profile: any) => void
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
    const { t } = useTranslation()
    const [data, setData] = useState({
        display_name: profile?.display_name || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
    })
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error(t('common.error'))

            const updated = await res.json()
            onUpdate(updated)
            toast.success(t('common.success'))
        } catch (error: any) {
            toast.error(t('common.error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 pt-2">
            <div className="flex flex-col items-center mb-6">
                <ImageUpload
                    value={data.avatar_url}
                    onChange={(url) => setData({ ...data, avatar_url: url })}
                    label={t('editor.tabs.profile')}
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="display_name" className="text-xs uppercase font-bold text-muted-foreground">{t('common.name')}</Label>
                    <Input
                        id="display_name"
                        placeholder={t('common.name')}
                        value={data.display_name}
                        onChange={(e) => setData({ ...data, display_name: e.target.value })}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-xs uppercase font-bold text-muted-foreground">{t('editor.profile.bio')}</Label>
                    <Textarea
                        id="bio"
                        placeholder={t('editor.profile.bio')}
                        value={data.bio}
                        onChange={(e) => setData({ ...data, bio: e.target.value })}
                        className="min-h-[100px]"
                    />
                </div>
            </div>

            <Button className="w-full" onClick={handleSave} disabled={loading}>
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                {t('common.save')}
            </Button>
        </div>
    )
}
