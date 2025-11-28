/**
 * SearchCounter Component
 *
 * Displays the user's remaining search count.
 * Shows warning colors when running low.
 *
 * Features:
 * - Shows "X/Y searches remaining"
 * - Green when plenty remaining
 * - Yellow when running low (≤2)
 * - Red when at limit (0)
 * - Click to upgrade (when low)
 */

import React from 'react';
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

  // Determine colors based on status
  const getStatusColors = () => {
    if (isExhausted) {
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-400',
        icon: 'text-red-500',
      };
    }
    if (isLow) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-400',
        icon: 'text-yellow-500',
      };
    }
    return {
      bg: 'bg-brand-green/10',
      text: 'text-brand-green',
      border: 'border-brand-green/30',
      icon: 'text-brand-green',
    };
  };

  const colors = getStatusColors();

  // Compact version - just shows count
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-display ${colors.bg} ${colors.text}`}
      >
        <Zap className={`w-3.5 h-3.5 ${colors.icon}`} />
        <span>{remaining}/{searchLimit}</span>
      </div>
    );
  }

  // Full version with upgrade prompt
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        inline-flex items-center gap-3 px-4 py-2.5 rounded-xl
        border-2 ${colors.border} ${colors.bg}
        ${onUpgradeClick && (isLow || isExhausted) ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''}
      `}
      onClick={isLow || isExhausted ? onUpgradeClick : undefined}
      style={{ boxShadow: getRtlShadow('xs', isRTL) }}
    >
      {/* Icon */}
      <div className={`${colors.icon}`}>
        {isPremium ? (
          <Crown className="w-5 h-5" />
        ) : (
          <Zap className="w-5 h-5" />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className={`font-display text-sm ${colors.text}`}>
          {isExhausted
            ? (t('usage.limitReached') as string)
            : `${remaining} ${t('usage.searchesRemaining') as string}`
          }
        </span>
        {!isPremium && (isLow || isExhausted) && (
          <span className="text-xs text-brand-muted">
            {t('usage.upgradeForMore') as string}
          </span>
        )}
      </div>

      {/* Upgrade badge */}
      {!isPremium && (isLow || isExhausted) && onUpgradeClick && (
        <div className="bg-brand-coral text-white px-2 py-0.5 rounded-md text-xs font-display">
          {t('usage.upgrade') as string}
        </div>
      )}

      {/* Premium badge */}
      {isPremium && (
        <div className="bg-brand-purple text-white px-2 py-0.5 rounded-md text-xs font-display flex items-center gap-1">
          <Crown className="w-3 h-3" />
          PRO
        </div>
      )}
    </motion.div>
  );
};

export default SearchCounter;
