# Halulu is Hungry

An AI-powered restaurant discovery app that helps you find the perfect dining experience. Using Google's Gemini AI with Google Maps grounding, Halulu analyzes thousands of reviews to provide personalized restaurant recommendations with detailed insights.

## Features

- **AI-Powered Search**: Natural language queries like "spicy ramen near me" or "romantic Italian restaurant"
- **Intelligent Ranking**: Smart recommendations based on both rating quality and review volume
- **Review Analysis**: Automatically extracts pros and cons from real Google Reviews
- **Location-Based**: Uses your current location to find nearby restaurants
- **Beautiful UI**: Minimal luxury design with shadcn/ui components
- **Atmosphere Filters**: Filter by Cozy, Romantic, Family Friendly, Good for groups, or Outdoor seating
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 19.2 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **AI**: Google Gemini 2.0 Flash Experimental
- **Fonts**: Playfair Display (display) + Geist (body)
- **Icons**: Lucide React + Emoji

## Design System

**Minimal Luxury Theme**:
- Warm cream background (#faf8f3)
- Deep charcoal text (#1a1a1a)
- Gold accent color (#d4af37)
- Premium typography with Playfair Display and Geist
- Smooth animations and transitions
- shadcn/ui components exclusively

## Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/byosamah/Halulu-is-Hungry.git
   cd Halulu-is-Hungry
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── components/
│   ├── luxury-header.tsx       # App header
│   ├── premium-search.tsx      # Search interface
│   ├── restaurant-grid-card.tsx # Restaurant card
│   ├── luxury-loading.tsx      # Loading state
│   ├── luxury-error.tsx        # Error display
│   └── ui/                     # shadcn/ui components
├── services/
│   └── geminiService.ts        # Gemini API integration
├── lib/
│   └── utils.ts                # Utility functions
├── App.tsx                      # Main app component
├── types.ts                     # TypeScript types
├── constants.ts                 # App constants
└── index.css                    # Global styles
```

## How It Works

1. **Location Detection**: App requests your browser location for proximity-based results
2. **Search Query**: Enter what you're looking for in natural language
3. **AI Processing**: Gemini AI searches Google Maps and analyzes reviews
4. **Ranking Algorithm**: Results are ranked by weighted score (rating × review volume)
5. **Review Analysis**: AI extracts direct quotes for pros and cons
6. **Display**: Shows restaurants with ratings, highlights, and Google Maps links

## Features in Detail

### Smart Ranking
The AI considers both rating and review count. A 4.7-rated restaurant with 2,000 reviews ranks higher than a 4.9-rated one with only 100 reviews, ensuring reliability.

### Error Handling
- Automatic retry with exponential backoff for API rate limits
- Fallback Google Maps URLs when grounding data is missing
- Clear, user-friendly error messages
- API key validation on startup

### Responsive Grid Layout
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop
- Top pick highlighted with trophy badge and gold border

## Configuration

### Tailwind CSS v4
The app uses the new Tailwind v4 architecture:
```css
/* index.css */
@import "tailwindcss";
```

### shadcn/ui
Configured with New York style and CSS variables:
```json
{
  "style": "new-york",
  "tailwind": {
    "cssVariables": true
  }
}
```

## Known Issues

- Gemini API has free tier rate limits (may need to wait between searches)
- Location permission required (works only on localhost or HTTPS in production)
- API key is exposed in client-side bundle (use server proxy for production)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) & [Geist](https://vercel.com/font)

---

**Note**: This app uses Google Maps data through Gemini's grounding feature. Make sure to comply with Google's terms of service when using this application.
