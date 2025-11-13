# Halulu is Hungry AI - Project Documentation

## Overview
**Halulu is Hungry AI** is an intelligent restaurant discovery app that helps users find the perfect dining spot using AI-powered review analysis and real-time location data.

### What It Does
- Uses your current location (browser geolocation API)
- Takes a natural language food query (e.g., "spicy ramen", "cozy cafes")
- Calls Google's Gemini 2.0 Flash API with Google Maps grounding
- Analyzes real restaurant reviews to provide pros/cons with direct quotes
- Returns AI-weighted rankings based on rating + review volume
- Displays results with Google Maps links for each restaurant

### Tech Stack
- **Frontend**: React 19.2 with TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS v4 (with new PostCSS architecture)
- **AI Service**: Google Gemini 2.0 Flash Experimental (`gemini-2.0-flash-exp`)
- **API Integration**: `@google/genai` SDK with Google Maps grounding tool

---

## Architecture

### Project Structure
```
/
├── App.tsx                      # Main app component (state, geolocation, search orchestration)
├── index.tsx                    # React root mount point
├── index.html                   # HTML entry with importmap for AI Studio CDN
├── index.css                    # Tailwind v4 imports
├── types.ts                     # TypeScript interfaces (Restaurant, Coordinates)
├── constants.ts                 # Filter options & inspiration queries
├── services/
│   └── geminiService.ts         # Gemini API integration & Google Maps grounding
├── components/
│   ├── Header.tsx               # App branding header
│   ├── SearchBar.tsx            # Search input + filters + inspire button
│   ├── RestaurantCard.tsx       # Individual restaurant display with ratings
│   ├── LoadingSpinner.tsx       # Loading state UI
│   ├── ErrorDisplay.tsx         # Error message UI
│   ├── FilterPill.tsx           # Clickable filter chips
│   └── icons.tsx                # SVG icon components
├── vite.config.ts               # Vite config with env var injection
├── tailwind.config.js           # Tailwind v4 content paths
├── postcss.config.js            # PostCSS with @tailwindcss/postcss plugin
├── tsconfig.json                # TypeScript config with path aliases
├── package.json                 # Dependencies & scripts
└── .env.local                   # Environment variables (GEMINI_API_KEY)
```

### Data Flow
1. **App Mount** → Request geolocation permission → Store coordinates in state
2. **User Input** → Enter query + select filters → Click Search
3. **API Call** → `findRestaurants()` sends query + location to Gemini API
4. **AI Processing** → Gemini uses Google Maps tool to find restaurants, analyzes reviews
5. **Response Parsing** → Extract JSON + match with grounding metadata for URLs
6. **Display** → Render `RestaurantCard` components with AI ratings, pros/cons, Maps links

---

## Key Files & Their Purpose

### App.tsx
**The main orchestrator** - manages all application state and user interactions.

**Key Responsibilities:**
- Geolocation management via `navigator.geolocation.getCurrentPosition()`
- Search state (`query`, `activeFilters`, `restaurants`, `isLoading`, `error`)
- Conditional rendering logic (loading spinner, error, results, welcome screen)
- Passes data down to child components via props

**Important State:**
- `location: Coordinates | null` - User's latitude/longitude
- `restaurants: Restaurant[]` - API response results
- `searchQuery: string` - User's text input
- `activeFilters: string[]` - Selected attribute filters (e.g., "Cozy", "Romantic")

**Important Functions:**
- `getLocation()` - Requests browser geolocation, handles errors
- `handleSearch()` - Validates input, calls `findRestaurants()`, updates state

### services/geminiService.ts
**The AI integration layer** - handles all communication with Google's Gemini API.

**Model Used:** `gemini-2.0-flash-exp` (latest experimental model)

**Key Function: `findRestaurants(location, query, filters)`**

**What It Does:**
1. Constructs a sophisticated prompt asking Gemini to:
   - Find restaurants matching the query
   - Rank by weighted score (rating × review count volume)
   - Analyze reviews deeply for sentiment
   - Return structured JSON with pros/cons as direct quotes
   
