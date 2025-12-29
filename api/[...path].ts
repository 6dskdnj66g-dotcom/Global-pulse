import express, { type Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, desc, sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";
import Parser from "rss-parser";
import OpenAI from "openai";
import cors from "cors";

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  url: text("url").notNull().unique(),
  imageUrl: text("image_url"),
  source: text("source").notNull(),
  category: text("category").notNull(),
  language: text("language").notNull().default("en"),
  publishedAt: timestamp("published_at").defaultNow(),
  location: jsonb("location"),
});

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', lang: 'en', source: 'New York Times' },
  { url: 'https://feeds.washingtonpost.com/rss/world', lang: 'en', source: 'Washington Post' },
  { url: 'http://rss.cnn.com/rss/edition.rss', lang: 'en', source: 'CNN' },
  { url: 'https://feeds.nbcnews.com/nbcnews/public/news', lang: 'en', source: 'NBC News' },
  { url: 'https://abcnews.go.com/abcnews/topstories', lang: 'en', source: 'ABC News' },
  { url: 'https://feeds.foxnews.com/foxnews/latest', lang: 'en', source: 'Fox News' },
  { url: 'https://feeds.npr.org/1001/rss.xml', lang: 'en', source: 'NPR' },
  { url: 'https://www.cbsnews.com/latest/rss/main', lang: 'en', source: 'CBS News' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', lang: 'en', source: 'BBC News' },
  { url: 'https://www.theguardian.com/world/rss', lang: 'en', source: 'The Guardian' },
  { url: 'https://news.sky.com/feeds/rss/world.xml', lang: 'en', source: 'Sky News' },
  { url: 'https://www.independent.co.uk/news/world/rss', lang: 'en', source: 'The Independent' },
  { url: 'https://www.telegraph.co.uk/rss.xml', lang: 'en', source: 'The Telegraph' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', lang: 'en', source: 'Al Jazeera English' },
  { url: 'https://www.reuters.com/rssFeed/worldNews', lang: 'en', source: 'Reuters' },
  { url: 'https://rss.dw.com/xml/rss-en-all', lang: 'en', source: 'Deutsche Welle' },
  { url: 'https://www.france24.com/en/rss', lang: 'en', source: 'France 24' },
  { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', lang: 'en', source: 'Times of India' },
  { url: 'https://www.japantimes.co.jp/feed/', lang: 'en', source: 'Japan Times' },
  { url: 'https://www.scmp.com/rss/91/feed', lang: 'en', source: 'South China Morning Post' },
  { url: 'https://www.abc.net.au/news/feed/51120/rss.xml', lang: 'en', source: 'ABC Australia' },
  { url: 'https://globalnews.ca/feed/', lang: 'en', source: 'Global News Canada' },
  { url: 'https://www.aljazeera.net/aljazeerarss/feed', lang: 'ar', source: 'Al Jazeera Arabic' },
  { url: 'https://feeds.bbci.co.uk/arabic/rss.xml', lang: 'ar', source: 'BBC Arabic' },
  { url: 'https://www.france24.com/ar/rss', lang: 'ar', source: 'France 24 Arabic' },
  { url: 'https://www.skynewsarabia.com/web/rss', lang: 'ar', source: 'Sky News Arabia' },
  { url: 'https://arabic.rt.com/rss/', lang: 'ar', source: 'RT Arabic' },
  { url: 'https://www.alarabiya.net/.mrss/ar.xml', lang: 'ar', source: 'Al Arabiya' },
];

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

function generateRandomLocation() {
  const lat = (Math.random() * 160) - 80;
  const lng = (Math.random() * 360) - 180;
  return { lat, lng, label: "News Location" };
}

app.get("/api/articles", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const language = req.query.language as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    let conditions: any[] = [];
    if (category) conditions.push(eq(articles.category, category));
    if (language) conditions.push(eq(articles.language, language));
    if (search) {
      conditions.push(
        sql`(${articles.title} ILIKE ${`%${search}%`} OR ${articles.summary} ILIKE ${`%${search}%`})`
      );
    }

    const result = await db.select()
      .from(articles)
      .where(and(...conditions))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    res.json(result);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

app.get("/api/articles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, language } = req.body;
    
    const recentArticles = await db.select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(10);
    
    const context = recentArticles.map(a => `- ${a.title}: ${a.summary}`).join("\n");
    
    const systemPrompt = language === 'ar' 
      ? `أنت مساعد أخبار ذكي لمنصة Global Pulse. استخدم السياق التالي للإجابة على أسئلة المستخدم حول الأخبار الحالية باللغة العربية. كن محترفاً ومختصراً.\n\nالسياق:\n${context}`
      : `You are a smart news assistant for Global Pulse. Use the following context to answer user questions about current news. Be professional and concise.\n\nContext:\n${context}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI assistant failed" });
  }
});

app.post("/api/articles/sync", async (req, res) => {
  try {
    console.log("Syncing news from RSS feeds...");
    const allArticles: any[] = [];
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await Promise.all(FEEDS.map(async (feed) => {
      try {
        const response = await fetch(feed.url, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const xml = await response.text();
        
        if (!xml || (!xml.includes('<?xml') && !xml.includes('<rss'))) {
          console.warn(`Skipping invalid XML from ${feed.source}`);
          return;
        }

        const parsedFeed = await parser.parseString(xml);
        const items = parsedFeed.items.map(item => {
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
          if (pubDate < twentyFourHoursAgo) return null;

          let imageUrl: string | null = null;
          if ((item as any).mediaContent?.[0]?.$.url) {
            imageUrl = (item as any).mediaContent[0].$.url;
          } else if (item.enclosure?.url) {
            imageUrl = item.enclosure.url as string;
          } else if ((item as any).mediaThumbnail?.[0]?.$.url) {
            imageUrl = (item as any).mediaThumbnail[0].$.url;
          }

          const content = (item as any).contentEncoded || item.content || (item as any).description || "";
          
          return {
            title: item.title || "Untitled",
            summary: (item as any).description || item.contentSnippet || "",
            content: content,
            url: item.link || "",
            imageUrl: imageUrl,
            source: feed.source,
            category: categorizeArticle(item.title || "", content),
            language: feed.lang,
            publishedAt: pubDate,
            location: generateRandomLocation(),
          };
        }).filter(a => a !== null && a?.url);
        allArticles.push(...items);
      } catch (err) {
        console.error(`Error syncing feed ${feed.url}:`, err);
      }
    }));

    allArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    
    if (allArticles.length > 0) {
      for (const article of allArticles) {
        try {
          await db.insert(articles)
            .values(article)
            .onConflictDoNothing({ target: articles.url });
        } catch (e) {}
      }
    }

    res.json({ success: true, count: allArticles.length, updated: new Date().toISOString() });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ message: "Sync failed" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

export default (req: Request, res: Response) => app(req, res);
