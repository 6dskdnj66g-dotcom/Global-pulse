import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { useArticle } from "@/hooks/use-articles";
import { useLanguageEffect, useLanguage } from "@/hooks/use-language";
import { format } from "date-fns";
import { ArrowLeft, Clock, Share2, Printer, Facebook, Twitter, Linkedin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function ArticleDetail() {
  useLanguageEffect();
  const [, params] = useRoute("/article/:id");
  const { dir, language } = useLanguage();
  
  const id = params ? parseInt(params.id) : 0;
  const { data: article, isLoading } = useArticle(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const bgImage = article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop";

  return (
    <div className={`min-h-screen bg-background font-sans ${dir === 'rtl' ? 'rtl' : 'ltr'} perspective-2000`}>
      <Header />
      
      <motion.article 
        initial={{ opacity: 0, rotateX: 5, y: 50 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pb-12 sm:pb-20 preserve-3d pt-20 sm:pt-24"
      >
        {/* Hero Image */}
        <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] min-h-[280px] sm:min-h-[350px] md:min-h-[400px] w-full overflow-hidden">
          <img 
            src={bgImage} 
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-0 w-full p-4 sm:p-6 md:p-12">
            <div className="container mx-auto">
              <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white mb-3 sm:mb-6 text-xs sm:text-sm font-medium transition-colors" aria-label={language === 'ar' ? 'العودة إلى الأخبار' : 'Back to News'}>
                <ArrowLeft className={`w-3 h-3 sm:w-4 sm:h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Link>
              
              <div className="space-y-2 sm:space-y-4 max-w-4xl">
                <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-primary text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-sm">
                  {article.category}
                </span>
                <h1 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg line-clamp-3">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="container mx-auto px-3 sm:px-4 -mt-4 sm:-mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8 bg-card rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-xl border-x border-t border-border/20">
              {/* Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b border-border/40 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                    {article.source.toLowerCase().includes('al jazeera') ? (
                      <img src="https://www.aljazeera.com/favicon.ico" alt="" className="w-6 h-6 object-contain" />
                    ) : article.source.toLowerCase().includes('bbc') ? (
                      <img src="https://www.bbc.com/favicon.ico" alt="" className="w-6 h-6 object-contain" />
                    ) : article.source.toLowerCase().includes('cnn') ? (
                      <img src="https://edition.cnn.com/favicon.ico" alt="" className="w-6 h-6 object-contain" />
                    ) : article.source.toLowerCase().includes('reuters') ? (
                      <img src="https://www.reuters.com/favicon.ico" alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      article.source.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{article.source}</p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3 h-3" />
                      {format(new Date(article.publishedAt), "MMMM d, yyyy • h:mm a")}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"><Share2 className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"><Printer className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif text-foreground/90 leading-relaxed mb-4 sm:mb-6 md:mb-8 italic border-l-2 sm:border-l-4 border-primary pl-4 sm:pl-6">
                {article.summary}
              </p>

              {/* Full Content */}
              <div 
                className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none font-sans leading-relaxed sm:leading-loose text-foreground/80 mb-6 sm:mb-8 md:mb-12"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
              
              <div className="mt-6 sm:mt-8 md:mt-12 p-4 sm:p-6 bg-muted/30 rounded-lg sm:rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                 <div className="flex flex-col text-center sm:text-left">
                   <span className="text-xs sm:text-sm font-medium">{dir === 'rtl' ? 'اقرأ المقال الأصلي في' : 'Read original at'} {article.source}</span>
                   <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-xs">{article.url}</span>
                 </div>
                 <a 
                   href={article.url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-md sm:rounded-lg font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2"
                   data-testid="button-read-original"
                 >
                   {dir === 'rtl' ? 'المصدر الأصلي' : 'Read Original'}
                 </a>
              </div>
            </div>

            {/* Sidebar - Hidden on mobile, shown on lg+ */}
            <div className="hidden lg:block lg:col-span-4 space-y-6 sm:space-y-8 pt-6 sm:pt-8 lg:pt-12">
              <div className="sticky top-28">
                <h3 className="font-serif text-lg sm:text-xl font-bold mb-4 sm:mb-6 border-b pb-2">{language === 'ar' ? 'شارك هذا الخبر' : 'Share this story'}</h3>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <button className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-md sm:rounded-lg border border-border/40 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all group">
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:text-white" />
                    <span className="font-medium text-sm">{language === 'ar' ? 'شارك على فيسبوك' : 'Share on Facebook'}</span>
                  </button>
                  <button className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-md sm:rounded-lg border border-border/40 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all group">
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 group-hover:text-white" />
                    <span className="font-medium text-sm">{language === 'ar' ? 'شارك على تويتر' : 'Share on Twitter'}</span>
                  </button>
                  <button className="flex items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-3 rounded-md sm:rounded-lg border border-border/40 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all group">
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 group-hover:text-white" />
                    <span className="font-medium text-sm">{language === 'ar' ? 'شارك على لينكد إن' : 'Share on LinkedIn'}</span>
                  </button>
                </div>

                <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-xl sm:rounded-2xl border border-primary/20">
                  <h4 className="font-bold text-base sm:text-lg mb-2">{language === 'ar' ? 'ابق على اطلاع' : 'Stay Updated'}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{language === 'ar' ? 'احصل على آخر الأخبار العالمية مباشرة إلى بريدك الإلكتروني' : 'Get the latest global news delivered to your inbox.'}</p>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                      className="flex-1 px-2.5 sm:px-3 py-2 rounded-md sm:rounded-lg border bg-background text-xs sm:text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      data-testid="input-email-subscribe"
                    />
                    <button className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-bold hover:bg-primary/90 transition-colors">
                      {language === 'ar' ? 'اشترك' : 'Subscribe'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.article>
    </div>
  );
}
