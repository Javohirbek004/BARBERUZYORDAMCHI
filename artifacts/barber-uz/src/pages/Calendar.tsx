import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useListBookings } from "@workspace/api-client-react";
import { format, addDays, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Calendar() {
  const { t } = useTranslation();
  useAuth();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  const { data: bookingsData } = useListBookings({ date: formattedDate });

  // Generate week days
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  // Time slots 09:00 to 20:00
  const timeSlots = Array.from({ length: 12 }).map((_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <Layout>
      <PageHeader 
        title={t('cal.title')} 
        action={
          <Button size="sm" className="rounded-full bg-primary/20 text-primary hover:bg-primary/30 border-0">
            <Plus className="w-4 h-4 mr-1" /> {t('cal.add')}
          </Button>
        }
      />

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none snap-x">
        {weekDays.map((day, i) => {
          const isSelected = format(day, 'yyyy-MM-dd') === formattedDate;
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className={`snap-center flex flex-col items-center min-w-[3.5rem] py-3 rounded-2xl transition-all ${
                isSelected 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'bg-card border border-white/5 text-muted-foreground hover:bg-white/5'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
                {format(day, 'EEE')}
              </span>
              <span className={`text-xl font-display font-bold ${isSelected ? 'text-primary-foreground' : (isToday ? 'text-primary' : 'text-foreground')}`}>
                {format(day, 'dd')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline Grid */}
      <div className="relative border-t border-l border-white/5 rounded-tl-xl overflow-hidden bg-card/30">
        {timeSlots.map((time, i) => {
          // Find booking for this slot (simplified for display)
          const booking = bookingsData?.bookings.find(b => b.startTime.startsWith(time.split(':')[0]));
          
          return (
            <div key={time} className="flex border-b border-white/5 min-h-[5rem]">
              <div className="w-16 border-r border-white/5 p-2 flex flex-col items-end shrink-0">
                <span className="text-xs font-medium text-muted-foreground">{time}</span>
              </div>
              <div className="flex-1 p-2 relative group">
                {booking ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-2 bg-primary/20 border border-primary/30 rounded-xl p-3 flex flex-col justify-center"
                  >
                    <div className="font-bold text-primary text-sm line-clamp-1">{booking.clientName}</div>
                    <div className="text-xs text-primary/70">{booking.serviceName}</div>
                  </motion.div>
                ) : (
                  <div className="w-full h-full opacity-0 group-hover:opacity-100 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center cursor-pointer transition-all">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
