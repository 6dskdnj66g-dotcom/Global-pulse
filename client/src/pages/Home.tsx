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
          <section className="relative w-full py-8 md:py-12 lg:py-16 overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Headlines */}
                <div className="lg:col-span-7 flex flex-col gap-6">
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
                </div>

                {/* Right: 3D Globe */}
                <div className="lg:col-span-5 relative hidden lg:block h-[500px]">
                  <div className="absolute top-0 right-0 z-10 bg-background/80 backdrop-blur px-3 py-1 rounded-full border border-border text-xs font-mono">
                    {t('globe.view')}
                  </div>
                  <GlobeViz height={500} />
                </div>
              </div>
            </div>
          </section>
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
              <button 
                onClick={handleSync} 
                disabled={syncMutation.isPending}
                className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50"
                title="Sync News"
              >
                <RefreshCw className={`w-5 h-5 text-muted-foreground ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              </button>
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
              {(searchParam || categoryParam ? articles : gridArticles)?.map((article) => (
                <ArticleCard key={article.id} article={article} />
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
      <footer className="border-t border-border/40 bg-muted/30 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-serif text-2xl font-bold mb-4">WORLD<span className="text-primary">NEWS</span></h3>
              <p className="text-muted-foreground max-w-sm">
                Your trusted source for global news coverage, bringing you the stories that matter from every corner of the world.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-wider">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {CATEGORIES.slice(0, 6).map(c => (
                  <li key={c}><Link href={`/?category=${c}`} className="hover:text-primary">{c}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-wider">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/20 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} WorldNews Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
