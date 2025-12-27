import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const NEWS_API_BASE = "https://newsapi.org/v2";

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

const CATEGORY_MAP: Record<string, string> = {
  "Politics": "politics",
  "Economy": "business",
  "Social": "general",
  "Business": "business",
  "Education": "science",
  "Culture": "entertainment",
  "Technology": "technology",
  "Sports": "sports",
  "World": "general",
  "Health": "health",
  "Entertainment": "entertainment"
};

async function syncAllNews() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.error("NEWS_API_KEY not found");
    return;
  }

  console.log("Syncing real-time news from NewsAPI...");
  
  const langs = ["en", "ar"];
  const newsCategories = ["Politics", "Business", "Technology", "Sports", "Health", "Entertainment", "World"];

  for (const lang of langs) {
    for (const cat of newsCategories) {
      try {
        const query = lang === 'ar' ? 'أخبار' : 'news';
        const newsApiCategory = CATEGORY_MAP[cat] || 'general';
        
        // NewsAPI top-headlines or everything
        const response = await fetch(
          `${NEWS_API_BASE}/top-headlines?category=${newsApiCategory}&language=${lang}&apiKey=${apiKey}&pageSize=20`
        );
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
          const articlesToInsert = data.articles
            .filter((a: any) => a.title && a.url && a.title !== '[Removed]')
            .map((a: any) => ({
              title: a.title,
              summary: a.description || a.content || '',
              content: a.content || '',
              url: a.url,
              imageUrl: a.urlToImage,
              source: a.source?.name || 'Unknown',
              category: cat,
              language: lang,
              publishedAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
              location: generateRandomLocation(),
            }));

          await storage.bulkCreateArticles(articlesToInsert);
          console.log(`Synced ${articlesToInsert.length} ${lang} articles for ${cat}`);
        }
      } catch (err) {
        console.error(`Error syncing ${lang} ${cat}:`, err);
      }
    }
  }
}

function generateRandomLocation() {
  const lat = (Math.random() * 160) - 80;
  const lng = (Math.random() * 360) - 180;
  return { lat, lng, label: "News Location" };
}
