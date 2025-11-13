import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Restaurant } from '../types';

interface RestaurantGridCardProps {
  restaurant: Restaurant;
  isTopPick?: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  return (
    <div className="flex gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-base">⭐</span>
      ))}
    </div>
  );
};

const RestaurantGridCard: React.FC<RestaurantGridCardProps> = ({ restaurant, isTopPick = false }) => (
  <Card className={`shadow hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col ${isTopPick ? 'border-2 border-primary' : ''}`}>
    <CardHeader className="pb-3">
      {isTopPick && (
        <Badge className="mb-2 w-fit bg-primary text-primary-foreground">🏆 Top Pick</Badge>
      )}
      <h3 className="font-display text-xl font-semibold text-foreground leading-tight line-clamp-2">
        {restaurant.title}
      </h3>
      <div className="flex items-center gap-2 mt-2">
        <StarRating rating={restaurant.aiRating} />
        <span className="font-display text-lg font-semibold">{restaurant.aiRating.toFixed(1)}</span>
      </div>
      {restaurant.googleRating && (
        <p className="text-xs text-muted-foreground mt-1">
          🗺️ Google Maps: {restaurant.googleRating.toFixed(1)} ⭐ ({restaurant.googleReviewsCount?.toLocaleString()})
        </p>
      )}
    </CardHeader>

    <CardContent className="flex-1 pt-0 space-y-3 text-sm">
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">✨ Highlights</p>
        <ul className="space-y-1">
          {restaurant.pros.slice(0, 2).map((pro, i) => (
            <li key={i} className="text-xs text-foreground/70 line-clamp-2 italic">
              "{pro}"
            </li>
          ))}
        </ul>
      </div>
    </CardContent>

    <CardFooter className="pt-3">
      <Button asChild variant="outline" size="sm" className="w-full">
        <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
          📍 View <ExternalLink className="ml-1.5 h-3 w-3" />
        </a>
      </Button>
    </CardFooter>
  </Card>
);

export default RestaurantGridCard;
