import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
import type { Restaurant } from '../types';
import { DISPLAY_LIMITS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { getRtlShadow } from '../utils/rtlShadow';

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

const RestaurantGridCard: React.FC<RestaurantGridCardProps> = ({ restaurant, isTopPick = false }) => {
  const { t, isRTL } = useLanguage();

  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: "spring" }}
    whileHover={{ y: -4 }}
    className="h-full relative"
  >
    {/* Top Pick Badge - Neobrutalist style */}
    {isTopPick && (
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="absolute -top-3 left-4 z-10"
      >
        <Badge
          className="bg-brand-coral text-white font-display font-bold px-4 py-1.5 text-sm border-2 border-brand-dark rounded-xl"
          style={{ boxShadow: getRtlShadow('xs', isRTL) }}
        >
          🏆 {t('topPick')}
        </Badge>
      </motion.div>
    )}

    <Card
      className="group overflow-hidden h-full flex flex-col bg-white rounded-2xl transition-all duration-300 ease-out border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{
        boxShadow: isTopPick
          ? getRtlShadow('md', isRTL, '#FF6B6B')
          : getRtlShadow('md', isRTL)
      }}
    >
      <CardHeader className="pb-3 space-y-3 relative">

        {/* Restaurant Name */}
        <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-dark leading-tight line-clamp-2">
          {restaurant.title}
        </h3>

        {/* AI Rating - Neobrutalist box */}
        <div className={`flex items-center gap-3 bg-brand-yellow rounded-xl p-3 border-2 border-brand-dark ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-brand-dark font-display font-bold uppercase tracking-wider">
            ⭐ {t('aiScore')}
          </span>
          <span className="font-display text-2xl sm:text-3xl font-bold text-brand-dark tabular-nums">
            {restaurant.aiRating.toFixed(1)}
          </span>
        </div>

        {/* Google Rating */}
        {restaurant.googleRating && restaurant.googleReviewsCount && (
          <div className={`flex flex-wrap items-center gap-2 text-sm text-brand-dark font-body bg-gray-100 rounded-xl px-3 py-2 border-2 border-brand-dark/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-semibold">Google:</span>
            <span className="font-bold">{restaurant.googleRating.toFixed(1)}</span>
            <span>•</span>
            <span className="font-medium">{restaurant.googleReviewsCount.toLocaleString()} {t('reviews')} 💬</span>
          </div>
        )}
      </CardHeader>

      {/* Divider */}
      <div className="px-6">
        <div className="h-1 bg-brand-dark/10 rounded-full" />
      </div>

      <CardContent className="flex-1 pt-4 pb-4 space-y-3">
        {/* Highlights Section */}
        <div className="space-y-2 bg-brand-teal/10 rounded-xl p-4 border-2 border-brand-teal/30">
          <h4 className={`text-sm font-bold text-brand-dark uppercase tracking-wider font-display flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg">😍</span> {t('peopleLove')}
          </h4>
          <ul className="space-y-2">
            {restaurant.pros.slice(0, DISPLAY_LIMITS.PROS_COUNT).map((pro, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-sm text-brand-dark/80 leading-relaxed font-body line-clamp-2 ${isRTL ? 'pr-3 border-r-4' : 'pl-3 border-l-4'} border-brand-teal`}
              >
                "{pro}"
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Cons section */}
        {restaurant.cons && restaurant.cons.length > 0 && (
          <div className="space-y-2 bg-gray-100 rounded-xl p-4 border-2 border-brand-dark/10">
            <h4 className={`text-xs font-bold text-brand-muted uppercase tracking-wider font-display flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>💭</span> {t('headsUp')}
            </h4>
            <ul className="space-y-1">
              {restaurant.cons.slice(0, DISPLAY_LIMITS.CONS_COUNT).map((con, i) => (
                <li key={i} className="text-xs text-brand-muted leading-relaxed font-body line-clamp-2">
                  "{con}"
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      {/* CTA Footer - Neobrutalist button */}
      <CardFooter className="pt-2 pb-5 px-6">
        <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full">
          <Button
            asChild
            size="lg"
            className="w-full h-12 bg-brand-coral hover:bg-brand-coral text-white font-display font-bold rounded-xl border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            style={{ boxShadow: getRtlShadow('sm', isRTL) }}
          >
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              🗺️ {t('letsGoHere')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  </motion.div>
  );
};

export default RestaurantGridCard;
