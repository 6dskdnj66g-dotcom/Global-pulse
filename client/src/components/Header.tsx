import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { Moon, Sun, Search, Menu, X, Globe, Share2, Bookmark } from "lucide-react";
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
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full glass-panel border-b-2 border-primary/20"
    >
      {/* Top Bar - Date & Utility */}
      <div className="w-full bg-primary/5 border-b border-border/10 py-1 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-serif italic">{now.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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

      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-full"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo - Washington Post Style */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-primary flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/30">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-black tracking-tighter leading-none border-b-2 border-primary group-hover:text-primary transition-colors">
              GLOBAL<span className="text-primary">PULSE</span>
            </h1>
            <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-serif font-bold pt-1 hidden lg:block">
              {language === 'en' ? 'Democratic Perspective' : 'منظور ديمقراطي'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {CATEGORIES.slice(0, 5).map((category) => {
            const isActive = location === `/?category=${category}`;
            return (
              <motion.div
                key={category}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link 
                  href={`/?category=${category}`}
                  className={`
                    px-4 py-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors hover:bg-primary/5
                    ${isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground/80'}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(`nav.${category.toLowerCase()}`)}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            {isSearchOpen && (
              <motion.form 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                onSubmit={handleSearch} 
                className="flex items-center"
              >
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full h-10 px-4 bg-muted/80 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-inner text-sm"
                />
              </motion.form>
            )}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all"
            data-testid="button-theme-toggle"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden border-t border-border/20 glass-panel absolute w-full z-40"
        >
          <nav className="flex flex-col p-4 gap-2">
            {CATEGORIES.map((category) => (
              <Link 
                key={category} 
                href={`/?category=${category}`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-lg font-bold font-serif uppercase tracking-widest hover:bg-primary/5 border-l-4 border-transparent hover:border-primary transition-all"
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
