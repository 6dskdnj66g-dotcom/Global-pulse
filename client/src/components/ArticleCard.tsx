import { motion } from "framer-motion";
import { Link } from "wouter";
import { format } from "date-fns";
import { Article } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { Globe, ArrowRight, Share2, Bookmark } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { language, t, dir } = useLanguage();

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.url,
      }).catch(() => {});
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`
        group relative h-full flex flex-col overflow-hidden glass-card transition-all duration-300
        ${featured ? 'md:flex-row shadow-2xl' : 'shadow-lg'}
        hover:shadow-primary/20
      `}
    >
      <Link href={`/article/${article.id}`} className="flex flex-col h-full w-full">
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'md:w-1/2 h-[300px] md:h-full' : 'h-48'}`}>
          <img 
            loading="lazy"
            src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80'} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
              {article.category}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleShare}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-primary transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-primary transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 flex flex-col flex-1 ${featured ? 'md:w-1/2 bg-white/5' : ''}`}>
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-primary" />
              {article.source}
            </span>
            <span>
              {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
            </span>
          </div>

          <h3 className={`
            font-serif font-black leading-tight mb-3 group-hover:text-primary transition-colors
            ${featured ? 'text-2xl md:text-4xl' : 'text-xl'}
          `}>
            {article.title}
          </h3>

          <p className={`
            text-muted-foreground line-clamp-3 font-serif italic
            ${featured ? 'text-base md:text-lg mb-6' : 'text-sm mb-4'}
          `}>
            {article.summary}
          </p>

          <div className="mt-auto pt-4 border-t border-border/10 flex items-center justify-between">
            <span className={`
              flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary
              group-hover:translate-x-1 transition-transform
              ${dir === 'rtl' ? 'flex-row-reverse' : ''}
            `}>
              {t('read.more')}
              <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
