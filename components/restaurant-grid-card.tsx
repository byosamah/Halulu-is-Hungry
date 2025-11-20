import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
import type { Restaurant } from '../types';

interface RestaurantGridCardProps {
  restaurant: Restaurant;
  isTopPick?: boolean;
}

// ⭐ FUN Colorful Star Rating!
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = 5 - Math.ceil(rating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex gap-1">
      {/* Full stars - bright yellow/gold */}
      {[...Array(fullStars)].map((_, i) => (
        <motion.div
          key={`full-${i}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
        >
          <Star className={`${sizeClasses[size]} fill-accent text-accent drop-shadow-sm`} />
        </motion.div>
      ))}

      {/* Partial star */}
      {partialStar > 0 && (
        <div className="relative">
          <Star className={`${sizeClasses[size]} fill-muted text-muted`} />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
            <Star className={`${sizeClasses[size]} fill-accent text-accent drop-shadow-sm`} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClasses[size]} fill-muted/40 text-muted/40`} />
      ))}
    </div>
  );
};

const RestaurantGridCard: React.FC<RestaurantGridCardProps> = ({ restaurant, isTopPick = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: "spring" }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="h-full relative"
  >
    {/* Top Pick Badge - Small and outside the card */}
    {isTopPick && (
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="absolute -top-3 left-4 z-10"
      >
        <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-body font-bold px-3 py-1 text-xs tracking-wide shadow-lg rounded-xl border-2 border-orange-700">
          🏆 Top Pick
        </Badge>
      </motion.div>
    )}

    <Card className={`
      group overflow-hidden h-full flex flex-col
      bg-gradient-to-br from-white via-white to-primary/5
      border-2 transition-all duration-300 ease-out
      shadow-lg hover:shadow-2xl rounded-3xl
      ${isTopPick
        ? 'border-accent bg-gradient-to-br from-accent/5 via-white to-accent/10 shadow-accent/20'
        : 'border-primary/20 hover:border-primary/40'
      }
    `}>
      <CardHeader className="pb-4 space-y-4 relative">

        {/* Restaurant Name - Fun and bold */}
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {restaurant.title}
        </h3>

        {/* AI Rating - Super prominent with fun design */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-3 border-2 border-accent/20">
          <span className="text-xs text-foreground/70 font-body font-bold uppercase tracking-wider">
            ⭐ AI Score
          </span>
          <span className="font-display text-3xl font-bold text-foreground tabular-nums">
            {restaurant.aiRating.toFixed(1)}
          </span>
        </div>

        {/* Google Rating - Fun secondary info */}
        {restaurant.googleRating && restaurant.googleReviewsCount && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body bg-secondary/10 rounded-xl px-3 py-2 border border-secondary/20">
            <span className="font-semibold">Google Maps Rating:</span>
            <span className="font-bold text-foreground">{restaurant.googleRating.toFixed(1)}</span>
            <span className="text-secondary-foreground">•</span>
            <span className="font-medium">{restaurant.googleReviewsCount.toLocaleString()} reviews 💬</span>
          </div>
        )}
      </CardHeader>

      {/* Fun wavy divider */}
      <div className="px-6">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
      </div>

      <CardContent className="flex-1 pt-5 pb-4 space-y-4">
        {/* Highlights Section - More fun! */}
        <div className="space-y-3 bg-primary/5 rounded-2xl p-4 border border-primary/20">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider font-display flex items-center gap-2">
            <span className="text-lg">😍</span> People Love This!
          </h4>
          <ul className="space-y-2">
            {restaurant.pros.slice(0, 2).map((pro, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm text-foreground/80 leading-relaxed font-body line-clamp-2 pl-3 border-l-2 border-primary/40"
              >
                "{pro}"
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Cons section - friendlier design */}
        {restaurant.cons && restaurant.cons.length > 0 && (
          <div className="space-y-2 bg-muted/30 rounded-2xl p-4 border border-border/40">
            <h4 className="text-xs font-bold text-foreground/70 uppercase tracking-wider font-display flex items-center gap-2">
              <span>💭</span> Heads Up
            </h4>
            <ul className="space-y-1">
              {restaurant.cons.slice(0, 1).map((con, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed font-body line-clamp-2">
                  "{con}"
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      {/* Fun CTA Footer with gradient */}
      <CardFooter className="pt-4 pb-5 bg-gradient-to-t from-primary/10 to-transparent">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
          <Button asChild variant="outline" size="lg" className="w-full h-12 bg-white hover:bg-gray-50 text-orange-600 hover:text-orange-700 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all border-2 border-gray-300">
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              🗺️ Let's Go Here!
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  </motion.div>
);

export default RestaurantGridCard;
