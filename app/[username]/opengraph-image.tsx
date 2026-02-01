import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export const alt = 'Link-in-Bio Profile'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, bio, avatar_url')
        .eq('username', username)
        .single()

    const { data: page } = await supabase
        .from('pages')
        .select('title, theme')
        .eq('user_id', profile?.id)
        .eq('is_primary', true)
        .maybeSingle()

    const displayName = profile?.display_name || username
    const bio = profile?.bio || ''
    const bgColor = (page?.theme as any)?.backgroundColor || '#ffffff'
    const textColor = (page?.theme as any)?.textColor || '#000000'

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bgColor,
                    color: textColor,
                    padding: '40px',
                    textAlign: 'center',
                }}
            >
                {profile?.avatar_url && (
                    <img
                        src={profile.avatar_url}
                        alt={displayName}
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            marginBottom: '20px',
                            border: `4px solid ${textColor}20`,
                        }}
                    />
                )}
                <div
                    style={{
                        fontSize: '60px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                    }}
                >
                    {displayName}
                </div>
                <div
                    style={{
                        fontSize: '30px',
                        opacity: 0.8,
                        maxWidth: '800px',
                    }}
                >
                    {bio}
                </div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        opacity: 0.5,
                    }}
                >
                    link.bio/{username}
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
