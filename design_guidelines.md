# Washington Post Style News Aggregator Design Guidelines

## Design Approach
**Framework:** Washington Post editorial design + Modern glassmorphism  
**Core Principle:** Typographic authority with contemporary glass effects; professional gravitas meets modern UI

---

## Typography System

**Font Stack:** 
- Headlines/Display: font-serif (Georgia, 'Times New Roman')
- UI Elements: Inter (sans-serif for metadata, buttons, labels)
- Article Body: font-serif with generous line-height

**Hierarchy:**
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold (700), leading-tight
- Section Headers: text-3xl md:text-4xl, font-bold, letter-spacing tight
- Article Titles: text-xl md:text-2xl, font-semibold (600)
- Metadata: text-sm, font-medium, uppercase, tracking-wider
- Body: text-base md:text-lg, leading-relaxed (1.75)

---

## Color Palette

**Primary Colors:**
- Deep Red: #990000 (masthead, accents, CTAs)
- Rich Black: #000000 (headlines, primary text)
- Light Gray: #f4f4f4 (backgrounds, cards)
- Pure White: #ffffff (contrast backgrounds)

**Glassmorphism Layers:**
- Glass Cards: bg-white/10, backdrop-blur-xl, border border-white/20
- Glass Buttons: bg-white/20, backdrop-blur-md, shadow-lg
- Navigation Bar: bg-white/80, backdrop-blur-lg, border-b border-gray-200/50

---

## Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16, 20, 24, 32  
**Grid Structure:**
- Desktop: 4-column article grid for main content, sidebar for trending
- Tablet: 2-column responsive
- Mobile: Single column, full-width cards

**Container Widths:**
- Full sections: max-w-7xl
- Article reading: max-w-4xl
- Sidebar: w-80 (fixed desktop width)

---

## Component Library

**Masthead:**
- Centered elegant Globe icon logo (SVG, 48px height)
- Deep red (#990000) border-b-2 below header
- Navigation links in uppercase serif, letter-spaced
- Search icon, dark mode toggle, profile (right-aligned)

**Hero Section:**
- Full-width dramatic news photograph (1920x1080, 70vh height)
- Dark gradient overlay (black 0% to 80% opacity bottom)
- Headline in white serif, text-shadow for depth
- Deck/snippet text (2-3 lines, leading-relaxed)
- Glass CTA button (bg-white/20, backdrop-blur-md) - no hover state needed
- Byline + timestamp in white, text-sm

**Article Cards (Glass Effect):**
- bg-white/10 with backdrop-blur-xl
- border border-white/20, shadow-xl
- Rounded-lg (12px radius)
- 16:9 image at top
- Red category badge (bg-red-900, text-white, uppercase, text-xs)
- Serif headline (2 lines, truncate)
- Metadata row: source + timestamp + bookmark icon
- Padding p-6, gap-4 between elements

**Category Navigation:**
- Sticky horizontal scroll bar (top-0 after scroll)
- Glass background: bg-white/90, backdrop-blur-lg
- Active state: bg-red-900 text-white
- Inactive: text-black hover:bg-gray-200/50

**Breaking News Banner:**
- Fixed top, bg-red-900
- White uppercase text, bold
- Auto-scrolling ticker for multiple alerts
- Dismissible X icon (right)

**Sidebar (Desktop):**
- Glass container with bg-white/10, backdrop-blur-xl
- "Most Read" numbered list (1-10, serif numbers)
- "Editor's Picks" with thumbnail + headline
- Newsletter signup (glass input field, red CTA)

**Opinion Section:**
- Distinguished by serif italic subheads
- Author headshot (circular, 64px)
- Byline prominence with credentials
- bg-gray-50 background separation

**Footer:**
- Four columns: Sections, Company, Legal, Social
- Deep red separator line at top
- Newsletter signup (inline glass input)
- Copyright in small serif

---

## Images

**Hero Image:**
- Large, high-impact photojournalism (current global events)
- Dramatic composition with strong subjects
- Dark gradient overlay for text legibility
- Buttons use backdrop-blur-md backgrounds

**Article Thumbnails:**
- Consistent 16:9 aspect ratio
- High-quality news photography
- Lazy loading with shimmer placeholders

**Section Headers:**
- Politics: Capitol imagery
- World: Globe/maps
- Business: Financial charts/buildings
- Technology: Digital/abstract tech visuals

---

## Glassmorphism Implementation

**Glass Cards Pattern:**
- All article cards use: bg-white/10, backdrop-blur-xl, border border-white/20
- Layered over subtle gradient backgrounds (gray-100 to gray-50)
- Drop shadows: shadow-lg for depth

**Glass Navigation:**
- Top nav bar: bg-white/80, backdrop-blur-lg
- Category chips: bg-white/20 when inactive, full red when active

**Glass Buttons:**
- CTA buttons: bg-white/20, backdrop-blur-md, text-white
- Border: border border-white/30
- No custom hover states (component handles)

---

## Layout Sections (In Order)

1. Breaking News Ticker (conditional)
2. Masthead (Globe logo, deep red accent line)
3. Hero Feature (large image, glass CTA, dramatic headline)
4. Category Navigation (sticky glass bar)
5. Top Stories Grid (4 columns, glass cards, 8 articles)
6. Analysis/Opinion Strip (distinguished styling, author photos)
7. Regional News (2-column split with glass divider)
8. Live Updates Feed (glass cards, timestamp badges)
9. Video News Carousel (horizontal glass cards)
10. Most Read Sidebar (persistent desktop)
11. Footer (comprehensive, red accent line)

---

## Accessibility & Performance

- High contrast maintained (black on white, white on red)
- Semantic HTML with ARIA labels
- Keyboard navigation for all interactive elements
- RTL support: Full layout mirroring for Arabic (reversed grids, flipped spacing)
- Lazy load images below fold
- Skeleton screens with shimmer during initial load
- Minimal animations: Only loading feedback and new content pulse indicators