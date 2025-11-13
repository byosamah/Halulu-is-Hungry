// Magic numbers extracted for maintainability
export const MAX_PROS_IN_CARD = 2;
export const MAX_CONS_IN_CARD = 1;
export const LOCATION_TIMEOUT = 10000;
export const LOCATION_MAX_AGE = 0;

// Filter Options
export const ATTRIBUTE_FILTERS = ["Cozy", "Romantic", "Family Friendly", "Good for groups", "Outdoor seating"];

export const PRICE_RANGES = [
  { label: "$", value: "budget", description: "Budget-friendly" },
  { label: "$$", value: "moderate", description: "Moderate" },
  { label: "$$$", value: "upscale", description: "Upscale" },
  { label: "$$$$", value: "fine-dining", description: "Fine Dining" }
];

export const CUISINE_TYPES = [
  "Italian", "Japanese", "Mexican", "Chinese", "American",
  "Thai", "Indian", "French", "Mediterranean", "Korean",
  "Vietnamese", "Spanish", "Greek", "Middle Eastern", "Brazilian"
];

export const DISTANCE_OPTIONS = [
  { label: "Within 1 mile", value: "1", km: 1.6 },
  { label: "Within 5 miles", value: "5", km: 8 },
  { label: "Within 10 miles", value: "10", km: 16 },
  { label: "20+ miles", value: "20", km: 32 }
];

export const DIETARY_RESTRICTIONS = [
  "Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher", "Dairy-free"
];

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
