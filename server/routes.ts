import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
    ],
  },
});

const FEEDS = [
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', lang: 'en', source: 'Al Jazeera English' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', lang: 'en', source: 'BBC News' },
  { url: 'https://www.theguardian.com/rss', lang: 'en', source: 'The Guardian' },
  { url: 'https://news.sky.com/feeds/rss/world', lang: 'en', source: 'Sky News' },
  { url: 'http://rss.cnn.com/rss/edition.rss', lang: 'en', source: 'CNN' },
  { url: 'https://www.axios.com/feeds/feed.rss', lang: 'en', source: 'Axios' },
  { url: 'https://www.reuters.com/arc/outboundfeeds/news-handler/?outputType=xml', lang: 'en', source: 'Reuters' },
  { url: 'https://www.aljazeera.net/aljazeerarss/feed', lang: 'ar', source: 'Al Jazeera Arabic' },
  { url: 'https://feeds.bbci.co.uk/arabic/world/rss.xml', lang: 'ar', source: 'BBC Arabic' },
  { url: 'https://www.skynewsarabia.com/rss/v1/global.xml', lang: 'ar', source: 'Sky News Arabia' },
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.articles.list.path, async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const language = req.query.language as string | undefined;
      const search = req.query.search as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      // Filter for last 24 hours by default if requested
      const articles = await storage.getArticles({ category, language, search, limit });
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get(api.articles.get.path, async (req, res) => {
    const article = await storage.getArticle(Number(req.params.id));
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  });

  app.post(api.articles.sync.path, async (req, res) => {
    try {
      await syncAllNews();
      res.json({ success: true, updated: new Date().toISOString() });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ message: "Sync failed" });
    }
  });

  // Initial sync on startup
  syncAllNews().catch(console.error);

  // Auto-sync every 5 minutes
  setInterval(() => {
    syncAllNews().catch(console.error);
  }, 5 * 60 * 1000);

  return httpServer;
}

function categorizeArticle(title: string, content: string): string {
  const combined = (title + " " + content).toLowerCase();
  
  if (combined.match(/politics|government|election|parliament|minister|diplomacy|president|senate|سياسة|حكومة|انتخابات|برلمان|وزير|دبلوماسية/)) return "Politics";
  if (combined.match(/economy|business|finance|market|stock|trade|investment|inflation|crypto|اقتصاد|أعمال|مال|سوق|تجارة|استثمار|تضخم/)) return "Economy";
  if (combined.match(/social|society|people|community|human rights|welfare|activism|اجتماعي|مجتمع|ناس|حقوق الإنسان|رفاهية/)) return "Social";
  if (combined.match(/tech|science|digital|ai|software|robot|space|innovation|gadget|تكنولوجيا|علوم|ذكاء|فضاء|ابتكار/)) return "Technology";
  if (combined.match(/sport|football|match|fifa|olympic|tennis|basketball|soccer|رياضة|كرة|مباراة|أولمبياد/)) return "Sports";
  if (combined.match(/health|medical|virus|hospital|doctor|vaccine|pandemic|wellness|صحة|طبي|فيروس|مستشفى|طبيب|لقاح|وباء/)) return "Health";
  if (combined.match(/entertainment|movie|music|celebrity|cinema|arts|showbiz|fashion|ترفيه|سينما|موسيقى|فنون|مشاهير/)) return "Entertainment";
  if (combined.match(/education|school|university|student|learning|teach|academy|تعليم|مدرسة|جامعة|طالب|تعلم/)) return "Education";
  if (combined.match(/culture|heritage|tradition|literature|history|museum|ثقافة|تراث|تقاليد|أدب|تاريخ/)) return "Culture";
  
  return "World";
}

async function syncAllNews() {
  console.log("Syncing real-time news from RSS feeds...");
  
  const allArticles: any[] = [];
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  await Promise.all(FEEDS.map(async (feed) => {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      const items = parsedFeed.items.map(item => {
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // Skip articles older than 24 hours
        if (pubDate < twentyFourHoursAgo) return null;

        let imageUrl = null;
        if (item.mediaContent?.[0]?.$.url) {
          imageUrl = item.mediaContent[0].$.url;
        } else if (item.enclosure?.url) {
          imageUrl = item.enclosure.url;
        } else if (item.mediaThumbnail?.[0]?.$.url) {
          imageUrl = item.mediaThumbnail[0].$.url;
        }

        const content = item.contentEncoded || item.content || item.description || "";
        
        return {
          title: item.title || "Untitled",
          summary: item.description || item.contentSnippet || "",
          content: content,
          url: item.link || "",
          imageUrl: imageUrl,
          source: feed.source,
          category: categorizeArticle(item.title || "", content),
          language: feed.lang,
          publishedAt: pubDate,
          location: generateRandomLocation(),
        };
      }).filter(a => a !== null);
      allArticles.push(...items.filter(a => a?.url));
    } catch (err) {
      console.error(`Error syncing feed ${feed.url}:`, err);
    }
  }));

  // Sort by date descending
  allArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  
  if (allArticles.length > 0) {
    await storage.bulkCreateArticles(allArticles);
    console.log(`Synced ${allArticles.length} fresh articles from RSS feeds`);
  }
}

function generateRandomLocation() {
  const lat = (Math.random() * 160) - 80;
  const lng = (Math.random() * 360) - 180;
  return { lat, lng, label: "News Location" };
}
