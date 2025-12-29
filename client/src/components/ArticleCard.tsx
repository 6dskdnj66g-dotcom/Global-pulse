import { motion } from "framer-motion";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Article } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { Globe, ArrowRight, Clock } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { language, dir } = useLanguage();

  return (
    <Link href={`/article/${article.id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group cursor-pointer flex flex-col h-full bg-card border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-sm"
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2069&auto=format&fit=crop'} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-2 left-2 md:top-4 md:left-4">
            <span className="bg-accent text-accent-foreground text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 md:px-3 md:py-1 rounded-sm shadow-lg">
              {article.category}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 flex flex-col gap-3 md:gap-4 bg-secondary/5 group-hover:bg-secondary/20 transition-colors duration-500">
          <div className="flex items-center gap-2 text-foreground/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            <Globe className="w-3 h-3 text-accent" />
            <span>{article.source}</span>
            <span className="mx-1 opacity-20">•</span>
            <Clock className="w-3 h-3" />
            <span>
              {formatDistanceToNow(new Date(article.publishedAt), { 
                addSuffix: true,
                locale: language === 'ar' ? arSA : enUS 
              })}
            </span>
          </div>

          <h3 className="font-serif text-lg md:text-xl font-black leading-tight group-hover:text-accent transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-foreground/60 text-xs md:text-sm font-serif italic line-clamp-2 flex-1">
            {article.summary}
          </p>

          <div className="pt-2 md:pt-4 flex items-center gap-2 text-accent font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
            <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
