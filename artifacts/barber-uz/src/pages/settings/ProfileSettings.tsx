import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSettings() {
  const { t } = useTranslation();
  useAuth();
  const { toast } = useToast();
  
  const { data: profile, isLoading } = useGetProfile();
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    workingHoursStart: "",
    workingHoursEnd: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        brandName: profile.brandName || "",
        workingHoursStart: profile.workingHoursStart || "09:00",
        workingHoursEnd: profile.workingHoursEnd || "20:00"
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: formData }, {
      onSuccess: () => toast({ title: t('success') }),
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
        <h1 className="text-xl font-bold font-display">{t('profile.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 bg-card/50 p-6 rounded-3xl border border-white/5">
          <div className="space-y-2">
            <Label>{t('register.name')}</Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="bg-background/50 h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('register.brandName')}</Label>
            <Input 
              value={formData.brandName} 
              onChange={e => setFormData({...formData, brandName: e.target.value})} 
              className="bg-background/50 h-12"
            />
          </div>
          
          <div className="pt-2">
            <Label className="block mb-2">{t('profile.hours')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="time" 
                value={formData.workingHoursStart} 
                onChange={e => setFormData({...formData, workingHoursStart: e.target.value})} 
                className="bg-background/50 h-12"
              />
              <Input 
                type="time" 
                value={formData.workingHoursEnd} 
                onChange={e => setFormData({...formData, workingHoursEnd: e.target.value})} 
                className="bg-background/50 h-12"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={updateMutation.isPending}
          className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {updateMutation.isPending && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
          {t('profile.save')}
        </Button>
      </form>
    </Layout>
  );
}
