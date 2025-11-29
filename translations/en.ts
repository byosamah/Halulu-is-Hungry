/**
 * English Translations
 *
 * All UI strings in English (default language)
 */

export const en = {
  // ==================
  // COMMON / BRAND
  // ==================
  brandName: 'Halulu is Hungry',
  back: 'Back',
  pro: 'PRO',
  user: 'User',
  userAvatar: 'User avatar',
  profileMenu: 'Profile menu',

  // ==================
  // HEADER
  // ==================
  startSearching: 'Start Searching',

  // ==================
  // SEARCH
  // ==================
  searchPlaceholder: "What's your tummy craving?",
  letsEat: "Let's Eat!",
  inspireMe: 'Inspire Me!',

  // ==================
  // FILTERS
  // ==================
  filters: {
    cozy: 'Cozy',
    romantic: 'Romantic',
    familyFriendly: 'Family Friendly',
    goodForGroups: 'Good for groups',
    outdoorSeating: 'Outdoor seating',
  },

  // ==================
  // RESTAURANT CARD
  // ==================
  aiScore: 'AI Score',
  googleLabel: 'Google:',
  googleRating: 'Google Maps Rating:',
  peopleLove: 'People Love This!',
  headsUp: 'Heads Up',
  letsGoHere: "Let's Go Here!",
  topPick: 'Top Pick',
  reviews: 'reviews',

  // ==================
  // LOADING
  // ==================
  loadingTitle: 'Finding your perfect bite!',
  loadingSubtitle: 'Halulu is sniffing through thousands of reviews...',

  // ==================
  // EMPTY STATE
  // ==================
  emptyTitle: 'What are you craving?',
  emptySubtitle: "Tell us what you're hungry for, and we'll read thousands of reviews to find your perfect spot.",

  // ==================
  // LOCATION
  // ==================
  acquiringLocation: 'Acquiring your location...',
  allowLocation: 'Please allow location access',

  // ==================
  // RESULTS
  // ==================
  foundSpots: (count: number) => `Found ${count} amazing ${count === 1 ? 'spot' : 'spots'} for you!`,

  // ==================
  // ERRORS
  // ==================
  errors: {
    locationRequired: 'Location required. Please enable location services to discover restaurants.',
    emptyQuery: 'Your stomach is waiting. Type something.',
    apiKeyMissing: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.',
    noResults: (query: string) => `No restaurants found for "${query}". Try refining your search or exploring a different cuisine.`,
    quotaExceeded: 'API rate limit reached. Please wait a few minutes before searching again.',
    apiKeyError: 'API key error. Please verify your GEMINI_API_KEY configuration.',
    networkError: 'Network connection issue. Please check your internet and try again.',
    invalidResponse: 'Unexpected response from AI. Please try rephrasing your query.',
    searchFailed: (message: string) => `Search failed: ${message}`,
  },

  // Error titles (for LuxuryError component)
  errorTitles: {
    quota: 'Whoa there, speedy!',
    apiKey: 'Key check failed',
    network: 'Connection hiccup',
    location: 'Location needed',
    unknown: 'Oops, something broke',
  },
  encouragement: "Don't worry, Halulu still believes in you!",

  // ==================
  // LANDING PAGE - HERO
  // ==================
  heroTitle1: 'Stop arguing about',
  heroTitle2: 'where to eat',
  heroSubtitle: 'We read thousands of reviews and tell you the truth: Is this place actually good?',

  // Quick tags on hero
  quickTags: ['Pizza', 'Mansaf', 'Shawarma', 'Burgers', 'Falafel'],

  // ==================
  // LANDING PAGE - PROBLEM SECTION
  // ==================
  problemTitle: 'Every restaurant',
  problemTitleHighlight: 'looks the same',
  problemQuestion: 'Which one is actually good?',
  problemAnswer: 'Star ratings lie. Reviews tell the truth.',

  // ==================
  // LANDING PAGE - AI DETECTIVE SECTION
  // ==================
  detectiveTitle: 'Your AI Food Detective',
  detectiveSubtitle: 'We read thousands of reviews so you get the truth.',

  step1Title: 'We read everything',
  step1Subtitle: 'All 4,000 reviews, not just the stars',

  step2Title: 'We spot the patterns',
  step2Subtitle: 'What do people really say?',

  step3Title: 'We give you the truth',
  step3Subtitle: 'Is it good? Is it worth it?',

  detectiveTagline: 'Case solved in under 10 seconds',

  // ==================
  // LANDING PAGE - STORY SECTION
  // ==================
  storyTitle: 'Meet Halulu',
  storyParagraph1: 'Halulu is my wife.',
  storyParagraph1b: 'And she was always hungry.',
  storyParagraph2: "Every time we wanted to eat out, she'd spend hours on Google Maps. And every time, the same argument:",
  storyQuote: 'This one has 4.8 stars with 500 reviews... but this one has 4.5 with 4,000 reviews.',
  storyQuoteHighlight: 'Which one is actually better??',
  storyParagraph3: "So I built her an AI that actually reads the reviews. Not just the stars—the actual words people wrote.",
  storyParagraph4: 'Now we find dinner in minutes.',
  storyParagraph4b: "And we don't argue about restaurants anymore.",
  storyParagraph5: 'Well... we argue about other things. But not restaurants.',
  storyCta: 'You can use it too',

  // ==================
  // LANDING PAGE - PRICING
  // ==================
  pricingTitle: 'Fair Pricing',
  pricingSubtitle: 'No tricks. No surprises. Just good recommendations.',

  // Monthly Plan
  monthlyPlanBadge: '1 Day Free Trial',
  monthlyPlanName: 'Monthly',
  monthlyPrice: '4.99',
  monthlyPeriod: 'per month',
  monthlyFeature1: '50 AI-powered searches',
  monthlyFeature2: 'Smart review analysis',
  monthlyFeature3: 'Location-based results',
  monthlyCtaBtn: 'Start Free Trial',

  // Yearly Plan
  yearlyPlanBadge: 'Save 20%',
  yearlyPlanName: 'Yearly',
  yearlyPrice: '47.99',
  yearlyPeriod: 'per year',
  yearlyMonthly: '~$3.99/month',
  yearlyFeature1: '600 AI-powered searches',
  yearlyFeature2: 'Smart review analysis',
  yearlyFeature3: 'Location-based results',
  yearlyCtaBtn: 'Get Yearly Deal',

  pricingDisclaimer: 'No credit card required for trial',

  // ==================
  // LANDING PAGE - FAQ
  // ==================
  faqTitle: 'Questions? We got you.',

  faq1Question: 'How accurate is it?',
  faq1Answer: "We analyze what people actually write in their reviews—not just the star rating. The AI looks for patterns across hundreds or thousands of reviews to give you an honest picture.",

  faq2Question: 'Where does this work?',
  faq2Answer: "Anywhere Google Maps has restaurant data! We're built on top of Google's database, so if it's on Google Maps, we can analyze it.",

  faq3Question: "What if I don't like the recommendation?",
  faq3Answer: 'Every restaurant is different, and taste is personal. We give you the pros AND cons from real reviews so you can make an informed choice—not a blind one.',

  faq4Question: 'Is my location data private?',
  faq4Answer: "Your location is only used to find restaurants near you. We don't store it, sell it, or share it. Promise.",

  faq5Question: 'How is this different from just reading reviews?',
  faq5Answer: 'You could read 4,000 reviews yourself... or let us summarize them in 10 seconds. We find the patterns humans miss and save you hours of scrolling.',

  // ==================
  // LANDING PAGE - FINAL CTA
  // ==================
  finalCtaTitle1: 'Find something good',
  finalCtaTitle2: 'tonight',
  finalCtaSubtitle: 'No more scrolling. No more arguing. Just dinner.',
  finalCtaBtn: 'Find My Food',

  // ==================
  // FOOTER
  // ==================
  footerBuiltWith: 'Built with',
  footerByName: 'Osama Khalil',

  // ==================
  // LANGUAGE SWITCHER
  // ==================
  language: 'Language',
  english: 'English',
  arabic: 'العربية',
  switchLanguage: 'Switch language',

  // ==================
  // AUTHENTICATION
  // ==================
  auth: {
    // Page titles
    signInTitle: 'Welcome back!',
    signUpTitle: 'Join the food fam!',
    signInSubtitle: 'Sign in to continue your food journey',
    signUpSubtitle: 'Create an account to start discovering',

    // Form labels
    emailLabel: 'Email',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    emailPlaceholder: 'hungry@example.com',
    passwordPlaceholder: '••••••••',
    confirmPasswordPlaceholder: '••••••••',

    // Buttons
    signInButton: 'Sign In',
    signUpButton: 'Create Account',
    continueWithGoogle: 'Continue with Google',
    loading: 'Loading...',

    // Divider
    orDivider: 'or',

    // Toggle links
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    signInLink: 'Sign in',
    signUpLink: 'Sign up',

    // Footer
    footerMessage: 'Your stomach will thank you',

    // Success messages
    successSignUp: 'Account created! Check your email to verify.',

    // Error messages
    errorEmptyFields: 'Please fill in all fields',
    errorPasswordMismatch: 'Passwords do not match',
    errorPasswordTooShort: 'Password must be at least 6 characters',
    errorGeneric: 'Something went wrong. Please try again.',

    // Profile menu
    profile: 'Profile',
    myProfile: 'My Profile',
    signOut: 'Sign Out',
  },

  // ==================
  // USAGE TRACKING
  // ==================
  usage: {
    // SearchCounter component
    searchesRemaining: 'searches remaining',
    limitReached: 'Limit reached',
    upgradeForMore: 'Upgrade for more',
    upgrade: 'Upgrade',

    // UsageLimitModal component
    modalTitle: "You've reached your limit!",
    modalMessage: "You've used all 5 free searches this month.",
    resetsOn: 'Resets on',
    upgradeTitle: 'Upgrade to Pro for:',
    benefit1: '50 searches per month',
    benefit2: 'Priority support',
    upgradeButton: 'Upgrade to Pro',
    waitForReset: "I'll wait for next month",
  },

  // ==================
  // INSPIRATIONS (Food search suggestions)
  // Keep in English - food names are universal
  // ==================
  inspirations: [
    'Authentic Tacos al Pastor',
    'Spicy Ramen Challenge',
    'Cozy Italian Pasta',
    'Vegan Comfort Food',
    'Fresh Sushi Rolls',
    'Gourmet Burgers',
    'Bottomless Brunch Spots',
    'Late-night Korean BBQ',
    'Healthy Mediterranean Salads',
    'Artisanal Pizza',
    'Authentic Pho',
    'Family-style Dim Sum',
    'Farm-to-Table Experience',
    'Spicy Thai Green Curry',
    'Decadent Chocolate Desserts',
    'Craft Coffee Shops',
    'Hidden Gem Dive Bars',
    'Seafood Boil',
    'Southern BBQ Ribs',
    'Vegetarian Indian Buffet',
    'Dog-friendly Patios',
    'Restaurants with a View',
    'Interactive Hot Pot',
    'Açaí Bowls',
    'New York Style Bagels',
    'Bubble Tea Shops',
    'Wood-fired Steakhouse',
    'Gourmet Grilled Cheese',
    'Traditional English Breakfast',
    'Cheap and cheerful noodles',
    'Pancakes and Waffles',
    'Clam Chowder Bread Bowl',
    'Cuban Sandwiches',
    'Ice Cream Sundaes',
  ],
} as const;

export type TranslationKeys = typeof en;
