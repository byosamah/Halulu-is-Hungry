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
- Supabase (auth, database, edge functions)
- Lemon Squeezy (payments)

---

## Project Structure

```
/
├── App.tsx                    # Router + auth guards
├── index.tsx                  # React root mount
├── index.html                 # HTML entry + SEO meta tags + JSON-LD schemas
├── index.css                  # Tailwind v4 + design tokens
├── types.ts                   # TypeScript interfaces
├── constants.ts               # Configuration values
│
├── pages/
│   ├── LandingPage.tsx        # Marketing hero page
│   ├── AppPage.tsx            # Search + results page
│   ├── AuthPage.tsx           # Login/signup with Supabase
│   ├── PricingPage.tsx        # Subscription plans (Lemon Squeezy)
│   └── ProfilePage.tsx        # User profile + subscription management
│
├── components/
│   ├── premium-search.tsx     # Search bar + filters + buttons
│   ├── restaurant-grid-card.tsx # Result card with ratings
│   ├── luxury-loading.tsx     # Loading state animation
│   ├── luxury-error.tsx       # Error display
│   ├── SearchCounter.tsx      # Usage tracking display (neobrutalist)
│   ├── UsageLimitModal.tsx    # Upgrade prompt modal
│   ├── HeaderProfile.tsx      # User avatar + dropdown
│   ├── UserAvatar.tsx         # Avatar with customization
│   ├── LanguageSwitcher.tsx   # EN/AR toggle
│   └── ui/                    # shadcn components
│
├── contexts/
│   ├── AuthContext.tsx        # Supabase auth state
│   ├── UsageContext.tsx       # Search limits tracking
│   └── LanguageContext.tsx    # i18n + RTL support
│
├── services/
│   └── geminiService.ts       # Gemini API integration
│
├── lib/
│   ├── utils.ts               # Tailwind cn() helper
│   ├── supabase.ts            # Supabase client
│   └── avatarUtils.ts         # Avatar generation
│
├── translations/
│   ├── en.ts                  # English strings
│   └── ar.ts                  # Arabic strings (RTL)
│
├── utils/
│   └── rtlShadow.ts           # RTL-aware shadow utility
│
├── supabase/
│   ├── schema.sql             # Database schema
│   └── functions/
│       └── lemon-squeezy-webhook/ # Payment webhook handler
│
└── public/
    ├── fonts/                 # Fredoka, Quicksand fonts
    ├── logo.svg               # App logo
    ├── preview.png            # Social media preview image
    ├── robots.txt             # SEO + AI crawler permissions
    ├── sitemap.xml            # Site structure for search engines
    └── manifest.json          # PWA manifest
```

---

## Key Features

### Authentication (Supabase)
- Email/password signup with email verification
- Magic link login
- Session persistence
- Profile management

### Usage Limits
- Free tier: 3 searches/day
- Premium: Unlimited searches
- Real-time counter in header
- Upgrade prompts when limit reached

### Payments (Lemon Squeezy)
- Monthly subscription ($4.99)
- Webhook handling via Supabase Edge Function
- Subscription status sync to database
- Customer portal for management

### Internationalization
- Full English + Arabic support
- RTL layout for Arabic
- Language persisted in localStorage
- RTL-aware shadow utilities

### SEO/GEO/AEO (Search & AI Optimization)
- Comprehensive meta tags (OG, Twitter Cards)
- JSON-LD schemas (SoftwareApplication, FAQPage, WebSite)
- robots.txt allowing all AI crawlers (GPTBot, Claude, Perplexity)
- sitemap.xml with hreflang for EN/AR
- PWA manifest

---

## Database Schema (Supabase)

```sql
-- User profiles (extends Supabase auth.users)
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text,
  display_name text,
  avatar_config jsonb,
  created_at timestamp,
  updated_at timestamp
)

-- Search usage tracking
usage_tracking (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  search_count integer DEFAULT 0,
  last_search_date date,
  created_at timestamp
)

-- Subscription status
subscriptions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  lemon_squeezy_customer_id text,
  lemon_squeezy_subscription_id text,
  status text, -- 'active', 'cancelled', 'expired'
  plan_type text, -- 'monthly', 'yearly'
  current_period_end timestamp,
  created_at timestamp,
  updated_at timestamp
)
```

