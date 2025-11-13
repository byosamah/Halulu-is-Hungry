import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink } from 'lucide-react';
import type { Restaurant } from '../types';

interface FeaturedRestaurantCardProps {
  restaurant: Restaurant;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  return (
    <div className="flex gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-lg">⭐</span>
      ))}
    </div>
  );
};

const FeaturedRestaurantCard: React.FC<FeaturedRestaurantCardProps> = ({ restaurant }) => (
  <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Badge className="mb-3 bg-primary text-primary-foreground">Top Pick</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground leading-tight">
            {restaurant.title}
          </h2>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-3">
          <StarRating rating={restaurant.aiRating} />
          <span className="font-display text-2xl font-semibold">{restaurant.aiRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">🤖 AI Curated</span>
        </div>
        {restaurant.googleRating && (
          <p className="text-sm text-muted-foreground">
            🗺️ Google Maps: {restaurant.googleRating.toFixed(1)} ⭐ ({restaurant.googleReviewsCount?.toLocaleString()} reviews)
          </p>
        )}
      </div>
    </CardHeader>

    <Separator />

    <CardContent className="pt-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">✨</span>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wide">Highlights</h3>
        </div>
        <ul className="space-y-2">
          {restaurant.pros.map((pro, i) => (
            <li key={i} className="text-sm text-foreground/80 italic pl-4 border-l-2 border-primary/20">
              "{pro}"
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">💭</span>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wide">Considerations</h3>
        </div>
        <ul className="space-y-2">
          {restaurant.cons.map((con, i) => (
            <li key={i} className="text-sm text-muted-foreground italic pl-4 border-l-2 border-muted">
              "{con}"
            </li>
          ))}
        </ul>
      </div>
    </CardContent>

    <Separator />

    <CardFooter className="pt-6">
      <Button asChild className="w-full" size="lg">
        <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
          📍 View on Maps
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </CardFooter>
  </Card>
);

export default FeaturedRestaurantCard;
