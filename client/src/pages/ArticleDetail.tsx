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
  const { dir } = useLanguage();
  
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
    <div className={`min-h-screen bg-background font-sans ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Header />
      
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-20"
      >
        {/* Hero Image */}
        <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
          <img 
            src={bgImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-0 w-full p-6 md:p-12">
            <div className="container mx-auto">
              <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
                <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                Back to News
              </Link>
              
              <div className="space-y-4 max-w-4xl">
                <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded-sm">
                  {article.category}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8 bg-card rounded-t-3xl p-8 md:p-12 shadow-xl border-x border-t border-border/20">
              {/* Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border/40 text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {article.source.substring(0, 2).toUpperCase()}
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
              <p className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed mb-8 italic border-l-4 border-primary pl-6">
                {article.summary}
              </p>

              {/* Full Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none font-sans leading-loose text-foreground/80">
                {article.content ? (
                  article.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6">{paragraph}</p>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">[Full content not available in preview mode]</p>
                )}
              </div>
              
              <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border flex items-center justify-between">
                 <span className="text-sm font-medium">Read original article at {article.source}</span>
                 <a href={article.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-foreground text-background rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                   Visit Source
                 </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8 pt-12">
              <div className="sticky top-24">
                <h3 className="font-serif text-xl font-bold mb-6 border-b pb-2">Share this story</h3>
                <div className="flex flex-col gap-3">
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg border border-border/40 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all group">
                    <Facebook className="w-5 h-5 text-blue-600 group-hover:text-white" />
                    <span className="font-medium">Share on Facebook</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg border border-border/40 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all group">
                    <Twitter className="w-5 h-5 text-sky-500 group-hover:text-white" />
                    <span className="font-medium">Share on Twitter</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg border border-border/40 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all group">
                    <Linkedin className="w-5 h-5 text-blue-700 group-hover:text-white" />
                    <span className="font-medium">Share on LinkedIn</span>
                  </button>
                </div>

                <div className="mt-12 p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20">
                  <h4 className="font-bold text-lg mb-2">Stay Updated</h4>
                  <p className="text-sm text-muted-foreground mb-4">Get the latest global news delivered directly to your inbox.</p>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                      Subscribe
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
