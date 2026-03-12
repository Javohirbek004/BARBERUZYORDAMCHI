import { useTranslation } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover-lift glass-panel border-0 text-white/80 hover:text-primary">
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-white/10">
        <DropdownMenuItem 
          onClick={() => setLang('uz')}
          className={`cursor-pointer ${lang === 'uz' ? 'text-primary font-bold' : ''}`}
        >
          🇺🇿 O'zbekcha
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLang('ru')}
          className={`cursor-pointer ${lang === 'ru' ? 'text-primary font-bold' : ''}`}
        >
          🇷🇺 Русский
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
