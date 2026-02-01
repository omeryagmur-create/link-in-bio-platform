'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImageUpload } from './ImageUpload'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

interface ProfileEditorProps {
    profile: any
    onUpdate: (profile: any) => void
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
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

            if (!res.ok) throw new Error('Failed to update profile')

            const updated = await res.json()
            onUpdate(updated)
            toast.success('Profil güncellendi')
        } catch (error: any) {
            toast.error(error.message || 'Hata oluştu')
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
                    label="Profil Fotoğrafı"
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="display_name" className="text-xs uppercase font-bold text-muted-foreground">İsim</Label>
                    <Input
                        id="display_name"
                        placeholder="Görünen İsim"
                        value={data.display_name}
                        onChange={(e) => setData({ ...data, display_name: e.target.value })}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-xs uppercase font-bold text-muted-foreground">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Kendinden bahset..."
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
                Profili Kaydet
            </Button>
        </div>
    )
}