2. Calls Gemini API with:
   - `tools: [{ googleMaps: {} }]` - Enables Google Maps grounding
   - `toolConfig.retrievalConfig.latLng: location` - Passes user coordinates
   
3. Parses the response:
   - Cleans markdown formatting from JSON
   - Extracts `groundingChunks` for real Google Maps URLs
   - Matches restaurant names to grounding metadata
   - Returns enriched `Restaurant[]` array

**Critical Implementation Details:**
- Uses `cleanJsonString()` to strip markdown code blocks (e.g., ` ```json ... ``` `)
- Normalizes restaurant names to lowercase for matching with grounding metadata
- Fallback to `'#'` for `mapsUrl` if grounding data is missing
- Error handling wraps API failures in user-friendly messages

**API Response Structure:**
```typescript
// From Gemini (without grounding):
{
  name: string,
  aiRating: number,
  googleRating: number,
  googleReviewsCount: number,
  pros: string[],  // Direct quote snippets from reviews
  cons: string[]   // Direct quote snippets from reviews
}

// After enrichment with grounding metadata:
{
  ...above,
  mapsUrl: string,  // Extracted from groundingChunks
  title: string     // Official name from Google Maps
}
```

### components/RestaurantCard.tsx
**Displays individual restaurant results** - the main UI for showing AI analysis.

**Features:**
- Custom `StarRating` component with partial star support
- AI Rating displayed prominently with stars
- Google Rating shown separately (with review count)
- Pros/cons lists with quote icons and italic formatting
- "View on Google Maps" button (opens `mapsUrl` in new tab)

**Design Pattern:**
Card has two sections:
1. **Main Content** (`p-6`) - Rating, name, pros/cons
2. **Footer** (`bg-gray-50`) - Google Maps CTA button

### components/SearchBar.tsx
**The main input interface** - handles user queries and filtering.

**Features:**
- Text input with Enter key support
- "Search" button (triggers `onSearch` callback)
- "Inspire Me" button (randomly selects from `INSPIRATIONS` array)
- Location refresh button (re-requests geolocation)
- Filter pills for attributes (from `ATTRIBUTE_FILTERS` constant)

**State Management:**
- Doesn't own state - receives via props (controlled component pattern)
- Calls parent callbacks: `setQuery`, `setActiveFilters`, `onSearch`, `onRefreshLocation`

### constants.ts
**Configuration data** - no logic, just data arrays.

**Exports:**
- `ATTRIBUTE_FILTERS` - 5 options: "Cozy", "Romantic", "Family Friendly", "Good for groups", "Outdoor seating"
- `INSPIRATIONS` - 40+ pre-written search queries for the "Inspire Me" feature

### types.ts
**TypeScript type definitions** - the data contracts for the app.

```typescript
Restaurant {
  name: string
  aiRating: number        // 1.0-5.0, calculated by Gemini (weighted score)
  pros: string[]          // Array of 3 direct review quotes
  cons: string[]          // Array of 3 direct review quotes
  mapsUrl: string         // Google Maps link (from grounding metadata)
  title: string           // Official restaurant name (from grounding metadata)
  googleRating: number    // Raw Google star rating
  googleReviewsCount: number  // Total review count
}

Coordinates {
  latitude: number
  longitude: number
}
```

---

## Development Commands

### Setup
```bash
npm install               # Install all dependencies
```

### Running Locally
```bash
npm run dev               # Start Vite dev server on http://localhost:3000
```
- Opens on port 3000 (configured in `vite.config.ts`)
- Hot module replacement (HMR) enabled
- Accessible on network via `0.0.0.0` binding

### Building for Production
```bash
npm run build             # Creates optimized production build in /dist
npm run preview           # Preview production build locally
```

