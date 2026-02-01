import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://link.bio'

    // Fetch all public pages
    const { data: profiles } = await supabase
        .from('profiles')
        .select('username, updated_at')

    if (!profiles) return []

    const userPages = profiles.map((profile) => ({
        url: `${baseUrl}/${profile.username}`,
        lastModified: new Date(profile.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...userPages,
    ]
}
