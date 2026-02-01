import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { updates } = await request.json() // Expected: [{ id: '...', position: 0 }, ...]

        if (!Array.isArray(updates)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
        }

        // Verify ownership of the first block to assume permission for the batch
        // (Optimization: verify one, assume others are valid or let RLS handle it)
        if (updates.length > 0) {
            const firstId = updates[0].id
            const { data: blockCheck } = await supabase
                .from('blocks')
                .select('page_id, pages!inner(user_id)')
                .eq('id', firstId)
                .single()

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!blockCheck || (blockCheck as any).pages.user_id !== user.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
            }
        }

        // Supabase JS doesn't support bulk update with different values easily in one query
        // We can loop or use upsert if we include all required fields. 
        // Since we only update position, loop is safer but slower. 
        // Or we can use an RPC function if performance is critical.
        // For now, let's use Promise.all 

        // Better approach: database function, but let's stick to client-side loop for MVP

        await Promise.all(
            updates.map(update =>
                supabase
                    .from('blocks')
                    .update({ position: update.position })
                    .eq('id', update.id)
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
