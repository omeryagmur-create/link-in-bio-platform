import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { display_name, bio, avatar_url, tags } = body

        const { data, error } = await supabase
            .from('profiles')
            .update({
                display_name,
                bio,
                avatar_url,
                tags,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Profile update error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)

    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
