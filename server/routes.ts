import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Parser from "rss-parser";

const parser = new Parser();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.articles.list.path, async (req, res) => {
    try {
      // Use z.coerce for query params usually, or just manual parsing since they are strings
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
      await seedDatabase();
      res.json({ count: 1 }); // Just a success signal
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ message: "Sync failed" });
    }
  });

  // Seed on startup
  seedDatabase().catch(console.error);

  return httpServer;
}

// Simple mapping of RSS feeds to Categories
const FEEDS = [
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News', category: 'World', lang: 'en' },
  { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', source: 'BBC News', category: 'Technology', lang: 'en' },
  { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC News', category: 'Business', lang: 'en' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera', category: 'World', lang: 'en' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'NYT', category: 'World', lang: 'en' },
  // Arabic feeds (some might be tricky with encoding, but rss-parser handles most)
  { url: 'https://www.aljazeera.net/aljazeerarss/a7c186be-1adb-4580-8232-06dc947dd866', source: 'Al Jazeera Arabic', category: 'World', lang: 'ar' },
];

async function seedDatabase() {
  console.log("Seeding database with RSS feeds...");
  
  for (const feed of FEEDS) {
    try {
      const feedResult = await parser.parseURL(feed.url);
      
      const articles = feedResult.items.map(item => {
        // Simple heuristic for image: check content:encoded or enclosure
        let imageUrl = null;
        if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
          imageUrl = item.enclosure.url;
        } else if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
           imageUrl = item['media:content']['$'].url;
        }

        return {
          title: item.title || 'Untitled',
          summary: item.contentSnippet || item.content || '',
          content: item.content || '',
          url: item.link || '',
          imageUrl: imageUrl,
          source: feed.source,
          category: feed.category,
          language: feed.lang,
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
          location: generateRandomLocation(), // Mock location for the globe
        };
      });

      await storage.bulkCreateArticles(articles);
      console.log(`Imported ${articles.length} articles from ${feed.source} (${feed.category})`);
    } catch (error) {
      console.error(`Failed to parse feed ${feed.url}:`, error);
    }
  }
}

function generateRandomLocation() {
  // Generate random lat/lng mostly on land masses roughly
  // This is just for visual effect on the globe
  const lat = (Math.random() * 160) - 80;
  const lng = (Math.random() * 360) - 180;
  return { lat, lng, label: "News Location" };
}
