import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useParams, Link } from "wouter";
import { useGetClient } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Phone, Send, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

export default function ClientDetail() {
  const { t } = useTranslation();
  useAuth();
  const { id } = useParams<{ id: string }>();
  
  const { data: client, isLoading } = useGetClient(id || "", {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20 text-muted-foreground">
          {t('loading')}
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="text-center py-20 text-destructive">{t('error')}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon" className="rounded-full bg-card hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-display">Mijoz profili</h1>
      </div>

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/30 font-display font-bold text-primary text-4xl uppercase shadow-xl shadow-primary/10 mb-4">
          {client.name.charAt(0)}
        </div>
        <h2 className="text-3xl font-display font-bold text-foreground">{client.name}</h2>
        <div className="inline-flex mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t(`clients.filter.${client.status}` as any)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button className="h-12 bg-white/5 hover:bg-white/10 text-foreground border-white/10" variant="outline">
          <Phone className="w-4 h-4 mr-2 text-primary" /> {client.phone || "Qo'shish"}
        </Button>
        <Button className="h-12 bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 text-[#2AABEE] border-[#2AABEE]/20" variant="outline">
          <Send className="w-4 h-4 mr-2" /> Telegram
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="p-5 bg-card/50 border-white/5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Statistika</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-display font-bold text-foreground">{client.visitCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Tashriflar soni</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-primary">{client.totalSpent.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Umumiy xarajat (UZS)</div>
            </div>
          </div>
        </Card>

        {client.notes && (
          <Card className="p-5 bg-card/50 border-white/5">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Izohlar</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{client.notes}</p>
          </Card>
        )}

        {client.lastVisit && (
          <Card className="p-5 bg-card/50 border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">So'nggi tashrif</h3>
              <p className="text-base font-medium text-foreground">{format(new Date(client.lastVisit), 'dd MMM, yyyy')}</p>
            </div>
            <div className="p-3 rounded-full bg-white/5">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
