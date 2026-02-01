import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PublicPageLayout } from '@/components/public/PublicPageLayout'
import type { Metadata } from 'next'

interface PageProps {
    params: Promise<{
        username: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params
    const supabase = await createClient()

    // Kullanıcıyı bul
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, bio')
        .eq('username', username)
        .single()

    if (!profile) {
        return {
            title: 'Kullanıcı Bulunamadı',
        }
    }

    // Ana sayfayı bul (SEO ayarları için)
    const { data: page } = await supabase
        .from('pages')
        .select('title, seo_title, seo_description')
        .eq('user_id', profile.id)
        .eq('is_primary', true)
        .maybeSingle()

    const title = page?.seo_title || page?.title || profile.display_name || username
    const description = page?.seo_description || profile.bio || `${username} adlı kullanıcının Link-in-Bio sayfası`

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            url: `https://link.bio/${username}`,
            // og:image will be added later or can use profile.avatar_url
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
        }
    }
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params
    const supabase = await createClient()

    // 1. Kullanıcıyı username'e göre bul
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, avatar_url')
        .eq('username', username)
        .single()

    if (!profile) {
        notFound()
    }

    // 2. Kullanıcının sayfalarını bul
    // Eğer giriş yapmış kullanıcı sayfa sahibiyse taslakları da görebilsin
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

    if (!pages || pages.length === 0) {
        notFound()
    }

    const page = pages[0] // İlk yayınlanmış sayfa (primary varsa o)

    // 3. Sayfa bloklarını position'a göre sırala
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
