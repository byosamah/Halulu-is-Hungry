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
- Supabase (auth, database)
- Lemon Squeezy (payments)
- Vercel (hosting + serverless API routes)

---

## Project Structure

```
/
├── App.tsx                    # Router + auth guards + Vercel Analytics
├── index.tsx                  # React root mount
├── index.html                 # HTML entry + SEO meta tags + JSON-LD schemas
├── index.css                  # Tailwind v4 + design tokens
├── types.ts                   # TypeScript interfaces
├── constants.ts               # Configuration values
│
├── api/                       # Vercel Serverless Functions (NEW)
│   ├── search.ts              # Gemini AI restaurant search
│   ├── auth/
│   │   ├── signup.ts          # User registration
│   │   ├── signin.ts          # User login
│   │   ├── signout.ts         # User logout (logging)
│   │   ├── reset-password.ts  # Password reset email
│   │   └── update-password.ts # Set new password
│   ├── usage/
│   │   ├── index.ts           # GET user usage stats
│   │   └── increment.ts       # POST increment search count
│   └── webhooks/
│       └── lemon-squeezy.ts   # Payment webhook handler
│
├── pages/
│   ├── LandingPage.tsx        # Marketing hero page
│   ├── AppPage.tsx            # Search + results page
│   ├── AuthPage.tsx           # Login/signup with Supabase
│   ├── PricingPage.tsx        # Subscription plans (Lemon Squeezy)
│   ├── ProfilePage.tsx        # User profile + subscription management
│   ├── ContactPage.tsx        # Contact form (sends via Resend)
│   └── ResetPasswordPage.tsx  # Password reset flow
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
│   ├── AuthContext.tsx        # Auth state (routes through /api/auth/*)
│   ├── UsageContext.tsx       # Usage tracking (routes through /api/usage/*)
│   └── LanguageContext.tsx    # i18n + RTL support
│
├── services/
│   └── geminiService.ts       # Calls /api/search (Gemini via Vercel)
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
│   ├── migrations/            # SQL migrations
│   └── functions/
│       ├── lemon-squeezy-webhook/ # (Legacy - now on Vercel)
│       └── send-contact-email/    # Contact form email sender
│
└── public/
    ├── fonts/                 # Fredoka, Teshrin fonts
    ├── logo.svg               # App logo
    ├── preview.png            # Social media preview image
    ├── demo-en.gif            # English demo animation
    ├── demo-ar.gif            # Arabic demo animation
    ├── robots.txt             # SEO + AI crawler permissions
    ├── sitemap.xml            # Site structure for search engines
    └── manifest.json          # PWA manifest
```

---

## API Architecture (Vercel Serverless)

All API calls now route through Vercel for logging visibility and security.

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/search` | POST | Gemini AI restaurant search |
| `/api/auth/signup` | POST | Create new user |
| `/api/auth/signin` | POST | Login with email/password |
| `/api/auth/signout` | POST | Log signout event |
| `/api/auth/reset-password` | POST | Send reset email |
| `/api/auth/update-password` | POST | Set new password |
| `/api/usage` | GET | Get user's search usage |
| `/api/usage/increment` | POST | Record a search |
| `/api/webhooks/lemon-squeezy` | POST | Payment webhooks |

### Benefits
- **Gemini API key hidden** server-side (no longer exposed in browser!)
- **All activity visible** in Vercel Logs
- **Better debugging** - see every request/response

---

## Key Features

### Authentication (Supabase + Vercel API)
- Email/password signup with email verification
- Google OAuth (redirect-based, stays client-side)
- Password reset flow
- Session persistence via Supabase client
- All auth events logged to Vercel

### Usage Limits
- Free tier: 3 searches/month
- Premium: 30 searches/month
- Real-time counter in header
- Upgrade prompts when limit reached
- **Upgrade behavior:** Search count resets to 0 (full 30 searches)
- **Cancellation behavior:** User keeps premium access until period ends

### Payments (Lemon Squeezy)
- Monthly subscription ($4.99)
- Yearly subscription (promotional pricing)
- Webhook handling via Vercel `/api/webhooks/lemon-squeezy`
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
  is_premium boolean DEFAULT false,
  subscription_status text,
  subscription_id text,
  subscription_variant text,
  subscription_ends_at timestamp,
  bonus_searches integer DEFAULT 0,
  created_at timestamp,
  updated_at timestamp
)

-- Search usage tracking
search_usage (
  user_id uuid REFERENCES profiles,
  month_year text,  -- Format: '2025-01'
  search_count integer DEFAULT 0,
  last_search_at timestamp,
  PRIMARY KEY (user_id, month_year)
)

-- Webhook idempotency
webhook_events (
  id uuid PRIMARY KEY,
  event_id text UNIQUE,
  event_name text,
  payload jsonb,
  processed boolean DEFAULT false,
  created_at timestamp
)
```

---

## Environment Variables

