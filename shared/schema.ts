import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  url: text("url").notNull().unique(), // Unique constraint for deduplication
  imageUrl: text("image_url"),
  source: text("source").notNull(),
  category: text("category").notNull(),
  language: text("language").notNull().default('en'),
  publishedAt: timestamp("published_at").notNull(),
  location: jsonb("location"),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({ id: true });

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export const CATEGORIES = [
  "Politics", "Economy", "Social", "Business", "Education", 
  "Culture", "Technology", "Sports", "World", "Health", "Entertainment", "Science", "General"
] as const;

export const LANGUAGES = ["en", "ar"] as const;
