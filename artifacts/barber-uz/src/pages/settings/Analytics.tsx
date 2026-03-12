import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  useAuth();
  
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { data, isLoading } = useGetAnalytics({ period });

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full bg-card hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-display">{t('analytics.title')}</h1>
      </div>

      <div className="flex gap-2 bg-card p-1 rounded-xl mb-6 border border-white/5">
        {(['week', 'month', 'year'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-primary text-black shadow-md' : 'text-muted-foreground hover:text-white'}`}
          >
            {t(`analytics.period.${p}` as any)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center">{t('loading')}</div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 bg-card border-white/5 text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('analytics.revenue')}</div>
              <div className="text-xl font-display font-bold text-primary">{data.totalRevenue.toLocaleString()}</div>
            </Card>
            <Card className="p-5 bg-card border-white/5 text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('analytics.bookings')}</div>
              <div className="text-2xl font-display font-bold text-foreground">{data.totalBookings}</div>
            </Card>
          </div>

          <Card className="p-5 bg-card border-white/5">
            <h3 className="font-bold mb-6">{t('analytics.revenue')} (Chart)</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenueChart}>
                  <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div>
            <h3 className="font-bold mb-4 ml-1">{t('analytics.top_services')}</h3>
            <div className="space-y-3">
              {data.topServices.map((service, i) => (
                <Card key={i} className="p-4 bg-card border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground">{service.name}</div>
                    <div className="text-xs text-muted-foreground">{service.count} marta</div>
                  </div>
                  <div className="font-bold text-primary">{(service.revenue).toLocaleString()} UZS</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
