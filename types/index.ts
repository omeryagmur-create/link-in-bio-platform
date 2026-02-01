export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Profile {
    id: string
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
    tags: string[] | null
    plan_type: 'free' | 'pro'
    created_at: string
}

export interface Page {
    id: string
    user_id: string
    slug: string
    title: string
    is_published: boolean
    is_primary: boolean
    theme: Json
    seo_title: string | null
    seo_description: string | null
    custom_domain: string | null
    layout_type: 'classic' | 'special'
    created_at: string
    updated_at: string
}

export interface Block {
    id: string
    page_id: string
    type: 'link' | 'text' | 'image' | 'video' | 'embed' | 'divider' | 'collage'
    position: number
    data: Json
    is_visible: boolean
    created_at: string
    updated_at: string
}
