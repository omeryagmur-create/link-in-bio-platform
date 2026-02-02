import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PublicPageLayout } from '@/components/public/PublicPageLayout'
import { getTranslation } from '@/lib/i18n/server'
import type { Metadata } from 'next'

interface PageProps {
    params: Promise<{
        username: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username: identifier } = await params
    const { t } = await getTranslation()
    const supabase = await createClient()

    // 1. Önce bu identifier bir sayfa slug'ı mı diye bak
    const { data: pageBySlug } = await supabase
        .from('pages')
        .select('id, user_id, title, seo_title, seo_description')
        .eq('slug', identifier)
        .maybeSingle()

    let profile = null
    let page = pageBySlug

    if (pageBySlug) {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('id, display_name, bio')
            .eq('id', pageBySlug.user_id)
            .single()
        profile = profileData
    } else {
        // 2. Sayfa bulunamadıysa, identifier bir kullanıcı adı mı diye bak
        const { data: profileData } = await supabase
            .from('profiles')
            .select('id, display_name, bio')
            .eq('username', identifier)
            .single()

        if (profileData) {
            profile = profileData
            // Kullanıcının ana sayfasını bul
            const { data: primaryPage } = await supabase
                .from('pages')
                .select('id, user_id, title, seo_title, seo_description')
                .eq('user_id', profileData.id)
                .eq('is_primary', true)
                .maybeSingle()
            page = primaryPage as any
        }
    }

    if (!profile) {
        return {
            title: t('public.not_found'),
        }
    }

    const title = page?.seo_title || page?.title || profile.display_name || identifier
    const description = page?.seo_description || profile.bio || t('public.description_fallback', { username: identifier })

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            url: `https://link.bio/${identifier}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
        }
    }
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username: identifier } = await params
    const supabase = await createClient()

    // 1. Önce identifier'ı bir sayfa slug'ı olarak ara
    const { data: pageBySlug } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', identifier)
        .maybeSingle()

    let profile = null
    let page = pageBySlug

    if (pageBySlug) {
        // Sayfa bulundu, sahibini getir
        const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, display_name, bio, avatar_url')
            .eq('id', pageBySlug.user_id)
            .single()
        profile = profileData
    } else {
        // 2. Sayfa bulunamadıysa, identifier'ı bir kullanıcı adı olarak ara
        const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, display_name, bio, avatar_url')
            .eq('username', identifier)
            .single()

        if (profileData) {
            profile = profileData
            // Kullanıcının yayınlanmış sayfalarına bak
            const { data: { user: currentUser } } = await supabase.auth.getUser()
            const isOwner = currentUser?.id === profile.id

            let query = supabase
                .from('pages')
                .select('*')
                .eq('user_id', profile.id)

            if (!isOwner) {
                query = query.eq('is_published', true)
            }

            const { data: pages } = await query
                .order('is_primary', { ascending: false })
                .order('created_at', { ascending: false })

            if (pages && pages.length > 0) {
                page = pages[0]
            }
        }
    }

    if (!profile || !page) {
        notFound()
    }

    // Ek Güvenlik: Eğer sayfa yayınlanmamışsa ve sahibi değilse 404
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!page.is_published && currentUser?.id !== profile.id) {
        notFound()
    }

    // 3. Sayfa bloklarını getir
    const { data: blocks } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_visible', true)
        .order('position', { ascending: true })

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.display_name || profile.username,
        description: profile.bio,
        url: `https://link.bio/${profile.username}`,
        image: profile.avatar_url,
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PublicPageLayout
                profile={profile}
                page={page}
                blocks={blocks || []}
            />
        </>
    )
}
