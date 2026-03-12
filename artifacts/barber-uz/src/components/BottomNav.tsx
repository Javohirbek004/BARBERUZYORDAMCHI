import { Link, useLocation } from "wouter";
import { useTranslation } from "@/i18n/LanguageContext";
import { Home, Calendar, Users, Settings, Plus } from "lucide-react";
import { useState } from "react";
import { QuickAddClientDialog } from "./QuickAddClientDialog";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: Home, label: t('nav.dashboard') },
    { href: "/calendar", icon: Calendar, label: t('nav.calendar') },
    // Center spacing
    { href: "/clients", icon: Users, label: t('nav.clients') },
    { href: "/settings", icon: Settings, label: t('nav.settings') },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto">
          <div className="glass-panel rounded-3xl flex items-center justify-between px-6 py-3 relative">
            {navItems.slice(0, 2).map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 min-w-[4rem]">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Center Floating Button */}
            <div className="relative -top-8 flex justify-center w-16">
              <button 
                onClick={() => setIsAddOpen(true)}
                className="absolute flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-amber-600 text-black shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Plus className="w-8 h-8" />
              </button>
            </div>

            {navItems.slice(2, 4).map((item) => {
              const isActive = location.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 min-w-[4rem]">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <QuickAddClientDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  );
}
