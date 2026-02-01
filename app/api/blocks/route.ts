import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const blockSchema = z.object({
    page_id: z.string().uuid(),
    type: z.enum(['link', 'text', 'image', 'video', 'embed', 'divider']),
    data: z.record(z.string(), z.any()),
})

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')

    if (!pageId) {
        return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify user owns the page
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check page ownership
    const { data: page } = await supabase
        .from('pages')
        .select('id')
        .eq('id', pageId)
        .eq('user_id', user.id)
        .single()

    if (!page) {
        return NextResponse.json({ error: 'Page not found or unauthorized' }, { status: 404 })
    }

    const { data: blocks, error } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', pageId)
        .order('position', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(blocks)
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const json = await request.json()
        const validatedData = blockSchema.parse(json)

        // Verify page ownership
        const { data: page } = await supabase
            .from('pages')
            .select('id')
            .eq('id', validatedData.page_id)
            .eq('user_id', user.id)
            .single()

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        // Get current max position
        const { data: maxPosData } = await supabase
            .from('blocks')
            .select('position')
            .eq('page_id', validatedData.page_id)
            .order('position', { ascending: false })
            .limit(1)
            .single()

        const position = maxPosData ? maxPosData.position + 1 : 0

        const { data: block, error } = await supabase
            .from('blocks')
            .insert({
                page_id: validatedData.page_id,
                type: validatedData.type,
                data: validatedData.data,
                position,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(block)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
