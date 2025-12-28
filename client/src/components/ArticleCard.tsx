import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { ArrowRight, Clock, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { dir, t } = useLanguage();
  
  // 3D Tilt Effect State
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x);
  const mouseY = useSpring(y);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Fallback image if none provided
  const bgImage = article.imageUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&sig=${article.id}`;

  return (
    <motion.div
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ 
        scale: 1.05, 
        z: 50,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group rounded-xl overflow-hidden bg-card border border-border/40
        transition-all duration-500 hover:border-primary/40
        active:scale-[0.98]
        ${featured ? 'col-span-1 md:col-span-2 row-span-2 min-h-[450px]' : 'min-h-[350px]'}
        perspective-1000
      `}
    >
      <Link href={`/article/${article.id}`} className="block h-full w-full">
        {/* Image Background for Featured, Top for Standard */}
        <div className={`
          ${featured ? 'absolute inset-0 z-0' : 'h-48 w-full relative'}
          overflow-hidden
        `}>
          <img 
            src={bgImage} 
            alt={article.title}
            className={`
              w-full h-full object-cover transition-transform duration-700 ease-out
              group-hover:scale-105
              ${featured ? 'opacity-40 group-hover:opacity-30 dark:opacity-30' : ''}
            `}
          />
          {featured && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          )}
        </div>

        <div className={`
          relative z-10 flex flex-col justify-between h-full
          ${featured ? 'p-8 text-white' : 'p-5'}
        `}>
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase opacity-80 mb-3">
            <span className={`
              px-2 py-1 rounded bg-primary text-white
              ${featured ? 'bg-primary' : 'bg-primary/90'}
            `}>
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(article.publishedAt))} ago
            </span>
          </div>

          <div className="flex-1" style={{ transform: "translateZ(30px)" }}>
            <h3 className={`
              font-serif font-bold leading-tight mb-3
              ${featured ? 'text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-md' : 'text-xl text-card-foreground group-hover:text-primary transition-colors'}
            `}>
              {article.title}
            </h3>
            
            <p className={`
              font-sans leading-relaxed line-clamp-6
              ${featured ? 'text-lg text-gray-200 max-w-2xl drop-shadow-sm' : 'text-sm text-muted-foreground'}
            `}>
              {article.summary}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col gap-4 pt-4 border-t border-border/10" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium opacity-70">
                <Globe className="w-3 h-3" />
                {article.source}
              </div>
              
              <span className={`
                flex items-center gap-2 text-sm font-bold
                ${featured ? 'text-white' : 'text-primary'}
                group-hover:translate-x-1 transition-transform
                ${dir === 'rtl' ? 'flex-row-reverse' : ''}
              `}>
                {t('read.more')}
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            
            <div 
              className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-center text-xs font-bold transition-colors cursor-pointer"
            >
              {dir === 'rtl' ? 'اقرأ المقال الكامل' : 'Read full article'}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
