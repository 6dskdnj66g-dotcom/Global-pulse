import { db } from "./db";
import { articles, type InsertArticle, type Article } from "@shared/schema";
import { eq, like, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  getArticles(filters?: { category?: string; language?: string; search?: string; limit?: number }): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  bulkCreateArticles(articlesList: InsertArticle[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getArticles(filters?: { category?: string; language?: string; search?: string; limit?: number }): Promise<Article[]> {
    let conditions = [];
    if (filters?.category) conditions.push(eq(articles.category, filters.category));
    if (filters?.language) conditions.push(eq(articles.language, filters.language));
    if (filters?.search) {
      conditions.push(
        sql`(${articles.title} ILIKE ${`%${filters.search}%`} OR ${articles.summary} ILIKE ${`%${filters.search}%`})`
      );
    }

    return await db.select()
      .from(articles)
      .where(and(...conditions))
      .orderBy(desc(articles.publishedAt))
      .limit(filters?.limit || 50);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async bulkCreateArticles(articlesList: InsertArticle[]): Promise<void> {
    if (articlesList.length === 0) return;
    try {
      // Use onConflictDoUpdate or Ignore now that we have unique constraint
      await db.insert(articles)
        .values(articlesList)
        .onConflictDoNothing({ target: articles.url });
    } catch (error) {
      console.error("Bulk insert error:", error);
    }
  }
}

export const storage = new DatabaseStorage();
