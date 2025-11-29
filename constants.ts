// ===================
// ATTRIBUTE FILTERS
// ===================
export const ATTRIBUTE_FILTERS = ["Cozy", "Romantic", "Family Friendly", "Good for groups", "Outdoor seating"];

// ===================
// API CONFIGURATION
// ===================
export const AI_MODEL_NAME = 'gemini-2.5-pro';
export const AI_MODEL_NAME_FLASH = 'gemini-2.5-flash';

// ===================
// GEOLOCATION CONFIG
// ===================
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
} as const;

// ===================
// ANIMATION TIMINGS (in seconds unless noted)
// ===================
export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  STAGGER_DELAY: 0.1,
  PASSWORD_SUCCESS_DELAY: 800, // milliseconds
  PASSWORD_SHAKE_DELAY: 500,   // milliseconds
} as const;

// ===================
// DISPLAY LIMITS
// ===================
export const DISPLAY_LIMITS = {
  PROS_COUNT: 2,
  CONS_COUNT: 1,
  SKELETON_CARDS: 3,
} as const;

// ===================
// UI STRINGS
// ===================
export const UI_STRINGS = {
  // Search
  SEARCH_PLACEHOLDER: "What's your tummy craving? Try 'spicy ramen' or 'cozy café'...",

  // Restaurant Card
  AI_SCORE_LABEL: 'AI Score',
  GOOGLE_RATING_LABEL: 'Google Maps Rating:',
  PROS_HEADING: 'People Love This!',
  CONS_HEADING: 'Heads Up',
  MAPS_BUTTON: "Let's Go Here!",

  // Loading
  LOADING_TITLE: 'Finding your perfect bite!',
  LOADING_SUBTITLE: 'Halulu is sniffing through thousands of reviews...',

  // Empty State
  EMPTY_STATE_TITLE: 'What are you craving?',
  EMPTY_STATE_SUBTITLE: "Tell us what you're hungry for, and we'll read thousands of reviews to find your perfect spot.",

  // Errors
  LOCATION_REQUIRED: 'Location required. Please enable location services to discover restaurants.',
  LOCATION_ACQUIRING: 'Acquiring your location...',
  LOCATION_ALLOW: 'Please allow location access',
  EMPTY_QUERY: 'Your stomach is waiting. Type something.',
  API_KEY_MISSING: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.',
  NO_RESULTS: (query: string) => `No restaurants found for "${query}". Try refining your search or exploring a different cuisine.`,
  ENCOURAGEMENT: "Don't worry, Halulu still believes in you!",

  // Results
  RESULTS_FOUND: (count: number) => `Found ${count} amazing ${count === 1 ? 'spot' : 'spots'} for you!`,
} as const;

// ===================
// ERROR EMOJIS
// ===================
export const ERROR_EMOJI = {
  QUOTA: '⏰',
  API_KEY: '🔑',
  NETWORK: '📡',
  LOCATION: '📍',
  UNKNOWN: '🤔',
} as const;

export const INSPIRATIONS = [
  "Authentic Tacos al Pastor",
  "Spicy Ramen Challenge",
  "Cozy Italian Pasta",
  "Vegan Comfort Food",
  "Fresh Sushi Rolls",
  "Gourmet Burgers",
  "Bottomless Brunch Spots",
  "Late-night Korean BBQ",
  "Healthy Mediterranean Salads",
  "Artisanal Pizza",
  "Authentic Pho",
  "Family-style Dim Sum",
  "Farm-to-Table Experience",
  "Spicy Thai Green Curry",
  "Decadent Chocolate Desserts",
  "Craft Coffee Shops",
  "Hidden Gem Dive Bars",
  "Seafood Boil",
  "Southern BBQ Ribs",
  "Vegetarian Indian Buffet",
  "Dog-friendly Patios",
  "Restaurants with a View",
  "Interactive Hot Pot",
  "Açaí Bowls",
  "New York Style Bagels",
  "Bubble Tea Shops",
  "Wood-fired Steakhouse",
  "Gourmet Grilled Cheese",
  "Traditional English Breakfast",
  "Cheap and cheerful noodles",
  "Pancakes and Waffles",
  "Clam Chowder Bread Bowl",
  "Cuban Sandwiches",
  "Ice Cream Sundaes",
];
