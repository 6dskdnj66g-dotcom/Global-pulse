import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";
import { GlobeViz } from "@/components/GlobeViz";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles, useSyncArticles } from "@/hooks/use-articles";
import { useLanguage, useLanguageEffect } from "@/hooks/use-language";
import { Loader2, RefreshCw } from "lucide-react";
import { CATEGORIES } from "@shared/schema";

export default function Home() {
  useLanguageEffect();
  const [location] = useLocation();
  const { language, t, dir } = useLanguage();
  const syncMutation = useSyncArticles();

  // Parse Query Params
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get("category") || undefined;
  const searchParam = searchParams.get("search") || undefined;

  const noArticlesMessage = language === 'en' 
    ? "No articles in this category yet – check back soon." 
    : "لا توجد مقالات في هذا القسم بعد - يرجى العودة لاحقاً.";

  const { data: articles, isLoading, error, refetch } = useArticles({
    category: categoryParam,
    search: searchParam,
    language,
    limit: 50
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, [refetch]);

  const handleSync = async () => {
    await syncMutation.mutateAsync();
    refetch();
  };

  const featuredArticle = articles?.[0];
  const gridArticles = articles?.slice(1);

  // Re-fetch when language, category or search changes
  useEffect(() => {
    refetch();
  }, [language, categoryParam, searchParam, refetch]);

  return (
    <div className={`min-h-screen bg-background flex flex-col font-sans ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Header />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        {!searchParam && !categoryParam && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full py-8 md:py-12 lg:py-16 overflow-hidden perspective-2000"
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Headlines */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="lg:col-span-7 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-sm font-bold tracking-widest uppercase text-primary border-b-2 border-primary pb-1">
                      {t('hero.featured')}
                    </h2>
                  </div>
                  
                  {isLoading ? (
                    <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />
                  ) : featuredArticle ? (
                    <ArticleCard article={featuredArticle} featured />
                  ) : (
                    <div className="p-12 text-center border border-dashed rounded-xl">
                      <p className="text-muted-foreground">No featured articles found.</p>
                    </div>
                  )}
                </motion.div>

                {/* Right: 3D Globe */}
                <motion.div 
                  initial={{ opacity: 0, x: 30, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="lg:col-span-5 relative hidden lg:block h-[500px] preserve-3d"
                >
                  <div className="absolute top-0 right-0 z-10 bg-background/80 backdrop-blur px-3 py-1 rounded-full border border-border text-xs font-mono">
                    {t('globe.view')}
                  </div>
                  <GlobeViz height={500} />
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Content Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              {categoryParam ? t(`nav.${categoryParam.toLowerCase()}`) : searchParam ? (language === 'en' ? `Search Results: ${searchParam}` : `نتائج البحث: ${searchParam}`) : t('latest.news')}
            </h2>
            <div className="flex items-center gap-2">
              {syncMutation.isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === 'en' ? 'Syncing...' : 'جاري المزامنة...'}
                </div>
              )}
              <motion.button 
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSync} 
                disabled={syncMutation.isPending}
                className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50 shadow-sm"
                title="Sync News"
              >
                <RefreshCw className={`w-5 h-5 text-muted-foreground ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-4 p-4 rounded-xl border border-border/40 bg-card/50">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
            <div className="text-center py-20 text-destructive">
              <p>{t('error')}</p>
              <button onClick={() => window.location.reload()} className="underline mt-2">Try again</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* If filtering, show all articles. If home, skip the featured one which is already shown */}
              {(searchParam || categoryParam ? articles : gridArticles)?.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
              
              {(!articles || articles.length === 0) && (
                <div className="col-span-full py-20 text-center opacity-60">
                  <p className="text-xl font-serif">{noArticlesMessage}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-primary bg-black text-white py-16 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-serif text-3xl font-black mb-6 tracking-tighter uppercase">GLOBAL<span className="text-primary">PULSE</span></h3>
              <p className="text-gray-400 max-w-sm font-serif leading-relaxed italic">
                {language === 'en' 
                  ? "Democratic perspective on world events. Your trusted source for global news coverage, bringing you the stories that matter."
                  : "منظور ديمقراطي للأحداث العالمية. مصدرك الموثوق لتغطية الأخبار العالمية، نقدم لك القصص التي تهمك."}
              </p>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-6 uppercase text-sm tracking-[0.2em] text-primary">Sections</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-bold uppercase tracking-wider">
                {CATEGORIES.slice(0, 6).map(c => (
                  <li key={c}><Link href={`/?category=${c}`} className="hover:text-primary transition-colors">{c}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-6 uppercase text-sm tracking-[0.2em] text-primary">Connect</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500 font-bold tracking-widest uppercase">
              © {new Date().getFullYear()} GLOBALPULSE. All rights reserved.
            </div>
            <div className="text-red-600 font-serif font-black text-sm tracking-tighter">
              Developed by Hassanein Salah
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
