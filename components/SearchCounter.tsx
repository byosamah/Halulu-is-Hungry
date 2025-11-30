/**
 * SearchCounter Component
 *
 * Displays the user's remaining search count in neobrutalist style.
 * Shows warning colors when running low.
 *
 * Features:
 * - Shows remaining search count
 * - Teal shadow when plenty remaining
 * - Yellow shadow when running low (≤2)
 * - Coral shadow when at limit (0)
 * - Click to upgrade (when low)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Crown } from 'lucide-react';
import { useUsage, SEARCH_LIMITS } from '../contexts/UsageContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getRtlShadow } from '../utils/rtlShadow';

interface SearchCounterProps {
  // Callback when user clicks to upgrade
  onUpgradeClick?: () => void;
  // Show compact version (just the count)
  compact?: boolean;
}

const SearchCounter: React.FC<SearchCounterProps> = ({
  onUpgradeClick,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { usage, loading } = useUsage();
  const { t, isRTL } = useLanguage();

  // Don't show while loading
  if (loading || !usage) {
    return null;
  }

  // Calculate status
  const { remaining, searchLimit, isPremium, searchCount } = usage;
  const isLow = remaining <= 2 && remaining > 0;
  const isExhausted = remaining === 0;

  // Handle click - free users go to pricing, paid users do nothing
  const handleClick = () => {
    if (!isPremium) {
      navigate('/pricing');
    }
  };

  // Determine shadow color based on status (neobrutalist style)
  const getShadowColor = () => {
    if (isExhausted) return '#FF6B6B'; // brand-coral - danger
    if (isLow) return '#FFD93D'; // brand-yellow - warning
    if (isPremium) return '#A855F7'; // brand-purple - premium
    return '#00CEC9'; // brand-teal - normal
  };

  // Compact version - neobrutalist pill style (44px min touch target)
  // Free users can click to go to pricing
  if (compact) {
    return (
      <motion.div
        onClick={handleClick}
        className={`
          inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2
          min-h-[44px]
          bg-white border-2 sm:border-3 border-brand-dark rounded-full
          font-display text-xs sm:text-sm text-brand-dark
          ${!isPremium ? 'cursor-pointer' : ''}
        `}
        style={{ boxShadow: getRtlShadow('xs', isRTL, getShadowColor()) }}
      >
        {isPremium ? (
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-purple" />
        ) : (
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-coral" />
        )}
        <span className="font-bold">{remaining}</span>
      </motion.div>
    );
  }

  // Full version - neobrutalist card style
  // Free users can click to go to pricing
  return (
    <motion.div
      className={`
        inline-flex items-center gap-3 px-4 py-3
        bg-white border-3 border-brand-dark rounded-2xl
        ${!isPremium ? 'cursor-pointer' : ''}
      `}
      onClick={handleClick}
      style={{ boxShadow: getRtlShadow('sm', isRTL, getShadowColor()) }}
    >
      {/* Icon with background circle */}
      <div className={`
        w-10 h-10 rounded-xl border-2 border-brand-dark
        flex items-center justify-center
        ${isPremium ? 'bg-brand-purple/20' : isExhausted ? 'bg-brand-coral/20' : isLow ? 'bg-brand-yellow/20' : 'bg-brand-teal/20'}
      `}>
        {isPremium ? (
          <Crown className="w-5 h-5 text-brand-purple" />
        ) : (
          <Zap className={`w-5 h-5 ${isExhausted ? 'text-brand-coral' : isLow ? 'text-brand-yellow' : 'text-brand-teal'}`} />
        )}
      </div>

      {/* Count display */}
      <div className="flex flex-col">
        <span className="font-display-black text-2xl text-brand-dark">
          {remaining}
        </span>
        <span className="font-body text-xs text-brand-muted">
          {isExhausted
            ? (t('usage.limitReached') as string)
            : (t('usage.searchesRemaining') as string)
          }
        </span>
      </div>

      {/* Upgrade button - only show when low or exhausted (44px min touch target) */}
      {!isPremium && (isLow || isExhausted) && onUpgradeClick && (
        <div
          className="bg-brand-coral text-white px-3 py-2 min-h-[44px] rounded-xl border-2 border-brand-dark font-display text-xs flex items-center"
          style={{ boxShadow: getRtlShadow('xs', isRTL) }}
        >
          {t('usage.upgrade') as string} ✨
        </div>
      )}

      {/* Premium badge (44px min touch target) */}
      {isPremium && (
        <div
          className="bg-brand-purple text-white px-3 py-2 min-h-[44px] rounded-xl border-2 border-brand-dark font-display text-xs flex items-center gap-1"
          style={{ boxShadow: getRtlShadow('xs', isRTL) }}
        >
          <Crown className="w-3.5 h-3.5" />
          {t('pro') as string}
        </div>
      )}
    </motion.div>
  );
};

export default SearchCounter;
