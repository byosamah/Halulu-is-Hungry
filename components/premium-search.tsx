import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getRtlShadow } from '../utils/rtlShadow';

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
  const { t, isRTL } = useLanguage();

  const handleFilterClick = (filter: string) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
  };

  const handleInspireMe = () => {
    // Get translated inspirations array
    const inspirations = t('inspirations') as unknown as string[];
    const randomInspiration = inspirations[Math.floor(Math.random() * inspirations.length)];
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
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-4 border-brand-dark"
      style={{ boxShadow: getRtlShadow('lg', isRTL, '#00CEC9') }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`flex flex-col gap-4 ${isRTL ? 'text-right' : ''}`}>
        {/*
          Flexbox with dir="rtl" automatically flips layout:
          - LTR: Input LEFT, Buttons RIGHT
          - RTL: Input RIGHT, Buttons LEFT
          So we keep the SAME order and let the browser handle the flip!
        */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Input - Always rendered first (LEFT in LTR, RIGHT in RTL) */}
          <motion.div
            className="relative group flex-1"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search icon - position adjusts on mobile for better space */}
            <Search className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-brand-coral transition-all group-hover:scale-110" />
            <Input
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${t('searchPlaceholder')} 🤤`}
              className="pl-12 sm:pl-16 pr-4 h-[68px] text-lg border-4 border-brand-dark focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:border-brand-dark transition-all rounded-2xl bg-white font-body text-brand-dark placeholder:text-brand-muted w-full"
              disabled={disabled}
            />
          </motion.div>

          {/* Buttons - Always rendered second (RIGHT in LTR, LEFT in RTL) */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Let's Eat Button - Primary CTA, full width on mobile */}
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onSearch}
                disabled={disabled}
                size="lg"
                className="h-[68px] px-8 rounded-2xl bg-brand-coral hover:bg-brand-coral text-white font-display font-bold text-lg border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 w-full sm:w-auto"
                style={{ boxShadow: getRtlShadow('md', isRTL) }}
              >
                {t('letsEat')} 🔍
              </Button>
            </motion.div>

            {/* Inspire Me + Location - Side by side on mobile */}
            <div className="flex gap-2 sm:gap-3">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                <Button
                  onClick={handleInspireMe}
                  disabled={disabled}
                  size="lg"
                  className="h-[68px] px-6 rounded-2xl bg-white hover:bg-gray-50 text-brand-dark font-display font-bold border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 w-full"
                  style={{ boxShadow: getRtlShadow('sm', isRTL) }}
                >
                  <Sparkles className="h-5 w-5 text-brand-coral" />
                  {t('inspireMe')} ✨
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onRefreshLocation}
                  disabled={disabled}
                  size="icon"
                  className="h-[68px] w-[68px] rounded-2xl bg-white hover:bg-gray-50 text-brand-dark border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  style={{ boxShadow: getRtlShadow('sm', isRTL) }}
                >
                  <MapPin className="h-5 w-5 text-brand-coral" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumSearch;
