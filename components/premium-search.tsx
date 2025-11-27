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
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-4 border-brand-dark shadow-[6px_6px_0px_0px_var(--brand-teal)] sm:shadow-[8px_8px_0px_0px_var(--brand-teal)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-4">
        {/* 🔍 Search Input and Buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input - Neobrutalist style */}
          <motion.div
            className="relative group flex-1"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-brand-coral transition-all group-hover:scale-110" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's your tummy craving? 🤤"
              className="pl-16 pr-4 h-14 text-lg border-4 border-brand-dark focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:border-brand-dark transition-all rounded-2xl bg-white font-body text-brand-dark placeholder:text-brand-muted shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full"
              disabled={disabled}
            />
          </motion.div>

          {/* 🎯 Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Let's Eat Button - Primary CTA */}
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onSearch}
              disabled={disabled}
              size="lg"
              className="flex-shrink-0 h-14 px-8 rounded-2xl bg-brand-coral hover:bg-brand-coral text-white font-display font-bold text-lg border-4 border-brand-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Search className="h-5 w-5 mr-2 text-white" />
              Let's Eat! 🔍
            </Button>
          </motion.div>

          {/* Inspire Me Button - Neutral */}
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleInspireMe}
              disabled={disabled}
              size="lg"
              className="flex-shrink-0 h-14 px-6 rounded-2xl bg-white hover:bg-gray-50 text-brand-dark font-display font-bold border-4 border-brand-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5 mr-2 text-brand-coral" />
              Inspire Me! ✨
            </Button>
          </motion.div>

          {/* Location Button - Neutral */}
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onRefreshLocation}
              disabled={disabled}
              size="icon"
              className="flex-shrink-0 h-14 w-14 rounded-2xl bg-white hover:bg-gray-50 text-brand-dark border-4 border-brand-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <MapPin className="h-5 w-5 text-brand-coral" />
            </Button>
          </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumSearch;
