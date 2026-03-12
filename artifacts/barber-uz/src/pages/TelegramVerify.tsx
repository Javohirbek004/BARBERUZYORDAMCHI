import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "@/i18n/LanguageContext";
import { useGetTelegramStatus, useGetCurrentUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";

export default function TelegramVerify() {
  const { t, lang } = useTranslation();
  const [, navigate] = useLocation();
  const { data: user } = useGetCurrentUser();

  const { data: status } = useGetTelegramStatus(user?.id || "", {
    query: {
      refetchInterval: 3000, // Poll every 3 seconds
      enabled: !!user?.id,
    }
  });

  useEffect(() => {
    if (status?.verified) {
      navigate("/dashboard");
    }
  }, [status, navigate]);

  const botLink = `https://t.me/barberuzbot?start=reg_${user?.id}_${lang}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center space-y-8"
      >
        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
          <Send className="w-10 h-10 text-blue-400 ml-1" />
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">{t('verify.wait')}</h1>
          <p className="text-muted-foreground text-lg px-4 leading-relaxed">
            {t('verify.message')}
          </p>
        </div>

        <div className="pt-8">
          <a href={botLink} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button className="w-full h-14 text-lg font-bold rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all">
              {t('verify.btn')}
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 text-muted-foreground mt-8">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>{t('verify.checking')}</span>
        </div>
      </motion.div>
    </div>
  );
}
