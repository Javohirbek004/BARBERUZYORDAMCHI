import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function Settings() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const menuItems = [
    { href: "/settings/profile", label: t('settings.profile') },
    { href: "/settings/page", label: t('settings.page') },
    { href: "/settings/notifications", label: t('settings.notifications') },
    { href: "/settings/analytics", label: t('settings.analytics') },
    { href: "/settings/security", label: t('settings.security') },
  ];

  return (
    <Layout>
      <PageHeader title={t('settings.title')} />

      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}>
            <Card className="p-5 bg-card border-white/5 flex items-center justify-between hover-lift cursor-pointer group">
              <span className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Card>
          </Link>
        ))}

        <div className="pt-6">
          <button 
            onClick={logout}
            className="w-full p-5 rounded-2xl bg-destructive/10 text-destructive font-bold text-lg flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors border border-destructive/20"
          >
            {t('settings.logout')}
          </button>
        </div>
      </div>
    </Layout>
  );
}
