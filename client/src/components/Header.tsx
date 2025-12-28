import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { Moon, Sun, Search, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, dir } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q') as string;
    if (query) {
      setLocation(`/?search=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full glass-panel"
    >
      {/* Top Bar - Date & Utility */}
      <div className="w-full bg-primary/5 border-b border-border/10 py-1 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{now.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-primary font-bold ml-2">
              {language === 'en' ? 'Updated just now' : 'تم التحديث الآن'}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t('hero.breaking')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-full"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-2xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">
              GLOBAL<span className="text-primary">PULSE</span>
            </h1>
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans hidden lg:block">
              {language === 'en' ? 'Global Perspective' : 'منظور عالمي'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {CATEGORIES.slice(0, 5).map((category) => {
            const isActive = location === `/?category=${category}` || (location === '/' && category === 'World' && !window.location.search);
            return (
              <motion.div
                key={category}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link 
                  href={`/?category=${category}`}
                  className={`
                    px-4 py-2 text-sm font-semibold hover:text-primary transition-colors rounded-full hover:bg-primary/5
                    ${isActive ? 'text-primary bg-primary/10 shadow-sm' : 'text-foreground/80'}
                  `}
                  onClick={() => {
                    setLocation(`/?category=${category}`);
                    setIsMenuOpen(false);
                  }}
                >
                  {t(`nav.${category.toLowerCase()}`)}
                </Link>
              </motion.div>
            );
          })}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 text-sm font-semibold hover:text-primary transition-colors outline-none flex items-center gap-1">
              {t('nav.more')}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-panel">
              {CATEGORIES.slice(5).map((category) => (
                <DropdownMenuItem key={category} asChild>
                  <Link 
                    href={`/?category=${category}`} 
                    className={`w-full cursor-pointer ${location.includes(`category=${category}`) ? 'text-primary font-bold' : ''}`}
                    onClick={() => {
                      setLocation(`/?category=${category}`);
                      setIsMenuOpen(false);
                    }}
                  >
                    {t(`nav.${category.toLowerCase()}`)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <motion.form 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              onSubmit={handleSearch} 
              className="absolute right-20 top-5 z-50 flex items-center px-4"
            >
              <Search className="w-5 h-5 text-muted-foreground absolute left-6" />
              <input
                autoFocus
                name="q"
                type="search"
                placeholder={t('search.placeholder')}
                className="w-full h-10 pl-10 pr-10 bg-muted/80 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xl"
                onBlur={() => !location.includes('search') && setIsSearchOpen(false)}
              />
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 ml-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.form>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
            data-testid="button-theme-toggle"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* Mobile Lang Toggle */}
          <button 
            onClick={toggleLanguage}
            className="lg:hidden p-2 hover:bg-muted rounded-full text-muted-foreground font-serif font-bold text-sm"
          >
            {language === 'en' ? 'ع' : 'En'}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden border-t border-border/20 glass-panel absolute w-full z-40"
        >
          <nav className="flex flex-col p-4 gap-2">
            {CATEGORIES.map((category) => (
              <Link 
                key={category} 
                href={`/?category=${category}`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-lg font-medium hover:bg-primary/5 rounded-lg transition-colors"
              >
                {t(`nav.${category.toLowerCase()}`)}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
