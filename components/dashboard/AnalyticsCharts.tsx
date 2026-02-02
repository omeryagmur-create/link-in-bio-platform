'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from '@/lib/i18n/provider'

interface AnalyticsChartsProps {
    data: any[]
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
    const { t } = useTranslation()

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>{t('dashboard.performance_chart')}</CardTitle>
                <CardDescription>
                    {t('dashboard.performance_chart_desc', { range: 30 })}
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                            name={t('dashboard.analytics_views')}
                        />
                        <Area
                            type="monotone"
                            dataKey="clicks"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorClicks)"
                            name={t('dashboard.analytics_clicks')}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
