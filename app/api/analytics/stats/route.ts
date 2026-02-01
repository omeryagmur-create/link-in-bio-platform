import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { subDays, startOfDay, format } from 'date-fns'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7' // default 7 days
    const days = parseInt(range)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Get user's pages
    const { data: pages } = await supabase
        .from('pages')
        .select('id, title, slug')
        .eq('user_id', user.id)

    if (!pages || pages.length === 0) {
        return NextResponse.json({
            summary: { views: 0, clicks: 0, ctr: 0 },
            chartData: [],
            topLinks: []
        })
    }

    const pageIds = pages.map(p => p.id)
    const startDate = subDays(startOfDay(new Date()), days - 1).toISOString()

    // 2. Get Page Views
    const { data: pageViews } = await supabase
        .from('page_views')
        .select('viewed_at')
        .in('page_id', pageIds)
        .gte('viewed_at', startDate)

    // 3. Get Block Clicks
    const { data: blockClicks } = await supabase
        .from('block_clicks')
        .select('clicked_at, block_id')
        .in('page_id', pageIds)
        .gte('clicked_at', startDate)

    // 4. Get Block details for Top Links
    const { data: blocks } = await supabase
        .from('blocks')
        .select('id, data, type')
        .in('page_id', pageIds)

    const views = pageViews?.length || 0
    const clicks = blockClicks?.length || 0
    const ctr = views > 0 ? (clicks / views) * 100 : 0

    // 5. Prepare Chart Data (Daily)
    const chartDataMap = new Map()

    // Initialize map with empty days
    for (let i = 0; i < days; i++) {
        const date = subDays(startOfDay(new Date()), (days - 1) - i)
        const key = format(date, 'yyyy-MM-dd')
        chartDataMap.set(key, { date: format(date, 'MMM dd'), views: 0, clicks: 0 })
    }

    pageViews?.forEach(view => {
        const key = format(new Date(view.viewed_at), 'yyyy-MM-dd')
        if (chartDataMap.has(key)) {
            chartDataMap.get(key).views += 1
        }
    })

    blockClicks?.forEach(click => {
        const key = format(new Date(click.clicked_at), 'yyyy-MM-dd')
        if (chartDataMap.has(key)) {
            chartDataMap.get(key).clicks += 1
        }
    })

    const chartData = Array.from(chartDataMap.values())

    // 6. Top Links calculation
    const linkStats = new Map()
    blockClicks?.forEach(click => {
        const count = linkStats.get(click.block_id) || 0
        linkStats.set(click.block_id, count + 1)
    })

    const topLinks = Array.from(linkStats.entries())
        .map(([blockId, count]) => {
            const block = blocks?.find(b => b.id === blockId)
            const title = block?.data?.title || block?.type || 'Bilinmeyen'
            return { title, count }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    return NextResponse.json({
        summary: {
            views,
            clicks,
            ctr: parseFloat(ctr.toFixed(1))
        },
        chartData,
        topLinks
    })
}
