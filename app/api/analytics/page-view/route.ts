import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { pageId } = await request.json()

        if (!pageId) {
            return NextResponse.json({ error: 'Page ID required' }, { status: 400 })
        }

        const supabase = await createClient()

        // IP adresini ve user agent'ı al
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'
        const userAgent = request.headers.get('user-agent') || 'unknown'
        const referrer = request.headers.get('referer') || request.headers.get('referrer') || null

        // Page view kaydet
        const { error } = await supabase
            .from('page_views')
            .insert({
                page_id: pageId,
                ip_address: ip,
                user_agent: userAgent,
                referrer: referrer,
            })

        if (error) {
            console.error('Page view tracking error:', error)
            return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Page view error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
