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
    <Sidebar className="bg-sidebar border-r border-border transition-all duration-300 ease-in-out">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm">
            <Globe className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-black tracking-tighter text-foreground">
            GLOBAL<span className="text-accent">PULSE</span>
          </h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2 space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2 px-4">
            Editorial
          </SidebarGroupLabel>
          <SidebarMenu>
            {CATEGORIES.map((category) => {
              const Icon = getIcon(category);
              return (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-11 px-4 hover:bg-accent/10 hover:text-accent text-foreground transition-all rounded-sm"
                  >
                    <Link href={`/?category=${category}`} className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="font-serif font-bold uppercase text-[11px] tracking-wider">
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
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2 px-4">
            Sources
          </SidebarGroupLabel>
          <SidebarMenu>
            {SOURCES.map((source) => (
              <SidebarMenuItem key={source.name}>
                <SidebarMenuButton asChild className="h-10 px-4 hover:bg-accent/5 text-foreground/70 hover:text-accent transition-all rounded-sm">
                  <Link href={`/?search=${encodeURIComponent(source.name)}`} className="flex items-center gap-3">
                    <source.icon className="w-4 h-4" />
                    <span className="font-serif italic text-xs">{source.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-border bg-secondary/20">
        <div className="space-y-1">
          <div className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/40">Developer</div>
          <div className="text-accent font-serif font-black tracking-tighter text-sm">Hassanein Salah</div>
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
        <SheetHeader className="p-6 border-b border-border bg-secondary/30">
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
            <SidebarTrigger className="text-foreground/80 hover:text-accent transition-all duration-300">
              <PanelLeft className="w-5 h-5" />
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-accent flex items-center justify-center transform group-hover:scale-105 transition-all shadow-lg rounded-sm">
                <Globe className="w-5 h-5 text-accent-foreground" />
              </div>
              <h1 className="font-serif text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center uppercase">
                <span className="text-foreground">GLOBAL</span>
                <span className="text-foreground/40 font-light ml-1">PULSE</span>
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
      <AIChatPanel isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </>
  );
}

function HeaderButton({ onClick, icon: Icon, label, className }: { onClick: () => void, icon: any, label?: string, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-2 hover:bg-accent/5 rounded-sm text-foreground/60 hover:text-accent transition-all duration-300 flex items-center gap-2 group ${className}`}
    >
      <Icon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
      {label && <span className="text-[11px] font-bold tracking-tight">{label}</span>}
    </button>
  );
}
