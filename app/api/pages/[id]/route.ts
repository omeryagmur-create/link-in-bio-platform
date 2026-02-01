import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id) // Security: Ensure user owns the page

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

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

        // Restrict Special Layout for Free users
        if (json.layout_type === 'special') {
            const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_tier')
                .eq('id', user.id)
                .single()

            if (profile?.subscription_tier === 'free') {
                return NextResponse.json({
                    error: 'Bento (Special) düzeni bir Pro özelliğidir. Lütfen planınızı yükseltin.',
                    code: 'PRO_FEATURE_REQUIRED'
                }, { status: 403 })
            }
        }

        const { data: page, error } = await supabase
            .from('pages')
            .update(json)
            .eq('id', params.id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(page)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
