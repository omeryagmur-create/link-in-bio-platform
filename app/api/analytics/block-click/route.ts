import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { blockId, pageId } = await request.json()

        if (!blockId || !pageId) {
            return NextResponse.json({ error: 'Block ID and Page ID required' }, { status: 400 })
        }

        const supabase = await createClient()

        // IP adresini al
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'

        // Block click kaydet
        const { error } = await supabase
            .from('block_clicks')
            .insert({
                block_id: blockId,
                page_id: pageId,
                ip_address: ip,
            })

        if (error) {
            console.error('Block click tracking error:', error)
            return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Block click error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
