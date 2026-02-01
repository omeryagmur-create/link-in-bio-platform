import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const json = await request.json()

        // We need to ensure the block belongs to a page owned by the user.
        // However, for simplicity and performance, RLS on the blocks table should handle this
        // IF the RLS policy joins with pages.
        // If not, we manually check. Let's manually check for safety.

        const { data: blockCheck } = await supabase
            .from('blocks')
            .select('page_id, pages!inner(user_id)')
            .eq('id', params.id)
            .single()

        // @ts-ignore
        if (!blockCheck || blockCheck.pages.user_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { data: block, error } = await supabase
            .from('blocks')
            .update(json)
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(block)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check ownership via join
    const { data: blockCheck } = await supabase
        .from('blocks')
        .select('page_id, pages!inner(user_id)')
        .eq('id', params.id)
        .single()

    // @ts-ignore
    if (!blockCheck || blockCheck.pages.user_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('id', params.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
