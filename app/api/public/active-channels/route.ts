
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    try {
        // First, get all published pages and their user IDs
        const { data: publishedPages, error: pagesError } = await supabase
            .from('pages')
            .select('user_id')
            .eq('is_published', true)

        if (pagesError) {
            console.error('Error fetching published pages:', pagesError)
            return NextResponse.json({ error: pagesError.message }, { status: 500 })
        }

        // Get unique user IDs
        const userIds = [...new Set(publishedPages?.map(p => p.user_id) || [])]

        if (userIds.length === 0) {
            return NextResponse.json({ profiles: [] })
        }

        // Now fetch profiles for these users
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, display_name, bio, avatar_url, tags, created_at')
            .in('id', userIds)
            .not('username', 'is', null)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError)
            return NextResponse.json({ error: profilesError.message }, { status: 500 })
        }

        const formattedProfiles = profiles?.map((p: any) => ({
            id: p.id,
            username: p.username,
            display_name: p.display_name,
            bio: p.bio,
            avatar_url: p.avatar_url,
            tags: p.tags || []
        })) || []

        return NextResponse.json({ profiles: formattedProfiles })

    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