### Local Development (.env.local)
```bash
# Gemini API (also needed in Vercel)
GEMINI_API_KEY=your_gemini_key

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Lemon Squeezy
VITE_LEMON_SQUEEZY_STORE_SLUG=halulu
VITE_LEMON_SQUEEZY_MONTHLY_UUID=xxx
VITE_LEMON_SQUEEZY_YEARLY_UUID=xxx

# Resend (for contact emails)
RESEND_API_KEY=re_xxx
```

### Vercel Environment Variables (Required)
```bash
# For API routes (server-side)
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=https://xxx.supabase.co           # Same as VITE_SUPABASE_URL
SUPABASE_ANON_KEY=your_anon_key                # Same as VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=your_service_key     # From Supabase Settings → API
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
RESEND_API_KEY=re_xxx

# For client-side (VITE_ prefix)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_LEMON_SQUEEZY_STORE_SLUG=halulu
VITE_LEMON_SQUEEZY_MONTHLY_UUID=xxx
VITE_LEMON_SQUEEZY_YEARLY_UUID=xxx
```

**Important:** You need BOTH `SUPABASE_URL` and `VITE_SUPABASE_URL` in Vercel:
- `VITE_*` = Available in browser (client-side React)
- Without prefix = Available only on server (API routes)

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
**Fonts:**
- Fredoka (Google Fonts) - English headlines
- Teshrin (custom) - Arabic/RTL support
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

# Supabase Edge Functions (only for contact email now)
supabase link --project-ref xxx
supabase functions deploy send-contact-email
```

---

## Common Tasks

| Task | Location |
|------|----------|
| Add filter | `constants.ts` → `ATTRIBUTE_FILTERS` |
| Change Pro model | `constants.ts` → `AI_MODEL_NAME` |
| Change Flash model | `constants.ts` → `AI_MODEL_NAME_FLASH` |
| Update colors | `index.css` → `@theme` block |
| Modify AI prompt | `api/search.ts` → prompt section |
| Add translations | `translations/en.ts` + `translations/ar.ts` |
| Update SEO meta | `index.html` → `<head>` section |

---

## Important Notes

1. **Tailwind v4** - Use `@import "tailwindcss"` not `@tailwind`
2. **API key security** - Gemini key now hidden server-side via `/api/search`
3. **Webhook URL** - Use `https://www.halulu.food/api/webhooks/lemon-squeezy`
4. **Mobile UX** - All touch targets must be 44px+ minimum
5. **RTL Support** - See detailed RTL section below
6. **AI Crawlers** - robots.txt explicitly allows GPTBot, Claude, Perplexity, etc.
7. **Vercel Logs** - All API activity visible in Vercel dashboard

---

## RTL (Right-to-Left) Implementation Guide

### Critical Knowledge - DO NOT SKIP

**Problem:** When a parent has `dir="rtl"`, flex containers inside will have items start from the RIGHT, which can conflict with conditional DOM ordering.

### The Bulletproof RTL Pattern

For flex containers that need different item ORDER in RTL vs LTR:

```tsx
// CORRECT - Full control over RTL layout
<div
  dir="ltr"  // Override parent's dir="rtl" to control flex order manually
  className={`flex items-center gap-2 ${isRTL ? 'justify-end' : ''}`}
>
  {isRTL ? (
    // RTL: Render items in reverse order for RTL reading
    <>
      <span>{number}</span>
      <span>{text}</span>
      <span>{icon}</span>
    </>
  ) : (
    // LTR: Normal order
    <>
      <span>{icon}</span>
      <span>{text}</span>
      <span>{number}</span>
    </>
  )}
</div>
```

### Summary
| Need | Solution |
|------|----------|
| Change item ORDER | `dir="ltr"` + conditional JSX + `justify-end` |
| Just flip alignment | `flex-row-reverse` conditional class |
| Shadows | `getRtlShadow()` utility |
| Text direction | Parent `dir="rtl"` handles it |

---

## Recent Updates (2025-11-30)

### Vercel API Routes Migration (Major)
- **All API calls now route through Vercel** for logging visibility
- Created `/api/search.ts` - Gemini AI search (API key now hidden!)
- Created `/api/auth/*` - signup, signin, signout, reset-password, update-password
- Created `/api/usage/*` - get usage stats, increment search count
- Created `/api/webhooks/lemon-squeezy` - payment webhook handler
- Updated `AuthContext.tsx` and `UsageContext.tsx` to use API routes
- Added `@vercel/node` and `@vercel/analytics` packages

### Webhook Signature Fix
- Fixed "Invalid signature" error for Lemon Squeezy webhooks
- Added raw body reading from stream for proper signature verification
- Webhook now successfully processes subscription events

### Contact Page
- Added `/contact` page with form
- Supabase Edge Function `send-contact-email` using Resend API

### Password Reset
- Full password reset flow implemented
- `/auth/reset-password` page for setting new password

### Profile Security
- Users are signed out if their profile is deleted
- Race condition fix in profile verification

### Previous Updates (2025-11-29)
- AI Model switching: Free=Flash, Premium=Pro
- Subscription fixes: Reset on upgrade, keep access until ends_at
- Teshrin Arabic font added
- Arabic brand name corrected to "حلولو"
- SEO/GEO/AEO implementation
- Mobile UX improvements
