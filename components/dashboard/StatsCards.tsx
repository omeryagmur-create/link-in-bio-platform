'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, MousePointerClick, TrendingUp } from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'
import { useTranslation } from '@/lib/i18n/provider'

interface StatsCardsProps {
    data: {
        views: number
        clicks: number
        ctr: number
    }
}

export function StatsCards({ data }: StatsCardsProps) {
    const { t } = useTranslation()

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('dashboard.analytics_views')}
                    </CardTitle>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        <NumberTicker value={data.views} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {t('dashboard.range_30')}
                    </p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300 border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('dashboard.analytics_clicks')}
                    </CardTitle>
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <MousePointerClick className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        <NumberTicker value={data.clicks} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {t('dashboard.range_30')}
                    </p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300 border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('dashboard.analytics_ctr')}
                    </CardTitle>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold flex items-center">
                        %<NumberTicker value={data.ctr} decimalPlaces={1} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {t('dashboard.analytics_ctr_desc')}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
