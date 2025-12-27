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
    // Use onConflictDoNothing based on URL to avoid duplicates
    // Note: Drizzle's onConflictDoNothing requires a unique constraint target. 
    // We haven't defined one on URL yet, but usually we should.
    // For now, let's just insert one by one or use a simple check.
    // Better: Add unique index on URL in schema, but schema is already written.
    // We'll just check existence efficiently or ignore errors.
    
    for (const article of articlesList) {
      const existing = await db.select().from(articles).where(eq(articles.url, article.url)).limit(1);
      if (existing.length === 0) {
        await db.insert(articles).values(article);
      }
    }
  }
}

export const storage = new DatabaseStorage();
