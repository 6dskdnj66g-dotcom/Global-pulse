import { motion } from "framer-motion";
import { useArticles, useSyncArticles } from "@/hooks/use-articles";
import { useLanguage, useLanguageEffect } from "@/hooks/use-language";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, Globe, RefreshCw, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Link, useLocation } from "wouter";

export default function Home() {
  useLanguageEffect();
  const { language, t, dir } = useLanguage();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const category = params.get('category') || undefined;
  const search = params.get('search') || undefined;

  const { data: articles, isLoading, refetch } = useArticles({ language, category, search, limit: 50 });
  const syncMutation = useSyncArticles();

  const featuredArticle = articles?.[0];
  const latestHeadlines = articles?.slice(1, 9);

  const handleSync = async () => {
    await syncMutation.mutateAsync();
    refetch();
  };

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Header />

      <main className="flex-1 pt-20 sm:pt-24">
        {/* Premium Hero Featured Story */}
        <section className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] min-h-[300px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[500px] overflow-hidden">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : featuredArticle ? (
            <div className="relative w-full h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{ backgroundImage: `url(${featuredArticle.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2069&auto=format&fit=crop'})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
              
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-3 sm:px-4 pb-6 sm:pb-10 md:pb-16 lg:pb-20">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl space-y-2 sm:space-y-3 md:space-y-5 lg:space-y-6"
                  >
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="bg-primary text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] px-2 sm:px-3 py-0.5 sm:py-1 rounded-sm">
                        {featuredArticle.category}
                      </span>
                      <span className="flex items-center gap-1 text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {formatDistanceToNow(new Date(featuredArticle.publishedAt), { 
                          addSuffix: true, 
                          locale: language === 'ar' ? arSA : enUS 
                        })}
                      </span>
                    </div>
                    
                    <h2 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tighter line-clamp-2 sm:line-clamp-3">
                      {featuredArticle.title}
                    </h2>
                    
                    <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-serif italic max-w-2xl line-clamp-2 hidden sm:block">
                      {featuredArticle.summary}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4 md:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-sm bg-primary flex items-center justify-center shadow-lg">
                          <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary-foreground" />
                        </div>
                        <span className="text-white font-serif font-black uppercase text-[10px] sm:text-xs md:text-sm tracking-wider sm:tracking-widest">
                          {featuredArticle.source}
                        </span>
                      </div>
                      
                      <Link href={`/article/${featuredArticle.id}`}>
                        <button className="bg-primary text-primary-foreground hover:bg-white hover:text-black transition-all duration-500 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 font-black uppercase text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-1.5 sm:gap-2 group shadow-xl rounded-sm">
                          {language === 'en' ? 'Read Story' : 'اقرأ المزيد'}
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Latest Headlines Grid */}
        <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-12 border-b-2 border-primary/20 pb-3 sm:pb-4 gap-4">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter uppercase">
              {language === 'en' ? 'Latest Headlines' : 'آخر العناوين'}
            </h3>
            <button 
              onClick={handleSync}
              disabled={syncMutation.isPending}
              className="p-2 sm:p-3 hover:bg-primary/10 rounded-full transition-all group border border-primary/10 shrink-0"
              data-testid="button-sync"
              aria-label={language === 'en' ? 'Refresh news' : 'تحديث الأخبار'}
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary ${syncMutation.isPending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-x-8 md:gap-y-10 lg:gap-y-12">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3 sm:space-y-4">
                  <Skeleton className="aspect-video w-full rounded-sm" />
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-full" />
                </div>
              ))
            ) : latestHeadlines?.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-secondary text-secondary-foreground border-t-4 border-primary py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary flex items-center justify-center rounded-sm">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-secondary-foreground" dir="ltr">
                GLOBAL<span className="text-primary">PULSE</span>
              </h1>
            </div>
            <div className="text-primary font-serif font-black text-sm sm:text-base md:text-xl tracking-tighter">
              Developed by Hassanein Salah
            </div>
          </div>
          <div className="text-center text-muted-foreground text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em]">
            {new Date().getFullYear()} GLOBAL PULSE MEDIA GROUP - ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
}
