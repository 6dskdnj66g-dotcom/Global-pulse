import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { 
  Search, Globe, Landmark, Briefcase, 
  Cpu, Trophy, Radio, Newspaper, TrendingUp,
  Moon, Sun, Languages, RefreshCw, PanelLeft, X, Send, Bot,
  MessageSquare, Zap, Layout
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const SOURCES = [
  // US Sources
  { name: 'New York Times', icon: Newspaper },
  { name: 'Washington Post', icon: Newspaper },
  { name: 'CNN', icon: Newspaper },
  { name: 'NBC News', icon: Radio },
  { name: 'ABC News', icon: Radio },
  { name: 'Fox News', icon: Radio },
  { name: 'NPR', icon: Radio },
  { name: 'CBS News', icon: Radio },
  // UK Sources
  { name: 'BBC News', icon: Radio },
  { name: 'The Guardian', icon: Newspaper },
  { name: 'Sky News', icon: Radio },
  { name: 'The Independent', icon: Newspaper },
  { name: 'The Telegraph', icon: Newspaper },
  // International
  { name: 'Al Jazeera English', icon: Globe },
  { name: 'Reuters', icon: TrendingUp },
  { name: 'Deutsche Welle', icon: Globe },
  { name: 'France 24', icon: Globe },
  { name: 'Times of India', icon: Newspaper },
  { name: 'Japan Times', icon: Newspaper },
  { name: 'South China Morning Post', icon: Newspaper },
  { name: 'ABC Australia', icon: Radio },
  { name: 'Global News Canada', icon: Globe },
  // Arabic Sources
  { name: 'Al Jazeera Arabic', icon: Globe },
  { name: 'BBC Arabic', icon: Radio },
  { name: 'France 24 Arabic', icon: Globe },
  { name: 'Sky News Arabia', icon: Radio },
  { name: 'RT Arabic', icon: Globe },
  { name: 'Al Arabiya', icon: Globe },
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
      default: return Globe;
    }
  };

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-4" dir="ltr">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm shadow-xl">
            <Globe className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-black tracking-tighter text-sidebar-foreground" dir="ltr">
            GLOBAL<span className="text-primary">PULSE</span>
          </h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 px-3">
            {language === 'ar' ? 'الأقسام' : 'Categories'}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            {CATEGORIES.map((category) => {
              const Icon = getIcon(category);
              const isActive = location.includes(`category=${category}`);
              return (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton 
                    asChild 
                    className={`h-11 px-3 transition-all duration-200 rounded-md ${
                      isActive 
                        ? 'bg-primary/20 text-primary border-l-2 border-primary' 
                        : 'hover:bg-primary/10 hover:text-primary text-sidebar-foreground/80'
                    }`}
                  >
                    <Link 
                      href={`/?category=${category}`} 
                      className="flex items-center gap-3"
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                      <span className="font-sans font-semibold text-[13px]">
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
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 px-3">
            {language === 'ar' ? 'المصادر العالمية' : 'Global Sources'}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {SOURCES.map((source) => {
              const isActive = location.includes(`search=${encodeURIComponent(source.name)}`);
              return (
                <SidebarMenuItem key={source.name}>
                  <SidebarMenuButton 
                    asChild 
                    className={`h-10 px-3 transition-all duration-200 rounded-md ${
                      isActive 
                        ? 'bg-primary/15 text-primary' 
                        : 'hover:bg-primary/10 text-sidebar-foreground/60 hover:text-primary'
                    }`}
                  >
                    <Link 
                      href={`/?search=${encodeURIComponent(source.name)}`}
                      className="flex items-center gap-3"
                    >
                      <source.icon className="w-4 h-4 opacity-70" />
                      <span className="font-sans text-xs">{source.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-sidebar-border">
        <div className="space-y-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-sidebar-foreground/40">Developer</div>
          <div className="text-primary font-serif font-black tracking-tight text-sm">Hassanein Salah</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AIChatPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'ai',
        content: language === 'ar' 
          ? "مرحباً، أنا مساعدك الذكي في Global Pulse. اسألني أي شيء عن أخبار اليوم!"
          : "Hi, I'm your Global Pulse AI assistant. Ask me anything about today's news!"
      }]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/ai/chat", { message: userMsg, language });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={language === 'ar' ? 'left' : 'right'} className="w-full sm:max-w-md bg-background border-border p-0 flex flex-col shadow-2xl">
        <SheetHeader className="p-6 border-b border-border bg-secondary/30 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-sm shadow-lg">
              <Bot className="w-6 h-6 text-accent-foreground" />
            </div>
            <SheetTitle className="font-serif text-xl font-black text-foreground">AI Assistant</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-sm font-serif text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                  msg.role === 'user' 
                    ? 'bg-accent text-accent-foreground ml-4' 
                    : 'bg-secondary text-foreground border border-border mr-4'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary p-4 rounded-sm animate-pulse flex gap-2 border border-border">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border bg-background">
          <form onSubmit={handleSend} className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'ar' ? "اسأل المساعد الذكي..." : "Ask AI assistant..."}
              className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-all duration-300 pr-12"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent hover:text-foreground transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsAIChatOpen(true);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border/50 h-16 transition-all duration-300">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-foreground hover:text-primary transition-all duration-300">
              <PanelLeft className="w-5 h-5" />
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-3 group" dir="ltr">
              <div className="w-9 h-9 bg-primary flex items-center justify-center transform group-hover:scale-105 transition-all shadow-lg rounded-sm">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-serif text-xl md:text-2xl font-black tracking-tighter flex items-center uppercase" dir="ltr">
                <span className="text-foreground">GLOBAL</span>
                <span className="text-primary font-black ml-1.5">PULSE</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-0.5 md:gap-1">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="relative overflow-hidden hidden md:block"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="w-full bg-secondary/50 border border-border/50 text-foreground px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-all rounded-sm"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <HeaderButton onClick={() => setIsSearchOpen(!isSearchOpen)} icon={Search} className="hidden md:flex" />
            <HeaderButton onClick={() => setIsAIChatOpen(true)} icon={MessageSquare} />
            <HeaderButton onClick={() => window.location.reload()} icon={Zap} className="hidden sm:flex" />
            <HeaderButton onClick={toggleLanguage} icon={Languages} label={language.toUpperCase()} />
            <HeaderButton onClick={toggleTheme} icon={theme === 'dark' ? Sun : Moon} />
          </div>
        </div>
      </header>
      
      {/* Breaking News Ticker */}
      <div className="fixed top-16 left-0 right-0 z-[90] bg-primary/10 border-b border-primary/20 h-8 flex items-center overflow-hidden backdrop-blur-sm">
        <div className="bg-primary px-3 h-full flex items-center text-[10px] font-black uppercase tracking-wider text-primary-foreground shrink-0 z-10">
          Breaking
        </div>
        <div className="flex-1 overflow-hidden relative">
          <motion.div 
            animate={{ x: [1000, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap flex items-center gap-12 text-[11px] font-medium text-foreground"
          >
            <span>Global Pulse: Global markets show steady growth in tech sectors</span>
            <span>Breaking: New advancements in AI news delivery announced</span>
            <span>Update: International summit addresses climate action strategies</span>
            <span>Pulse: Cultural festival celebrates global diversity in the arts</span>
          </motion.div>
        </div>
      </div>
      <AIChatPanel isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </>
  );
}

function HeaderButton({ onClick, icon: Icon, label, className }: { onClick: () => void, icon: any, label?: string, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-2 hover:bg-primary/10 rounded-sm text-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 group ${className}`}
    >
      <Icon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
      {label && <span className="text-[11px] font-bold tracking-tight">{label}</span>}
    </button>
  );
}
