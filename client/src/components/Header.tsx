import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { 
  Search, Globe, Landmark, Briefcase, 
  Cpu, Trophy, Radio, Newspaper, TrendingUp,
  Moon, Sun, Languages, RefreshCw, Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@shared/schema";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";

const SOURCES = [
  { name: 'BBC News', icon: Radio },
  { name: 'Al Jazeera', icon: Globe },
  { name: 'Axios', icon: Newspaper },
  { name: 'Reuters', icon: TrendingUp },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { t, language } = useLanguage();

  const getIcon = (category: string) => {
    switch (category) {
      case 'Politics': return Landmark;
      case 'Economy': return Briefcase;
      case 'Technology': return Cpu;
      case 'Sports': return Trophy;
      default: return Globe;
    }
  };

  return (
    <Sidebar className="bg-black border-r border-white/10">
      <SidebarHeader className="p-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-black tracking-tighter text-white">
            GLOBAL<span className="text-primary">PULSE</span>
          </h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 space-y-8">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 px-2">
            Editorial
          </SidebarGroupLabel>
          <SidebarMenu>
            {CATEGORIES.map((category) => {
              const Icon = getIcon(category);
              return (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-12 px-4 hover:bg-white/5 text-white transition-colors"
                  >
                    <Link href={`/?category=${category}`} className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-serif font-black uppercase text-xs tracking-widest">
                        {t(`nav.${category.toLowerCase()}`)}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 px-2">
            Sources
          </SidebarGroupLabel>
          <SidebarMenu>
            {SOURCES.map((source) => (
              <SidebarMenuItem key={source.name}>
                <SidebarMenuButton asChild className="h-10 px-4 hover:bg-white/5 text-white/60 hover:text-white transition-all">
                  <Link href={`/?search=${encodeURIComponent(source.name)}`} className="flex items-center gap-4">
                    <source.icon className="w-4 h-4" />
                    <span className="font-serif italic text-sm">{source.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-8 border-t border-white/10">
        <div className="space-y-1">
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Developer</div>
          <div className="text-primary font-serif font-black tracking-tighter">Hassanein Salah</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function Header() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-white/10 h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="text-white hover:text-primary transition-colors" />
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-primary flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-2xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-black tracking-tighter text-white">
              GLOBAL<span className="text-primary">PULSE</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.form 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="relative overflow-hidden"
              >
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full bg-white/5 border-b border-primary/50 text-white px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </motion.form>
            )}
          </AnimatePresence>

          <HeaderButton onClick={() => setIsSearchOpen(!isSearchOpen)} icon={Search} />
          <HeaderButton onClick={() => window.location.reload()} icon={RefreshCw} />
          <HeaderButton onClick={toggleLanguage} icon={Languages} label={language.toUpperCase()} />
          <HeaderButton onClick={toggleTheme} icon={theme === 'dark' ? Sun : Moon} />
        </div>
      </div>
    </header>
  );
}

function HeaderButton({ onClick, icon: Icon, label }: { onClick: () => void, icon: any, label?: string }) {
  return (
    <button 
      onClick={onClick}
      className="p-3 hover:bg-white/5 rounded-full text-white/60 hover:text-primary transition-all flex items-center gap-2"
    >
      <Icon className="w-5 h-5" />
      {label && <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>}
    </button>
  );
}
