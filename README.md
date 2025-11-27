# Halulu is Hungry AI

> Stop arguing about where to eat. Let AI read thousands of reviews for you.

An AI-powered restaurant discovery app that uses Google's Gemini AI to analyze real Google Maps reviews and find your perfect dining spot.

## What It Does

1. Gets your location
2. Takes your food craving ("spicy ramen", "cozy brunch spot")
3. AI analyzes thousands of reviews across nearby restaurants
4. Returns ranked recommendations with pros/cons from actual reviews

## Features

- **Smart Ranking** - Restaurants ranked by weighted score (rating x review count). A 4.7 with 2000 reviews beats a 4.9 with 100 reviews.
- **Review Quotes** - Direct quotes from real reviews as pros and cons
- **Atmosphere Filters** - Cozy, Romantic, Family Friendly, Groups, Outdoor
- **"Inspire Me"** - Random food craving suggestions when you can't decide
- **Google Maps Links** - One tap to navigate to your chosen restaurant

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.8 | Type safety |
| Vite | 6.2 | Build tool |
| Tailwind CSS | 4.1 | Styling |
| Framer Motion | 12.x | Animations |
| @google/genai | 1.28 | Gemini AI SDK |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/byosamah/halulu-is-hungry.git
cd halulu-is-hungry

# 2. Install
npm install

# 3. Add API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 4. Run
npm run dev
```

Open http://localhost:3000

**Get your API key:** https://aistudio.google.com/apikey

## How It Works

```
User enters "spicy ramen"
        |
        v
Gemini AI + Google Maps grounding
        |
        v
AI analyzes reviews from nearby restaurants
        |
        v
Weighted ranking: rating x review volume
        |
        v
Returns top picks with pros/cons quotes
```

## Project Structure

```
/
├── pages/
│   ├── LandingPage.tsx      # Marketing page
│   └── AppPage.tsx          # Main search + results
├── components/
│   ├── premium-search.tsx   # Search bar + filters
│   ├── restaurant-grid-card.tsx
│   ├── luxury-loading.tsx
│   └── luxury-error.tsx
├── services/
│   └── geminiService.ts     # Gemini API integration
├── types.ts                 # TypeScript interfaces
└── constants.ts             # Configuration
```

## Design

**Style:** Neobrutalist + Playful

- Thick black borders (4px)
- Hard offset shadows
- Vibrant colors (coral, teal, yellow)
- Fredoka font (bubbly, rounded)
- Framer Motion animations

## License

MIT

---

Built with Gemini AI + Google Maps grounding
