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