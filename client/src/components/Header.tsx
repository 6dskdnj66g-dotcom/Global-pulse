import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { Moon, Sun, Search, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar - Date & Utility */}
      <div className="w-full bg-primary/5 border-b border-border/20 py-1 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
        <Link href="/" className="flex flex-col items-center lg:items-start group">
          <h1 className="font-serif text-3xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">
            WORLD<span className="text-primary">NEWS</span>
          </h1>
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans hidden lg:block">
            Global Perspective
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {CATEGORIES.slice(0, 5).map((category) => {
            const isActive = location === `/?category=${category}` || (location === '/' && category === 'World' && !window.location.search);
            return (
              <Link 
                key={category} 
                href={`/?category=${category}`}
                className={`
                  px-4 py-2 text-sm font-semibold hover:text-primary transition-colors rounded-full hover:bg-primary/5
                  ${isActive ? 'text-primary bg-primary/5' : 'text-foreground/80'}
                `}
                onClick={() => {
                  setLocation(`/?category=${category}`);
                  setIsMenuOpen(false);
                }}
              >
                {t(`nav.${category.toLowerCase()}`)}
              </Link>
            );
          })}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 text-sm font-semibold hover:text-primary transition-colors outline-none flex items-center gap-1">
              {t('nav.more')}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
            <form onSubmit={handleSearch} className="absolute inset-x-0 top-0 h-full bg-background z-50 flex items-center px-4 animate-in fade-in slide-in-from-top-2">
              <Search className="w-5 h-5 text-muted-foreground absolute left-6" />
              <input
                autoFocus
                name="q"
                type="search"
                placeholder={t('search.placeholder')}
                className="w-full h-10 pl-10 pr-10 bg-muted/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                onBlur={() => !location.includes('search') && setIsSearchOpen(false)}
              />
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 ml-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="lg:hidden border-t border-border bg-background absolute w-full z-40 animate-in slide-in-from-top-5">
          <nav className="flex flex-col p-4 gap-2">
            {CATEGORIES.map((category) => (
              <Link 
                key={category} 
                href={`/?category=${category}`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg"
              >
                {t(`nav.${category.toLowerCase()}`)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
