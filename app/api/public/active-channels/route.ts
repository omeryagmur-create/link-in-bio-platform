
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    try {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select(`
        id,
        username,
        display_name,
        bio,
        avatar_url,
        tags,
        pages!inner(is_published)
      `)
            .eq('pages.is_published', true)
            .not('username', 'is', null)
            .not('avatar_url', 'is', null)
            .limit(limit)
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching active channels:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
