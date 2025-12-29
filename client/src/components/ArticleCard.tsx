import { motion } from "framer-motion";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Article } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { Globe, ArrowRight, Clock, Share2, Bookmark, BookmarkCheck, Link2, Check } from "lucide-react";
import { SiFacebook, SiX, SiWhatsapp } from "react-icons/si";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { language, dir } = useLanguage();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedArticles');
    if (saved) {
      const bookmarks = JSON.parse(saved) as number[];
      setIsBookmarked(bookmarks.includes(article.id));
    }
  }, [article.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const saved = localStorage.getItem('bookmarkedArticles');
    let bookmarks: number[] = saved ? JSON.parse(saved) : [];
    
    if (isBookmarked) {
      bookmarks = bookmarks.filter(id => id !== article.id);
      toast({
        title: language === 'ar' ? 'تم إزالة المقال' : 'Article removed',
        description: language === 'ar' ? 'تم إزالة المقال من القراءة لاحقاً' : 'Removed from read later',
      });
    } else {
      bookmarks.push(article.id);
      toast({
        title: language === 'ar' ? 'تم الحفظ' : 'Saved',
        description: language === 'ar' ? 'تم حفظ المقال للقراءة لاحقاً' : 'Saved for reading later',
      });
    }
    
    localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const shareUrl = `${window.location.origin}/article/${article.id}`;
  const shareText = article.title;

  const shareToFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    setShowShareMenu(false);
  };

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    setShowShareMenu(false);
    toast({
      title: language === 'ar' ? 'تم النسخ' : 'Copied',
      description: language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard',
    });
  };

  return (
    <div className="relative">
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
              <span className="bg-primary text-primary-foreground text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 md:px-3 md:py-1 rounded-sm shadow-lg">
                {article.category}
              </span>
            </div>
            
            <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-2">
              <button 
                onClick={handleBookmark}
                className={`w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-200 ${
                  isBookmarked 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-black/50 text-white hover:bg-primary hover:text-primary-foreground'
                }`}
                data-testid={`button-bookmark-${article.id}`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleShare}
                className="w-8 h-8 flex items-center justify-center rounded-sm bg-black/50 text-white hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                data-testid={`button-share-${article.id}`}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-6 flex flex-col gap-3 md:gap-4 bg-secondary/5 group-hover:bg-secondary/20 transition-colors duration-500">
            <div className="flex items-center gap-2 text-muted-foreground text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
              <Globe className="w-3 h-3 text-primary" />
              <span>{article.source}</span>
              <span className="mx-1 opacity-30">|</span>
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(article.publishedAt), { 
                  addSuffix: true,
                  locale: language === 'ar' ? arSA : enUS 
                })}
              </span>
              <span className="mx-1 opacity-30">|</span>
              <span className="text-primary/80">
                {Math.ceil((article.content?.length || 200) / 1000) + 1} {language === 'ar' ? 'د قراءة' : 'min'}
              </span>
            </div>

            <h3 className="font-serif text-lg md:text-xl font-black leading-tight text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {article.title}
            </h3>

            <p className="text-foreground/60 text-xs md:text-sm font-serif italic line-clamp-2 flex-1">
              {article.summary}
            </p>

            <div className="pt-2 md:pt-4 flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
              <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </motion.div>
      </Link>

      {showShareMenu && (
        <div 
          className="absolute top-14 right-2 md:top-16 md:right-4 z-50 bg-card border border-border rounded-sm shadow-xl p-2 flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={shareToFacebook}
            className="w-9 h-9 flex items-center justify-center rounded-sm bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
            data-testid={`button-share-facebook-${article.id}`}
          >
            <SiFacebook className="w-4 h-4" />
          </button>
          <button 
            onClick={shareToTwitter}
            className="w-9 h-9 flex items-center justify-center rounded-sm bg-black text-white hover:opacity-80 transition-opacity"
            data-testid={`button-share-twitter-${article.id}`}
          >
            <SiX className="w-4 h-4" />
          </button>
          <button 
            onClick={shareToWhatsapp}
            className="w-9 h-9 flex items-center justify-center rounded-sm bg-[#25D366] text-white hover:opacity-80 transition-opacity"
            data-testid={`button-share-whatsapp-${article.id}`}
          >
            <SiWhatsapp className="w-4 h-4" />
          </button>
          <button 
            onClick={copyLink}
            className="w-9 h-9 flex items-center justify-center rounded-sm bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
            data-testid={`button-copy-link-${article.id}`}
          >
            {linkCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
