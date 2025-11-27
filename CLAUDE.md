# Halulu is Hungry AI - Project Documentation

## Overview

Restaurant discovery app using Google Gemini AI with Google Maps grounding. Users enter a food craving, AI analyzes nearby restaurant reviews, and returns ranked recommendations with pros/cons quotes.

**Tech Stack:**
- React 19.2 + TypeScript 5.8
- Vite 6.2 (build tool)
- Tailwind CSS v4 (new PostCSS architecture)
- Framer Motion (animations)
- @google/genai SDK (Gemini API)
- React Router DOM v7

---

## Project Structure

```
/
├── App.tsx                    # Router: "/" and "/app" routes
├── index.tsx                  # React root mount
├── index.html                 # HTML entry + importmap
├── index.css                  # Tailwind v4 + design tokens
├── types.ts                   # TypeScript interfaces
├── constants.ts               # Configuration values
│
├── pages/
│   ├── LandingPage.tsx        # Marketing hero page
│   └── AppPage.tsx            # Search + results page
│
├── components/
│   ├── premium-search.tsx     # Search bar + filters + buttons
│   ├── restaurant-grid-card.tsx # Result card with ratings
│   ├── luxury-loading.tsx     # Loading state animation
│   ├── luxury-error.tsx       # Error display
│   └── ui/                    # shadcn components
│       ├── card.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       └── alert.tsx
│
├── services/
│   └── geminiService.ts       # Gemini API integration
│
├── lib/
│   └── utils.ts               # Tailwind cn() helper
│
└── public/
    ├── fonts/                 # Fredoka, Quicksand fonts
    └── images/                # Halulu character, illustrations
```

---

## Key Files

### App.tsx
Simple router with 2 routes:
- `/` → LandingPage
- `/app` → AppPage

### pages/LandingPage.tsx
Marketing page with hero, problem/solution sections, pricing, FAQ.

### pages/AppPage.tsx
Main application:
- Geolocation on mount
- Search state management
- API call to `findRestaurants()`
- Results grid rendering

**State:**
```typescript
location: Coordinates | null
restaurants: Restaurant[]
searchQuery: string
activeFilters: string[]
isLoading: boolean
error: string | null
```

### services/geminiService.ts
AI integration:
- `validateAPIKey()` - Check if key exists
- `findRestaurants(location, query, filters)` - Main search

**Model:** `gemini-2.5-pro`

**Features:**
- Retry with exponential backoff (max 3 retries)
- Deduplication by Maps URL
- Grounding metadata extraction

### types.ts
```typescript
interface Restaurant {
  name: string
  aiRating: number         // 1.0-5.0 weighted score
  googleRating: number
  googleReviewsCount: number
  pros: string[]           // 3 review quotes
  cons: string[]           // 3 review quotes
  mapsUrl: string          // Google Maps link
  title: string            // Official name
}

interface Coordinates {
  latitude: number
  longitude: number
}

// Custom errors
QuotaExceededError, APIKeyError, NetworkError, InvalidResponseError
```

### constants.ts
```typescript
AI_MODEL_NAME: 'gemini-2.5-pro'
ATTRIBUTE_FILTERS: ['Cozy', 'Romantic', 'Family Friendly', 'Good for groups', 'Outdoor seating']
INSPIRATIONS: Array<string>  // 33 search suggestions
DISPLAY_LIMITS: { PROS_COUNT: 2, CONS_COUNT: 1 }
```

---

## Design System

### Colors
```css
--brand-dark: #1a1a2e      /* Near black - text, borders */
--brand-coral: #FF6B6B     /* PRIMARY - buttons, accents */
--brand-teal: #00CEC9      /* SECONDARY - shadows, highlights */
--brand-yellow: #FFD93D    /* ACCENT - AI score boxes */
--brand-pink: #FD79A8      /* Playful accent */
--brand-purple: #A855F7    /* Fun accent */
--brand-green: #00B894     /* Fresh accent */
--brand-cream: #FFF8F0     /* BACKGROUND */
--brand-muted: #6B7280     /* Muted text */
```

### Typography
**Font:** Fredoka (Google Fonts)
- `.font-display` - Headlines (600)
- `.font-display-black` - Hero text (700)
- `.font-body` - Body text (400)

### Neobrutalist Patterns
```css
/* Borders */
border-4 border-brand-dark

/* Shadows (hard offset, no blur) */
shadow-[6px_6px_0px_0px_var(--brand-teal)]
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]

/* Hover */
hover:shadow-[8px_8px_0px_0px_var(--brand-teal)]
hover:-translate-x-0.5 hover:-translate-y-0.5
```

---

## Tailwind v4 Setup

**Critical:** Uses Tailwind CSS v4.1.17

### CSS Import (index.css)
```css
@import "tailwindcss";

@theme {
  --color-brand-dark: #1a1a2e;
  --color-brand-coral: #FF6B6B;
  /* etc. */
}
```

### PostCSS Config
```javascript
plugins: {
  '@tailwindcss/postcss': {},
  autoprefixer: {}
}
```

**Note:** v4 uses `@theme` directive, not `tailwind.config.js` for colors.

---

## Environment Setup

### Required
Create `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

### Get API Key
https://aistudio.google.com/apikey

### Commands
```bash
npm install       # Install dependencies
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
```

---

## Common Tasks

| Task | Location |
|------|----------|
| Add filter | `constants.ts` → `ATTRIBUTE_FILTERS` |
| Change AI model | `constants.ts` → `AI_MODEL_NAME` |
| Update colors | `index.css` → `@theme` block |
| Modify AI prompt | `geminiService.ts` → `findRestaurants()` |
| Add component | Create in `components/`, import where needed |

---

## Things to Be Careful With

1. **Tailwind v4** - Use `@import "tailwindcss"` not `@tailwind`
2. **API key** - Bundled client-side (visible in browser)
3. **Grounding** - Complex name normalization for URL matching
4. **JSON parsing** - AI may include markdown, must be cleaned

---

## Error Types

| Error | Cause | Message |
|-------|-------|---------|
| QuotaExceededError | Rate limit | "API rate limit reached..." |
| APIKeyError | Invalid key | "API key error..." |
| NetworkError | Connection | "Network connection issue..." |
| InvalidResponseError | Bad JSON | "Unexpected response..." |
