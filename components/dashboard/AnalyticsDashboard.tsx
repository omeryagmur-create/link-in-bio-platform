'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Loader2, TrendingUp, MousePointer2, Percent, Users } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AnalyticsDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState('7')

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/analytics/stats?range=${range}`)
                const json = await res.json()
                setData(json)
            } catch (error) {
                console.error('Stats fetch error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [range])

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">İstatistikler yükleniyor...</p>
            </div>
        )
    }

    const { summary, chartData, topLinks } = data || {
        summary: { views: 0, clicks: 0, ctr: 0 },
        chartData: [],
        topLinks: []
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Analiz</h2>
                <Select value={range} onValueChange={setRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Zaman Aralığı" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Son 7 Gün</SelectItem>
                        <SelectItem value="30">Son 30 Gün</SelectItem>
                        <SelectItem value="90">Son 90 Gün</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-white to-slate-50 border-none shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-16 h-16" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{summary.views}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sayfalarınızın toplam trafiği.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-slate-50 border-none shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <MousePointer2 className="w-16 h-16" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Tıklanma</CardTitle>
                        <MousePointer2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{summary.clicks}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Linklerinize yapılan toplam etkileşim.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-slate-50 border-none shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Percent className="w-16 h-16" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama CTR</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">%{summary.ctr}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Görüntülenme başına tıklama oranı.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart */}
            <Card className="shadow-sm border-none bg-white">
                <CardHeader>
                    <CardTitle className="text-lg">Performans Grafiği</CardTitle>
                    <CardDescription>Son {range} günlük trafik ve etkileşim gelişimi.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    name="Görüntülenme"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                    name="Tıklanma"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Grid: Top Links & Insights */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-lg">En Çok Tıklananlar</CardTitle>
                        <CardDescription>En popüler 5 link ve etkileşim sayıları.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topLinks.length > 0 ? topLinks.map((link: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-sm truncate max-w-[200px]">{link.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{link.count}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Tık</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-8">Henüz veri yok.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Akıllı İpuçları</CardTitle>
                        <CardDescription>Verilerinize dayalı performans önerileri.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Trafiği Artır</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Linkinizi Instagram ve TikTok bio'nuza ekleyerek görüntülenme sayısını %40 artırabilirsiniz.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                                <MousePointer2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Daha Fazla Tıklama</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">En çok tıklanan linkinizi en tepeye taşıyarak etkileşimi maksimize edin.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