### Environment Setup
**Required:** Create `.env.local` file with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```
Get your key from: https://aistudio.google.com/apikey

---

## Important Configuration

### Vite Setup (vite.config.ts)

**Key Configurations:**
1. **Environment Variable Injection**
   ```typescript
   define: {
     'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
     'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
   }
   ```
   - Loads `.env.local` file using Vite's `loadEnv()`
   - Injects API key into the bundle at build time
   - Accessible in code as `process.env.API_KEY`

2. **Path Aliases**
   ```typescript
   resolve: {
     alias: {
       '@': path.resolve(__dirname, '.'),
     }
   }
   ```
   - Allows imports like `import X from '@/components/X'`
   - Matches `tsconfig.json` paths configuration

3. **Server Config**
   ```typescript
   server: {
     port: 3000,
     host: '0.0.0.0',
   }
   ```
   - Fixed port (not random)
   - Network accessible (not just localhost)

### Tailwind CSS v4 Setup

**Critical Differences from Tailwind v3:**

1. **New Import Syntax** (index.css)
   ```css
   @import "tailwindcss";
   ```
   - No longer uses `@tailwind base/components/utilities` directives
   - Single import statement handles everything

2. **PostCSS Plugin** (postcss.config.js)
   ```javascript
   plugins: {
     '@tailwindcss/postcss': {},  // NEW in v4
     autoprefixer: {},
   }
   ```
   - Must use `@tailwindcss/postcss` plugin (not `tailwindcss`)
   - Installed as `@tailwindcss/postcss` package

3. **Config File** (tailwind.config.js)
   ```javascript
   content: [
     "./index.html",
     "./**/*.{js,ts,jsx,tsx}",
   ]
   ```
   - Still uses traditional config format
   - Glob patterns watch all TS/TSX files for class usage

**Why This Matters:**
- If you see old tutorials with `@tailwind` directives, they won't work
- The v4 architecture is fundamentally different (Rust-based engine)
- Faster builds, but requires the new PostCSS plugin

### TypeScript Configuration (tsconfig.json)

**Important Settings:**
- `jsx: "react-jsx"` - Uses new JSX transform (no need to import React)
- `moduleResolution: "bundler"` - Optimized for Vite
- `allowImportingTsExtensions: true` - Can import `.tsx` directly
- `noEmit: true` - TypeScript only for type-checking (Vite handles transpilation)
- `paths: { "@/*": ["./*"] }` - Path alias support

---

## API Integration Details

### Gemini API Configuration

**Model:** `gemini-2.0-flash-exp`
- Latest experimental model (as of project creation)
- Supports tool use (Google Maps grounding)
- Fast response times
- May change behavior as Google updates the model

**Tool Configuration:**
```typescript
{
  tools: [{ googleMaps: {} }],
  toolConfig: {
    retrievalConfig: {
      latLng: { latitude: number, longitude: number }
    }
  }
}
```

**What This Does:**
- Enables Gemini to search Google Maps as a tool
- Passes user's location for proximity-based results
- Returns grounding metadata with real place data

**Grounding Metadata Structure:**
```typescript
response.candidates[0].groundingMetadata.groundingChunks[]
// Each chunk:
{
  maps: {
    title: string,    // Official place name
    uri: string       // Google Maps URL
  }
}
```

### The AI Prompt Strategy

The prompt in `geminiService.ts` is carefully crafted to:

1. **Set Context**: "You are an expert restaurant recommender"
2. **Emphasize Ranking Logic**: "Consider both rating AND review count"
3. **Request Deep Analysis**: "Deeply analyze reviews to gauge sentiment"
4. **Specify Output Format**: Exact JSON structure with types
5. **Require Direct Quotes**: Pros/cons must be actual review snippets
6. **No Markdown**: "Do not include text, explanations, or markdown formatting"

**Why the Ranking Logic Matters:**
- A 4.7 rating with 2000 reviews is better than 4.9 with 100 reviews
- The AI calculates a weighted `aiRating` (not just copied from Google)
- More reviews = more reliable data = higher confidence in recommendation

**Example Prompt Section:**
```
**Crucially, rank the results based on a weighted score that considers both 
the Google rating and the number of reviews.** A restaurant with a slightly 
lower rating but a vastly larger number of reviews is a more reliable and 
generally better recommendation.
```

---

## Special Considerations

### API Quotas & Rate Limiting
- Gemini API has free tier limits (requests per minute)
- No retry logic implemented - single API call per search
- Large result sets may hit token limits in responses
- **Recommendation**: Add error handling for quota exceeded errors

### Configuration Quirks

1. **Duplicate API Key Definition** (vite.config.ts)
   ```typescript
   define: {
     'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
     'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
   }
   ```
   Both keys point to the same value - `API_KEY` is used in code

2. **Import Map in HTML** (index.html)
   ```html
   <script type="importmap">
   {
     "imports": {
       "@google/genai": "https://aistudiocdn.com/@google/genai@^1.28.0",
       "react": "https://aistudiocdn.com/react@^19.2.0"
     }
   }
   </script>
   ```
   - Allows CDN imports without bundling (AI Studio optimization)
   - May cause issues if deploying outside AI Studio environment
   - **For production**: Consider bundling dependencies normally

3. **No API Key Validation on Startup**
   - App doesn't check API key until first search
   - Better UX: Validate key on mount and show warning if missing

### Tailwind v4 Migration Notes

If updating from Tailwind v3:
- Replace `@tailwind` directives with `@import "tailwindcss"`
- Update PostCSS config to use `@tailwindcss/postcss`
- Install `@tailwindcss/postcss` package: `npm install -D @tailwindcss/postcss`
- Check Tailwind v4 migration guide for breaking changes in class names

### Location Permission Handling

**Browser Geolocation API**:
- Requires HTTPS in production (works on localhost without)
- User must grant permission in browser prompt
- Can fail for multiple reasons (denied, timeout, unavailable)
- App shows helpful error messages with retry option

**Common Issues:**
- User denies permission → App shows "enable location services" message
- User on desktop with no GPS → May give inaccurate results
- User on VPN → Location may not reflect actual position

---

## Environment Variables

### Required
- `GEMINI_API_KEY` - Your Google AI Studio API key

### Setup Location
Create a file named `.env.local` in the project root:
```bash
# .env.local
GEMINI_API_KEY=AIza...your-key-here
```

**Security Notes:**
- Never commit `.env.local` to version control
- API key is bundled into client-side code (visible in browser)
- For production: Use server-side proxy to hide API key
- Consider environment-specific keys (dev vs. prod)

---

## Common Patterns & Best Practices

### Error Handling Pattern
Throughout the app, errors are caught and set in state:
```typescript
try {
  const results = await findRestaurants(location, query, filters);
  setRestaurants(results);
} catch (e) {
  const errorMessage = e instanceof Error ? e.message : 'Unknown error';
  setError(`Failed to fetch: ${errorMessage}`);
}
```

### Controlled Component Pattern
All form inputs are controlled:
```typescript
<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

