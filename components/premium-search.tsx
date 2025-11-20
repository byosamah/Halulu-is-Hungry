import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, MapPin } from 'lucide-react';
import { ATTRIBUTE_FILTERS, INSPIRATIONS } from '../constants';

interface PremiumSearchProps {
  query: string;
  setQuery: (q: string) => void;
  activeFilters: string[];
  setActiveFilters: (f: string[]) => void;
  onSearch: () => void;
  onRefreshLocation: () => void;
  disabled?: boolean;
}

const PremiumSearch: React.FC<PremiumSearchProps> = ({
  query,
  setQuery,
  activeFilters,
  setActiveFilters,
  onSearch,
  onRefreshLocation,
  disabled
}) => {
  const handleFilterClick = (filter: string) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
  };

  const handleInspireMe = () => {
    const randomInspiration = INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
    setQuery(randomInspiration);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSearch();
    }
  };

  // Fun filter emojis!
  const filterEmojis: { [key: string]: string } = {
    'Cozy': '🛋️',
    'Romantic': '💕',
    'Family Friendly': '👨‍👩‍👧‍👦',
    'Good for groups': '🎉',
    'Outdoor seating': '🌳'
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-primary/5 to-secondary/10 rounded-3xl shadow-xl border-2 border-primary/20 p-8 md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-6">
        {/* 🔍 Search Input and Buttons - On same line */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <motion.div
            className="relative group flex-1"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary transition-all group-hover:scale-110" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's your tummy craving? 🤤 Try 'spicy ramen' or 'cozy café'..."
              className="pl-16 pr-4 h-14 text-lg border-2 border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-2xl bg-white font-body text-foreground placeholder:text-muted-foreground/70 shadow-sm hover:shadow-md w-full"
              disabled={disabled}
            />
          </motion.div>

          {/* 🎯 Action Buttons - Beside search */}
          <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onSearch}
              disabled={disabled}
              variant="outline"
              size="lg"
              className="flex-shrink-0 h-14 px-6 rounded-2xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-foreground font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Search className="h-5 w-5 mr-2 text-primary" />
              Let's Eat! 🔍
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleInspireMe}
              disabled={disabled}
              variant="outline"
              size="lg"
              className="flex-shrink-0 h-14 px-6 rounded-2xl border-2 border-accent/40 bg-gradient-to-r from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 text-foreground font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="h-5 w-5 mr-2 text-accent" />
              Inspire Me! ✨
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onRefreshLocation}
              disabled={disabled}
              variant="outline"
              size="icon"
              className="flex-shrink-0 h-14 w-14 rounded-2xl border-2 border-secondary/40 bg-gradient-to-br from-secondary/20 to-secondary/10 hover:from-secondary/30 hover:to-secondary/20 transition-all shadow-md hover:shadow-lg"
            >
              <MapPin className="h-5 w-5 text-secondary-foreground" />
            </Button>
          </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumSearch;
