export interface Restaurant {
  name: string;
  aiRating: number;
  pros: string[];
  cons: string[];
  mapsUrl: string;
  title: string;
  googleRating: number;
  googleReviewsCount: number;
  photo?: string; // Optional Google Places photo URL
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Filter-related types
export interface PriceRange {
  label: string; // Display text (e.g., "$", "$$")
  value: string; // Internal value (e.g., "budget", "moderate")
  description: string; // User-friendly description
}

export interface DistanceOption {
  label: string; // Display text (e.g., "Within 1 mile")
  value: string; // Internal value (e.g., "1")
  km: number; // Kilometers conversion for API
}

export interface FilterState {
  attributes: string[]; // E.g., ["Cozy", "Romantic"]
  priceRanges: string[]; // E.g., ["budget", "moderate"]
  cuisineTypes: string[]; // E.g., ["Italian", "Japanese"]
  distance: string | null; // E.g., "5" (for 5 miles)
  dietaryRestrictions: string[]; // E.g., ["Vegetarian", "Vegan"]
}

// Custom error types for better error handling
export class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuotaExceededError';
  }
}

export class APIKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIKeyError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class InvalidResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidResponseError';
  }
}