### Callback Props Pattern
Child components receive callback functions instead of managing state:
```typescript
<SearchBar
  query={searchQuery}
  setQuery={setSearchQuery}
  onSearch={handleSearch}
/>
```

### Conditional Rendering Pattern
App uses helper functions for complex render logic:
```typescript
const renderContent = () => {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (restaurants.length > 0) return <Results />;
  return <WelcomeScreen />;
};
```

---

## Future Improvements & TODOs

Based on code analysis, here are potential enhancements:

1. **API Key Security**: Move API calls to a backend proxy
2. **Error Recovery**: Add retry logic for failed API calls
3. **Loading States**: Show partial results while loading (streaming)
4. **Caching**: Cache results by location + query to avoid redundant API calls
5. **Favorites**: Allow users to save favorite restaurants
6. **Filters**: Add more filters (price range, cuisine type, distance)
7. **Sorting**: Let users re-sort results without new API call
8. **Maps Integration**: Embed Google Maps view instead of external link
9. **Reviews Display**: Show full review text in expandable sections
10. **Accessibility**: Add ARIA labels, keyboard navigation improvements

---

## Debugging Tips

### Common Issues

**"API key is not configured"**
- Check `.env.local` exists in project root
- Ensure key is named `GEMINI_API_KEY` (not `GOOGLE_API_KEY`)
- Restart dev server after adding `.env.local`

**"Error getting location"**
- User denied permission → Ask them to enable in browser settings
- Not on HTTPS → Use localhost for development
- Browser doesn't support geolocation → Check `navigator.geolocation` exists

**"AI returned invalid data format"**
- Gemini returned markdown-wrapped JSON → Check `cleanJsonString()` logic
- Gemini returned explanation text → Update prompt to be more strict
- Gemini hit rate limit → Check console for actual API error

