import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useCreateClient, getListClientsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function QuickAddClientDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createClient = useCreateClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createClient.mutate({
      data: {
        name,
        phone: phone || null,
        notes: notes || null,
        status: "new"
      }
    }, {
      onSuccess: () => {
        toast({ title: t('success') });
        queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });
        onOpenChange(false);
        setName("");
        setPhone("");
        setNotes("");
      },
      onError: () => {
        toast({ title: t('error'), variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">{t('clients.add_quick')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Yangi mijozni tezkor qo'shish
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">{t('register.name')} *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ali" 
              className="bg-background/50 border-white/10 focus-visible:ring-primary"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Telefon</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="+998 90 123 45 67" 
              className="bg-background/50 border-white/10 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground">Izoh</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder="Qo'shimcha ma'lumotlar..." 
              className="bg-background/50 border-white/10 focus-visible:ring-primary resize-none"
              rows={3}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={!name.trim() || createClient.isPending}
              className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6"
            >
              {createClient.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {t('profile.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
