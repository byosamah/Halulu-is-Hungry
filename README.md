# 🍽️ Halulu is Hungry

**AI-Curated Restaurant Discovery with Minimal Luxury Design**

Halulu is Hungry is an intelligent restaurant discovery application that uses Google's Gemini AI with Google Maps grounding to help you find the perfect dining spot. Powered by advanced AI analysis of thousands of reviews, it provides curated recommendations tailored to your preferences.

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)

</div>

## ✨ Features

- **🤖 AI-Powered Recommendations** - Deep analysis of restaurant reviews using Google Gemini 2.0 Flash
- **🗺️ Real-Time Google Maps Integration** - Live restaurant data with accurate ratings and locations
- **⭐ Smart Rating System** - Weighted AI ratings that consider both review quality and quantity
- **🎨 Minimal Luxury Design** - Beautiful, refined UI with premium Playfair Display & Geist typography
- **📍 Location-Based Search** - Automatic geolocation with proximity-based results
- **✨ Intelligent Insights** - Direct review quotes highlighting pros and cons
- **🔄 Robust Error Handling** - Exponential backoff retry logic for API reliability
- **🎯 Filter Options** - Search by atmosphere, features, and dining preferences
- **📱 Responsive Design** - Seamless experience across all devices

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Google Gemini API Key** - [Get your free API key](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/byosamah/Halulu-is-Hungry.git
   cd Halulu-is-Hungry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your API key**

   Create a `.env.local` file in the project root:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3003`

## 🛠️ Technology Stack

### Core Framework
- **React 19.2** - Latest React with concurrent features
- **TypeScript 5.8** - Type-safe development
- **Vite 6.2** - Lightning-fast build tool with ESM support

### UI & Styling
- **Tailwind CSS v4** - Modern utility-first CSS with new architecture
- **shadcn/ui** - High-quality, accessible component library
- **Playfair Display** - Elegant serif font for headings
- **Geist** - Clean sans-serif font for body text

### AI & APIs
- **Google Gemini 2.0 Flash** - Advanced AI model with tool use
- **Google Maps Grounding** - Real-time restaurant data integration
- **@google/genai SDK** - Official Gemini API client

### Development Tools
- **PostCSS** - CSS transformation with @tailwindcss/postcss
- **TypeScript** - Full type safety across the codebase
- **ESM Modules** - Modern JavaScript module system

## 📁 Project Structure

```
halulu-is-hungry/
├── components/              # React components
│   ├── ui/                 # shadcn/ui base components
│   ├── luxury-header.tsx   # App header
│   ├── premium-search.tsx  # Search interface
│   ├── restaurant-grid-card.tsx  # Restaurant cards
│   ├── luxury-loading.tsx  # Loading states
│   └── luxury-error.tsx    # Error handling UI
├── services/
│   └── geminiService.ts    # AI & Google Maps integration
├── lib/
│   └── utils.ts            # Utility functions
├── types.ts                # TypeScript type definitions
├── constants.ts            # App constants & filters
├── App.tsx                 # Main application component
├── index.css               # Global styles & theme
└── tailwind.config.js      # Tailwind configuration

```

## 🎨 Design System

### Color Palette
- **Background**: Warm Cream `#faf8f3`
- **Text**: Deep Charcoal `#1a1a1a`
- **Primary (Gold)**: `#d4af37`
- **Muted**: Soft Grey tones

### Typography
- **Display**: Playfair Display (serif) - Elegant headings
- **Body**: Geist (sans-serif) - Clean, readable text

### Components
All components built with **shadcn/ui** for:
- ✅ Accessibility (ARIA compliance)
- ✅ Customization (full theme control)
- ✅ Quality (production-ready)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```bash
# Required: Your Google Gemini API Key
GEMINI_API_KEY=your_api_key_here
```

### Tailwind Configuration

The app uses Tailwind CSS v4 with:
- Custom color scheme (warm luxury palette)
- Premium font stack
- Responsive breakpoints
- Custom animations (fade-in, slide-up)

### API Configuration

**Model**: `gemini-2.0-flash-exp`
- Latest experimental model with tool use
- Google Maps grounding enabled
- Retry logic with exponential backoff (2s → 4s → 8s)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add TypeScript types
   - Test thoroughly
4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Prefer shadcn/ui components
- Write descriptive commit messages

## 🐛 Known Issues & Limitations

- **Free Tier Rate Limits**: Google Gemini API has request limits on free tier
- **Location Permissions**: Browser geolocation must be enabled
- **HTTPS Required**: Location API requires HTTPS in production
- **API Response Time**: First search may take 2-3 seconds due to AI processing

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - Powering intelligent recommendations
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first CSS framework
- **Google Fonts** - Playfair Display & Geist typography

## 📧 Contact

**Project Maintainer**: [@byosamah](https://github.com/byosamah)

**Repository**: [https://github.com/byosamah/Halulu-is-Hungry](https://github.com/byosamah/Halulu-is-Hungry)

---

<div align="center">

**Made with 🤖 AI assistance from Claude Code**

[⭐ Star this repo](https://github.com/byosamah/Halulu-is-Hungry) if you find it useful!

</div>
