# replit.md

## Overview

This is a bilingual (English/Arabic) news aggregation platform that fetches articles from NewsAPI and displays them in an elegant, modern interface. The application features a 3D interactive globe visualization for world news, category-based filtering, full-text search, and RTL language support. Articles are stored in a PostgreSQL database and synchronized periodically from external news sources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, Zustand for client state (language/theme)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Animations**: Framer Motion for 3D card effects and transitions
- **Visualization**: react-globe.gl for interactive 3D globe showing news hotspots

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod validation schemas
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Build System**: Custom build script using esbuild for server and Vite for client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - defines articles table with fields for title, summary, content, URL (unique), image, source, category, language, published date, and location (JSONB)
- **Migrations**: Drizzle Kit with migrations stored in `/migrations` directory

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `/shared` directory are used by both frontend and backend
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **Path Aliases**: TypeScript paths configured for `@/` (client), `@shared/` (shared), and `@assets/` (attached assets)
- **Bilingual Support**: Translation system in `use-language.ts` hook with RTL/LTR direction switching

### API Structure
- `GET /api/articles` - List articles with optional filters (category, language, search, limit)
- `GET /api/articles/:id` - Get single article by ID
- `POST /api/articles/sync` - Trigger news sync from NewsAPI

## External Dependencies

### Third-Party Services
- **NewsAPI** (`https://newsapi.org/v2`) - External news data source for article aggregation
- **Google Fonts** - Playfair Display, Amiri (Arabic serif), DM Sans, Cairo (Arabic sans-serif), Geist Mono, Fira Code

### Database
- **PostgreSQL** - Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple** - PostgreSQL session store (available but not actively used for sessions currently)

### Key NPM Dependencies
- **UI/Animation**: framer-motion, react-globe.gl, embla-carousel-react
- **Data Fetching**: @tanstack/react-query
- **Forms**: react-hook-form with @hookform/resolvers, zod for validation
- **Database**: drizzle-orm, drizzle-zod, pg
- **Date Handling**: date-fns
- **State**: zustand (via custom hooks pattern)

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string (required for database operations)
- `OPENAI_API_KEY` - OpenAI API key for AI news assistant feature

## Vercel Deployment

### Project Structure for Vercel
- `api/[...path].ts` - Catch-all serverless Express function for backend API routes
- `vercel.json` - Vercel configuration file with function settings
- `dist/public` - Vite build output directory for frontend

### Deployment Steps
1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Configure environment variables:
   - `POSTGRES_URL` or `DATABASE_URL` - PostgreSQL connection string (Vercel Postgres recommended)
   - `OPENAI_API_KEY` - OpenAI API key for AI assistant
4. Deploy

### Database Setup for Vercel
- Use Vercel Postgres (Neon) for database
- Create the articles table using SQL:
```sql
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  url TEXT NOT NULL UNIQUE,
  image_url TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  published_at TIMESTAMP DEFAULT NOW(),
  location JSONB
);
```
- After deployment, call `/api/articles/sync` to populate articles