import { createClient } from '@/lib/supabase/server'
import { PageList } from '@/components/dashboard/PageList'
import { CreatePageDialog } from '@/components/dashboard/CreatePageDialog'
import { Page } from '@/types'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    let pages: Page[] = []

    if (user) {
        const { data } = await supabase
            .from('pages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            pages = data as Page[]
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sayfalarım</h1>
                    <p className="text-muted-foreground">
                        Link-in-bio sayfalarınızı oluşturun ve yönetin.
                    </p>
                </div>
                <CreatePageDialog />
            </div>

            <PageList pages={pages} />
        </div>
    )
}