---

## Environment Variables

```bash
# .env.local
GEMINI_API_KEY=your_gemini_key

# Supabase (from project settings)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Lemon Squeezy (for webhook verification)
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
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
--brand-purple: #A855F7    /* Premium/Pro accent */
--brand-green: #00B894     /* Fresh accent */
--brand-cream: #FFF8F0     /* BACKGROUND */
--brand-muted: #6B7280     /* Muted text */
```

### Typography
**Font:** Fredoka (Google Fonts) + Playpen Sans Arabic (RTL)
- `.font-display` - Headlines (600)
- `.font-display-black` - Hero text (700)
- `.font-body` - Body text (400)

### Neobrutalist Patterns
```css
/* Borders */
border-3 border-brand-dark
border-4 border-brand-dark

/* Shadows (hard offset, no blur) */
shadow-[6px_6px_0px_0px_var(--brand-teal)]
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]

/* Hover */
hover:shadow-[8px_8px_0px_0px_var(--brand-teal)]
hover:-translate-x-0.5 hover:-translate-y-0.5

/* Mobile touch targets */
min-h-[44px]  /* WCAG minimum */
min-h-[48px]  /* Recommended */
```

### RTL Shadow Utility
```typescript
import { getRtlShadow } from '../utils/rtlShadow';

// Usage: flips shadow direction for RTL languages
style={{ boxShadow: getRtlShadow('md', isRTL, '#00CEC9') }}
```

---

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (port 3000)
npm run build     # Production build

# Supabase
supabase link --project-ref xxx
supabase functions deploy lemon-squeezy-webhook --no-verify-jwt
```

---

## Common Tasks

| Task | Location |
|------|----------|
| Add filter | `constants.ts` → `ATTRIBUTE_FILTERS` |
| Change AI model | `constants.ts` → `AI_MODEL_NAME` |
| Update colors | `index.css` → `@theme` block |
| Modify AI prompt | `geminiService.ts` → `findRestaurants()` |
| Add translations | `translations/en.ts` + `translations/ar.ts` |
| Update SEO meta | `index.html` → `<head>` section |

---

## Important Notes

1. **Tailwind v4** - Use `@import "tailwindcss"` not `@tailwind`
2. **API key** - Bundled client-side (visible in browser)
3. **Webhook JWT** - Deploy with `--no-verify-jwt` for Lemon Squeezy webhooks
4. **Mobile UX** - All touch targets must be 44px+ minimum
5. **RTL Support** - Use `getRtlShadow()` for shadows, check `isRTL` from context
6. **AI Crawlers** - robots.txt explicitly allows GPTBot, Claude, Perplexity, etc.

---

## Recent Updates (2025-11-29)

### Arabic Brand Name Fix
- Corrected spelling: "حالولو" → "حلولو" (6 instances in translations/ar.ts)
- Brand name, loading text, story section all now use correct spelling

### SEO/GEO/AEO Implementation (2024-11-28)
- Added 50+ meta tags (Open Graph, Twitter Cards, hreflang)
- Created JSON-LD schemas (SoftwareApplication, FAQPage, WebSite)
- Created robots.txt allowing 15+ AI crawlers
- Created sitemap.xml with EN/AR language alternates
- Added PWA manifest.json
- Configured Vercel caching headers

### Mobile UX Improvements
- SearchCounter redesigned with neobrutalist style
- All touch targets now meet 44px WCAG minimum
- Stats grid responsive on small screens
- Back buttons have proper tap areas

### Authentication & Payments
- Supabase auth integration (email/password, magic link)
- Usage tracking with daily limits (3 free searches)
- Lemon Squeezy subscription integration
- Webhook handler via Supabase Edge Function
- Profile page with subscription management

### Arabic (RTL) Support
- Full Arabic translations (حلولو = Halulu)
- RTL-aware layouts using `dir="rtl"`
- Shadow direction flipping for RTL
- Language switcher component
