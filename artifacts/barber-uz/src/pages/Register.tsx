import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "@/i18n/LanguageContext";
import { useRegisterUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";
import { Loader2, User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    brandName: "",
    password: "",
    confirmPassword: "",
    mode: "solo" as "solo" | "team"
  });

  const registerMutation = useRegisterUser({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("barber_token", data.token);
        localStorage.setItem("barber_user", JSON.stringify(data.user));
        toast({ title: t('success') });
        navigate("/verify-telegram");
      },
      onError: (err) => {
        toast({ title: t('error'), description: err.message || "Registration failed", variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    
    registerMutation.mutate({
      data: {
        name: formData.name,
        username: formData.username,
        brandName: formData.brandName || undefined,
        password: formData.password,
        mode: formData.mode,
        lang: "uz" // Defaulting to selected language in real app
      }
    });
  };

  const isFormValid = formData.name && formData.username && formData.password.length >= 6 && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 z-0 bg-background" />

      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t('register.title')}</h1>
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500/90 text-sm p-3 rounded-xl inline-block mt-2 font-medium">
            {t('register.note')}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5">
            <div className="space-y-2">
              <Label className="text-white/80">{t('register.name')} *</Label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder={t('register.name_placeholder')}
                className="bg-black/20 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">{t('register.username')} *</Label>
              <Input 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                placeholder={t('register.username_placeholder')}
                className="bg-black/20 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">{t('register.brandName')}</Label>
              <Input 
                value={formData.brandName}
                onChange={e => setFormData({...formData, brandName: e.target.value})}
                placeholder={t('register.brandName_placeholder')}
                className="bg-black/20 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">{t('register.password')} *</Label>
                <Input 
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="bg-black/20 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">{t('register.confirm_password')} *</Label>
                <Input 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className="bg-black/20 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white/80 pl-2">{t('register.mode')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setFormData({...formData, mode: 'solo'})}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${formData.mode === 'solo' ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-white/5 bg-black/20 hover:border-white/20'}`}
              >
                <User className={`w-8 h-8 mb-3 ${formData.mode === 'solo' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="font-bold text-foreground">{t('register.mode.solo')}</div>
                <div className="text-xs text-muted-foreground mt-1">{t('register.mode.solo_sub')}</div>
              </div>
              
              <div 
                onClick={() => setFormData({...formData, mode: 'team'})}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${formData.mode === 'team' ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-white/5 bg-black/20 hover:border-white/20'}`}
              >
                <Users className={`w-8 h-8 mb-3 ${formData.mode === 'team' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="font-bold text-foreground">{t('register.mode.team')}</div>
                <div className="text-xs text-muted-foreground mt-1">{t('register.mode.team_sub')}</div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={registerMutation.isPending || !isFormValid}
            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-amber-600 hover:shadow-xl hover:shadow-primary/30 text-black border-0 mt-4 transition-all"
          >
            {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {t('register.submit')}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-4">
            {t('register.have_account')}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t('login.title')}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
