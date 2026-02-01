import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const pageSchema = z.object({
    title: z.string().min(1, 'Başlık zorunludur'),
    slug: z.string().min(3, 'URL en az 3 karakter olmalı').regex(/^[a-z0-9-]+$/, 'URL sadece küçük harf, rakam ve tire içerebilir'),
    layout_type: z.enum(['classic', 'special']).optional().default('classic'),
})

export async function GET() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: pages, error } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(pages)
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const json = await request.json()
        const validatedData = pageSchema.parse(json)

        // Check slug uniqueness across platform (or just user? Guide says unique slug generally)
        // The schema says UNIQUE(user_id, slug) but usually platforms want global unique or unique per user.
        // Let's assume global unique for nice URLs like platform.com/username/slug or simply platform.com/slug
        // The guide has `/[username]` public page, so maybe pages are platform.com/username/slug?
        // Wait, guide says `UNIQUE(user_id, slug)`, implies /username/slug structure.
        // AND it says `/[username]` is the public profile. 
        // Let's stick to simple implementation: Pages are child of User.

        // Check subscription tier and page limits
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single()

        const isFree = profile?.subscription_tier === 'free'

        if (isFree) {
            const { count } = await supabase
                .from('pages')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)

            if (count && count >= 1) {
                return NextResponse.json({
                    error: 'Ücretsiz planda sadece 1 sayfa oluşturabilirsiniz. Daha fazla sayfa için Pro\'ya geçin.',
                    code: 'PLAN_LIMIT_REACHED'
                }, { status: 403 })
            }
        }

        // Check if slug exists for this user
        const { data: existing } = await supabase
            .from('pages')
            .select('id')
            .eq('user_id', user.id)
            .eq('slug', validatedData.slug)
            .single()

        if (existing) {
            return NextResponse.json({ error: 'Bu URL zaten kullanımda' }, { status: 400 })
        }

        const { data: page, error } = await supabase
            .from('pages')
            .insert({
                user_id: user.id,
                title: validatedData.title,
                slug: validatedData.slug,
                layout_type: validatedData.layout_type,
                is_published: false, // Draft by default
                theme: {} // Default empty theme
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(page)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
