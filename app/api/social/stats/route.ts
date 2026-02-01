import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { url } = await req.json()
        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

        const lowerUrl = url.toLowerCase()
        let count = '0'
        let platform = ''

        // Mock/Basic Fetcher Logic
        // In a real production app, you'd use official APIs (YouTube Data API, etc.) 
        // or a reliable scraping service like Bright Data/Apify.

        if (lowerUrl.includes('instagram.com')) {
            platform = 'instagram'
            // Random mock for demo (Real fetch logic would go here)
            count = (Math.floor(Math.random() * 500) + 50).toString()
        } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
            platform = 'youtube'
            count = (Math.floor(Math.random() * 1000) + 200).toString()
        } else if (lowerUrl.includes('tiktok.com')) {
            platform = 'tiktok'
            count = (Math.floor(Math.random() * 2000) + 100).toString()
        } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
            platform = 'twitter'
            count = (Math.floor(Math.random() * 300) + 20).toString()
        }

        // Simulating a slight delay for "fetching" feel
        await new Promise(resolve => setTimeout(resolve, 800))

        return NextResponse.json({
            statCount: count,
            platform
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
