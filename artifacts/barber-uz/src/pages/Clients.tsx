import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useListClients } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Search, Phone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Clients() {
  const { t } = useTranslation();
  useAuth();
  
  const [filter, setFilter] = useState<'all' | 'regular' | 'new' | 'blacklist'>('all');
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useListClients({ 
    filter: filter !== 'all' ? filter : undefined,
    search: search || undefined
  });

  const filters = [
    { id: 'all', label: t('clients.filter.all') },
    { id: 'regular', label: t('clients.filter.regular') },
    { id: 'new', label: t('clients.filter.new') },
    { id: 'blacklist', label: t('clients.filter.blacklist') },
  ] as const;

  return (
    <Layout>
      <PageHeader title={t('clients.title')} />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('clients.search')}
          className="pl-10 h-12 bg-card border-white/10 rounded-xl focus-visible:ring-primary text-base"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.id 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'bg-card border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
           <p className="text-muted-foreground text-center py-8">{t('loading')}</p>
        ) : data?.clients.map((client, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={client.id}
          >
            <Link href={`/client/${client.id}`}>
              <div className="bg-card border border-white/5 p-4 rounded-2xl flex items-center justify-between hover-lift cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 font-display font-bold text-primary text-lg uppercase">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{client.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {client.phone}</span>}
                      <span>•</span>
                      <span className="font-medium text-primary/80">{client.visitCount} {t('clients.visits')}</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
