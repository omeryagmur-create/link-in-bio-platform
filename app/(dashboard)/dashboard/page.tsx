'use client'

import { createClient } from '@/lib/supabase/client'
import { PageList } from '@/components/dashboard/PageList'
import { CreatePageDialog } from '@/components/dashboard/CreatePageDialog'
import { Page } from '@/types'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n/provider'

export default function DashboardPage() {
    const supabase = createClient()
    const { t } = useTranslation()
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPages = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('pages')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (data) {
                    setPages(data as Page[])
                }
            }
            setLoading(false)
        }
        fetchPages()
    }, [supabase])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
                    <p className="text-muted-foreground">
                        {t('dashboard.description')}
                    </p>
                </div>
                <CreatePageDialog />
            </div>

            <PageList pages={pages} />
        </div>
    )
}
