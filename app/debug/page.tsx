import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function TestPage() {
    const supabase = await createClient()

    // Get all pages
    const { data: allPages, error: pagesError } = await supabase
        .from('pages')
        .select('*')

    // Get published pages
    const { data: publishedPages } = await supabase
        .from('pages')
        .select('user_id, is_published')
        .eq('is_published', true)

    // Get all profiles
    const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, username, display_name')

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Database Debug Info</h1>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">All Pages ({allPages?.length || 0})</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(allPages, null, 2)}
                </pre>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Published Pages ({publishedPages?.length || 0})</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(publishedPages, null, 2)}
                </pre>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">All Profiles ({allProfiles?.length || 0})</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(allProfiles, null, 2)}
                </pre>
            </div>

            {pagesError && (
                <div className="bg-red-100 p-4 rounded">
                    <strong>Error:</strong> {pagesError.message}
                </div>
            )}
        </div>
    )
}
