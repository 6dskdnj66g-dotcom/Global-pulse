import { create } from 'zustand';
import { useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageState {
  language: Language;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  'nav.politics': { en: 'Politics', ar: 'سياسة' },
  'nav.economy': { en: 'Economy', ar: 'اقتصاد' },
  'nav.technology': { en: 'Technology', ar: 'تكنولوجيا' },
  'nav.sports': { en: 'Sports', ar: 'رياضة' },
  'nav.culture': { en: 'Culture', ar: 'ثقافة' },
  'nav.world': { en: 'World', ar: 'العالم' },
  'nav.health': { en: 'Health', ar: 'صحة' },
  'nav.social': { en: 'Social', ar: 'اجتماعي' },
  'nav.business': { en: 'Business', ar: 'أعمال' },
  'nav.education': { en: 'Education', ar: 'تعليم' },
  'nav.entertainment': { en: 'Entertainment', ar: 'ترفيه' },
  'nav.science': { en: 'Science', ar: 'علوم' },
  'nav.general': { en: 'General', ar: 'عام' },
  'nav.more': { en: 'More', ar: 'المزيد' },
  'search.placeholder': { en: 'Search news...', ar: 'بحث في الأخبار...' },
  'hero.breaking': { en: 'Breaking News', ar: 'عاجل' },
  'hero.featured': { en: 'Featured Story', ar: 'قصة مميزة' },
  'read.more': { en: 'Read Full Story', ar: 'اقرأ القصة كاملة' },
  'latest.news': { en: 'Latest Headlines', ar: 'آخر العناوين' },
  'loading': { en: 'Loading updates...', ar: 'جاري التحميل...' },
  'error': { en: 'Unable to load news', ar: 'تعذر تحميل الأخبار' },
  'globe.view': { en: 'Global View', ar: 'نظرة عالمية' },
};

export const useLanguage = create<LanguageState>((set, get) => ({
  language: 'en',
  dir: 'ltr',
  setLanguage: (lang) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    set({ language: lang, dir });
  },
  toggleLanguage: () => {
    const current = get().language;
    const next = current === 'en' ? 'ar' : 'en';
    get().setLanguage(next);
  },
  t: (key) => {
    const lang = get().language;
    return translations[key]?.[lang] || key;
  },
}));

// Initialize helper hook to sync with DOM
export function useLanguageEffect() {
  const { language, dir } = useLanguage();
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);
}