**Tailwind classes not working**
- Check PostCSS config uses `@tailwindcss/postcss`
- Verify `index.css` imports `"tailwindcss"` (not `@tailwind` directives)
- Restart dev server after config changes

**TypeScript errors on imports**
- Check `tsconfig.json` includes `"types": ["node"]`
- Verify `@/*` path alias in both `tsconfig.json` and `vite.config.ts`

---

## Architecture Decisions Explained

### Why React 19?
- Latest stable version with new features
- Improved concurrent rendering
- Better TypeScript support

### Why Vite over Create React App?
- Faster dev server (ESM-based, no bundling in dev)
- Better TypeScript support out of the box
- Smaller production bundles
- More modern architecture (CRA is no longer maintained)

### Why Gemini 2.0 Flash?
- Supports tool use (Google Maps grounding)
- Fast response times (under 2 seconds typically)
- Cost-effective (free tier available)
- Experimental model has latest features

### Why Google Maps Grounding?
- Provides real, up-to-date restaurant data
- Returns actual Google Maps URLs (not invented links)
- Accesses real reviews for sentiment analysis
- More reliable than training data alone

### Why No State Management Library?
- App state is simple (one search flow)
- React hooks (useState) sufficient for this scale
- Avoids adding complexity/dependencies
- Easy to add Redux/Zustand later if needed

### Why Tailwind v4?
- Faster builds (Rust-based engine)
- Simpler configuration
- Better type safety
- Future-proof architecture

---

## Quick Reference

### File Imports Cheat Sheet
```typescript
// Types
import type { Restaurant, Coordinates } from './types';

// Constants
import { ATTRIBUTE_FILTERS, INSPIRATIONS } from './constants';

// Services
import { findRestaurants } from './services/geminiService';

// Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RestaurantCard from './components/RestaurantCard';
```

### Key Functions
```typescript
// App.tsx
getLocation() - Requests browser geolocation
handleSearch() - Triggers restaurant search

// geminiService.ts
findRestaurants(location, query, filters) - Main API call
cleanJsonString(str) - Strips markdown from JSON response
```

### Key State Variables
```typescript
// App.tsx state
location: Coordinates | null     - User's lat/lng
restaurants: Restaurant[]        - Search results
searchQuery: string              - User's text input
activeFilters: string[]          - Selected filter pills
isLoading: boolean               - Loading state
error: string | null             - Error message (if any)
```

---

## Links & Resources

- **AI Studio**: https://ai.studio/apps/drive/1DyIEWX9AW_A7EJaPQWxihQuJyIXXoS3t
- **Get API Key**: https://aistudio.google.com/apikey
- **Gemini API Docs**: https://ai.google.dev/docs
- **Tailwind v4 Docs**: https://tailwindcss.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **React 19 Docs**: https://react.dev/

---

## Working with Claude Code

When future Claude instances work on this project:

**Quick Start Context:**
- This is a React + TypeScript + Vite app using Gemini AI
- Main logic is in `App.tsx` (orchestration) and `services/geminiService.ts` (AI calls)
- Uses Tailwind v4 (different import syntax than v3)
- API key comes from `.env.local` → Vite injects it at build time
- The AI prompt is sophisticated - be careful changing it

**Common Tasks:**
- **Add a new filter**: Update `ATTRIBUTE_FILTERS` in `constants.ts`
- **Change UI styling**: Edit component TSX files (Tailwind classes)
- **Modify AI behavior**: Edit prompt in `geminiService.ts`
- **Add new component**: Create in `components/`, import in `App.tsx`

**Things to Be Careful With:**
- Don't break the Tailwind v4 import syntax (use `@import "tailwindcss"`)
- Don't expose API keys (never commit `.env.local`)
- Don't change the JSON parsing logic without testing thoroughly
- Don't modify the grounding metadata matching (complex name normalization)

**Testing Changes:**
1. Make code change
2. Check browser for errors (open DevTools console)
3. Try a search (use "sushi" or "pizza" for quick tests)
4. Verify results render correctly

---

*Last Updated: Generated from codebase analysis*
