import { z } from 'zod';
import { insertArticleSchema, articles, CATEGORIES, LANGUAGES } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  articles: {
    list: {
      method: 'GET' as const,
      path: '/api/articles',
      input: z.object({
        category: z.enum(CATEGORIES).optional(),
        language: z.enum(LANGUAGES).optional(),
        search: z.string().optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof articles.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/articles/:id',
      responses: {
        200: z.custom<typeof articles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    sync: { // Admin or cron endpoint to trigger fetch
      method: 'POST' as const,
      path: '/api/articles/sync',
      responses: {
        200: z.object({ count: z.number() }),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ArticleResponse = z.infer<typeof api.articles.list.responses[200]>[number];
