import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`

        // Convert File to ArrayBuffer for more reliable server-side upload
        const arrayBuffer = await file.arrayBuffer()

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, arrayBuffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Supabase Storage Error:', error)
            return NextResponse.json({
                error: error.message,
                details: error
            }, { status: 500 })
        }

        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(fileName)

        return NextResponse.json({ url: publicUrl })

    } catch (error) {
        console.error('Server upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
