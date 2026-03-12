import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useGetNotificationSettings, useUpdateNotificationSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NotificationSettings() {
  const { t } = useTranslation();
  useAuth();
  const { toast } = useToast();
  
  const { data: settings, isLoading } = useGetNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  const [formData, setFormData] = useState({
    newBooking: true,
    cancellation: true,
    reminders: true,
    reminderMinutes: 30
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        newBooking: settings.newBooking,
        cancellation: settings.cancellation,
        reminders: settings.reminders,
        reminderMinutes: settings.reminderMinutes || 30
      });
    }
  }, [settings]);

  const handleChange = (key: keyof typeof formData, value: boolean | number) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    updateMutation.mutate({ data: updated }, {
      onError: () => toast({ title: t('error'), variant: "destructive" })
    });
  };

  if (isLoading) return <Layout><div className="py-20 text-center">{t('loading')}</div></Layout>;

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full bg-card hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-display">{t('settings.notifications')}</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-card/50 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Yangi bronlar</Label>
            <p className="text-xs text-muted-foreground">Mijoz yozilganda xabar berish</p>
          </div>
          <Switch 
            checked={formData.newBooking} 
            onCheckedChange={v => handleChange('newBooking', v)} 
          />
        </div>

        <div className="bg-card/50 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Bekor qilish</Label>
            <p className="text-xs text-muted-foreground">Bron bekor bo'lganda</p>
          </div>
          <Switch 
            checked={formData.cancellation} 
            onCheckedChange={v => handleChange('cancellation', v)} 
          />
        </div>

        <div className="bg-card/50 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Eslatmalar</Label>
            <p className="text-xs text-muted-foreground">Brondan oldin eslatish</p>
          </div>
          <Switch 
            checked={formData.reminders} 
            onCheckedChange={v => handleChange('reminders', v)} 
          />
        </div>
      </div>
    </Layout>
  );
}
