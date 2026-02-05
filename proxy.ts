import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 1. Custom Domain Routing - En başta çalışmalı
    const hostname = request.headers.get('host')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const siteDomain = new URL(siteUrl).host

    if (hostname && hostname !== siteDomain && hostname !== 'localhost:3000') {
        // Domain'i veritabanında ara
        const { data: page } = await supabase
            .from('pages')
            .select('user_id')
            .eq('custom_domain', hostname)
            .maybeSingle()

        if (page) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', page.user_id)
                .maybeSingle()

            if (profile) {
                const path = request.nextUrl.pathname
                // Root ise -> /[username]
                // Değilse -> /[username]/[path] (Eğer alt sayfalar destekleniyorsa)
                const targetPath = path === '/' ? `/${profile.username}` : `/${profile.username}${path}`
                return NextResponse.rewrite(new URL(targetPath, request.url))
            }
        }
    }

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Auth routes (redirect to dashboard if already logged in)
    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
