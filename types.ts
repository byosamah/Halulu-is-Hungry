export interface Restaurant {
  name: string;
  aiRating: number;
  pros: string[];
  cons: string[];
  mapsUrl: string;
  title: string;
  googleRating: number;
  googleReviewsCount: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
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