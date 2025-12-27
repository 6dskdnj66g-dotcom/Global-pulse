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
  { url: 'https://www.aljazeera.net/aljazeerarss/feed', lang: 'ar', source: 'Al Jazeera Arabic' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', lang: 'en', source: 'BBC World News' },
  { url: 'https://feeds.bbci.co.uk/arabic/world/rss.xml', lang: 'ar', source: 'BBC Arabic' },
  { url: 'http://rss.cnn.com/rss/cnn_world.rss', lang: 'en', source: 'CNN World News' },
  { url: 'https://www.reutersagency.com/feed/?best-topics=world&post_type=best', lang: 'en', source: 'Reuters World News' },
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
      res.json({ success: true });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ message: "Sync failed" });
    }
  });

  // Initial sync on startup
  syncAllNews().catch(console.error);

  return httpServer;
}

function categorizeArticle(title: string, content: string): string {
  const combined = (title + " " + content).toLowerCase();
  if (combined.match(/politics|government|election|parliament|سياسة|حكومة|انتخابات/)) return "Politics";
  if (combined.match(/economy|business|finance|market|stock|اقتصاد|أعمال|مال|سوق/)) return "Economy";
  if (combined.match(/tech|science|digital|ai|software|تكنولوجيا|علوم|ذكاء/)) return "Technology";
  if (combined.match(/sport|football|match|fifa|olympic|رياضة|كرة/)) return "Sports";
  if (combined.match(/health|medical|virus|hospital|صحة|طبي/)) return "Health";
  if (combined.match(/entertainment|movie|music|celebrity|ترفيه|سينما/)) return "Entertainment";
  return "World";
}

async function syncAllNews() {
  console.log("Syncing real-time news from RSS feeds...");
  
  const allArticles: any[] = [];

  await Promise.all(FEEDS.map(async (feed) => {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      const items = parsedFeed.items.map(item => {
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
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          location: generateRandomLocation(),
        };
      });
      allArticles.push(...items.filter(a => a.url));
    } catch (err) {
      console.error(`Error syncing feed ${feed.url}:`, err);
    }
  }));

  // Sort by date descending and take latest
  allArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  
  // Deduplicate and insert
  if (allArticles.length > 0) {
    await storage.bulkCreateArticles(allArticles);
    console.log(`Synced ${allArticles.length} articles from RSS feeds`);
  }
}

function generateRandomLocation() {
  const lat = (Math.random() * 160) - 80;
  const lng = (Math.random() * 360) - 180;
  return { lat, lng, label: "News Location" };
}
