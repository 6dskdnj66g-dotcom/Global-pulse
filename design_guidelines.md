# Global News Aggregator Design Guidelines

## Design Approach
**Selected Framework:** Hybrid of Apple HIG (typography clarity) + Material Design (card organization)  
**References:** Apple News, BBC News, Bloomberg  
**Core Principle:** Information density without overwhelming users; scannable hierarchy with immediate comprehension

---

## Typography System

**Headline Hierarchy:**
- Hero/Featured: 3xl-6xl, bold weight (700-800), tight leading (-0.02em)
- Section Headers: 2xl-3xl, semibold (600)
- Article Titles: lg-xl, semibold (600), balanced line height (1.4)
- Metadata/Timestamps: sm, medium (500), uppercase tracking
- Body Text: base, regular (400), comfortable leading (1.6)

**Font Stack:** Inter for headlines/UI, Georgia for article body text (readability)  
**RTL Support:** Ensure Arabic text uses Noto Sans Arabic or Cairo, full RTL layout mirroring

---

## Layout System

**Spacing Units:** Tailwind 3, 4, 6, 8, 12, 16, 24 for consistent rhythm  
**Grid Strategy:**
- Desktop: 3-4 column article grids
- Tablet: 2 columns
- Mobile: Single column with horizontal scroll for category chips

**Container Widths:**
- Full sections: max-w-7xl
- Article content: max-w-4xl
- Reading view: max-w-prose

---

## Component Library

**Hero Section:**
- Full-width featured story with large background image (70vh)
- Gradient overlay (dark at bottom) for text legibility
- Headline + snippet + category tag + timestamp
- Primary CTA button with backdrop-blur-md background
- Secondary trending headlines sidebar (desktop only)

**Article Cards:**
- Image thumbnail (16:9 or 4:3 aspect ratio)
- Category badge (colored, top-left)
- Headline (2 lines max, truncate)
- Source + timestamp metadata
- Bookmark/share icons (subtle, right-aligned)

**Category Navigation:**
- Horizontal scrollable chip bar below hero
- Active state: filled background with subtle shadow
- Sticky position on scroll

**Breaking News Banner:**
- Fixed top bar with red accent indicator
- Auto-scroll text for multiple alerts
- Dismissible with slide animation

**Sidebar Components (Desktop):**
- "Trending Now" numbered list (1-10)
- "Editor's Picks" with small thumbnails
- Ad placement zones (clearly separated)

**Footer:**
- Multi-column layout: Categories, About, Languages, Social
- Newsletter signup with inline validation
- Copyright + legal links

---

## Images

**Hero Image:**
- Large, high-impact photojournalism image (1920x1080 minimum)
- Dramatic news photography (current events, global significance)
- Dark gradient overlay 60% opacity from bottom
- All text and CTAs use backdrop-blur for readability

**Article Thumbnails:**
- Consistent aspect ratios across all cards
- Lazy loading for performance
- Placeholder shimmer states during load

**Category Images:**
- Each major category (Politics, Sports, Tech, etc.) has iconic imagery
- Used in category landing pages and navigation

---

## Layout Sections

1. **Breaking News Bar** (sticky, conditional)
2. **Header** (logo, search, language toggle, dark mode toggle, profile)
3. **Hero Featured Story** (large image, blurred button backgrounds)
4. **Category Navigation** (horizontal scrollable chips)
5. **Top Stories Grid** (3-4 columns, 6-8 articles)
6. **Regional News Section** (2 column split by language)
7. **Live Updates Feed** (card stream with timestamp animations)
8. **Video News** (horizontal scroll carousel)
9. **Opinion/Analysis** (distinctive styling, author photos)
10. **Footer** (comprehensive navigation)

---

## Interactions

**Micro-interactions:**
- Card hover: subtle lift (translateY -2px) + shadow increase
- Image lazy load: shimmer animation placeholder
- Real-time badge pulse on new content
- Smooth scroll to category sections

**Loading States:**
- Skeleton screens for initial page load
- Progressive content loading (above-fold first)
- Infinite scroll for article feeds

**Animations:** Minimal - only for loading feedback and real-time update indicators (subtle badge pulse). No gratuitous scroll effects.

---

## Accessibility & RTL

- Semantic HTML hierarchy throughout
- ARIA labels for all interactive elements
- Keyboard navigation for all features
- Full RTL layout mirroring for Arabic (flipped grids, reversed padding/margins)
- Language toggle instantly switches entire interface direction