import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { 
  Moon, Sun, Search, Menu, X, Globe, 
  Newspaper, TrendingUp, Landmark, 
  Briefcase, Cpu, Trophy, BookOpen, 
  Compass, Clock, Radio
} from "lucide-react";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";

const SOURCES = [
  { name: 'BBC News', icon: Radio },
  { name: 'Al Jazeera', icon: Globe },
  { name: 'Axios', icon: Newspaper },
  { name: 'Reuters', icon: TrendingUp },
  { name: 'The Guardian', icon: Newspaper },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { t, language } = useLanguage();

  const getIcon = (category: string) => {
    switch (category) {
      case 'Politics': return Landmark;
      case 'Economy': return Briefcase;
      case 'Technology': return Cpu;
      case 'Sports': return Trophy;
      case 'World': return Globe;
      default: return Newspaper;
    }
  };

  return (
    <Sidebar className="border-r-2 border-primary/10">
      <SidebarHeader className="p-6 border-b border-primary/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-xl font-black tracking-tighter leading-none">
              GLOBAL<span className="text-primary">PULSE</span>
            </h1>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif font-black uppercase text-[10px] tracking-widest text-primary mb-4 px-2">
            {language === 'en' ? 'Editorial Sections' : 'الأقسام التحريرية'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CATEGORIES.map((category) => {
                const Icon = getIcon(category);
                const isActive = location === `/?category=${category}`;
                return (
                  <SidebarMenuItem key={category}>
                    <SidebarMenuButton 
                      asChild 
                      className={`h-12 px-4 transition-all ${isActive ? 'bg-primary/5 text-primary border-l-4 border-primary' : 'hover:bg-muted'}`}
                    >
                      <Link href={`/?category=${category}`} className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-bold text-sm uppercase tracking-wider">
                          {t(`nav.${category.toLowerCase()}`)}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="font-serif font-black uppercase text-[10px] tracking-widest text-primary mb-4 px-2">
            {language === 'en' ? 'Global Sources' : 'المصادر العالمية'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SOURCES.map((source) => (
                <SidebarMenuItem key={source.name}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-10 px-4 hover:bg-muted opacity-80 hover:opacity-100 transition-all"
                  >
                    <Link href={`/?search=${encodeURIComponent(source.name)}`} className="flex items-center gap-3">
                      <source.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-serif italic text-sm">{source.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-primary/10">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {language === 'en' ? 'Platform Lead' : 'رئيس المنصة'}
          </div>
          <div className="font-serif font-black text-primary text-sm tracking-tighter">
            Hassanein Salah
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function Header() {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, dir } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-2 border-primary/20"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-muted rounded-full" />
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">
              {t('hero.breaking')}
            </span>
            <span className="font-serif italic text-xs text-muted-foreground">
              {now.toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-4 group absolute left-1/2 -translate-x-1/2">
          <div className="w-10 h-10 bg-primary flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-black tracking-tighter leading-none border-b-2 border-primary group-hover:text-primary transition-colors">
            GLOBAL<span className="text-primary">PULSE</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <motion.form 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              onSubmit={handleSearch}
              className="relative"
            >
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full h-10 px-4 bg-muted border-b border-primary focus:outline-none text-sm"
              />
            </motion.form>
          ) : null}
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-muted rounded-full">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-full">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={toggleLanguage} className="p-2 hover:bg-muted rounded-full font-serif font-black text-xs">
            {language === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
