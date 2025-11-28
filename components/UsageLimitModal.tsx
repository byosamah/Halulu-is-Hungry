/**
 * UsageLimitModal Component
 *
 * Modal that appears when user reaches their search limit.
 * Shows upgrade options and when searches will reset.
 *
 * Features:
 * - Blocks interaction until dismissed
 * - Shows current limit and reset date
 * - Upgrade buttons for monthly/yearly
 * - RTL support
 * - Neobrutalist design
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Calendar, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getRtlShadow } from '../utils/rtlShadow';

interface UsageLimitModalProps {
  // Is the modal open?
  isOpen: boolean;
  // Close handler
  onClose: () => void;
  // Navigate to pricing/upgrade
  onUpgrade: () => void;
}

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const { t, isRTL } = useLanguage();

  // Calculate next month reset date
  const getNextResetDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white border-4 border-brand-dark rounded-2xl w-full max-w-md overflow-hidden"
              style={{ boxShadow: getRtlShadow('xl', isRTL) }}
            >
              {/* Header */}
              <div className="bg-brand-coral p-6 text-white relative">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-1 hover:bg-white/20 rounded-lg transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 p-4 rounded-full">
                    <Zap className="w-10 h-10" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-display-black text-2xl text-center">
                  {t('usage.modalTitle') as string}
                </h2>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Message */}
                <p className="font-body text-brand-dark text-center">
                  {t('usage.modalMessage') as string}
                </p>

                {/* Reset info */}
                <div
                  className="flex items-center gap-3 p-3 bg-brand-cream rounded-xl border-2 border-brand-dark/10"
                >
                  <Calendar className="w-5 h-5 text-brand-muted" />
                  <p className="font-body text-sm text-brand-muted">
                    {t('usage.resetsOn') as string}{' '}
                    <span className="font-display text-brand-dark">{getNextResetDate()}</span>
                  </p>
                </div>

                {/* Upgrade benefits */}
                <div className="space-y-2 py-2">
                  <p className="font-display text-sm text-brand-dark">
                    {t('usage.upgradeTitle') as string}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm font-body text-brand-dark">
                      <Sparkles className="w-4 h-4 text-brand-purple" />
                      {t('usage.benefit1') as string}
                    </li>
                    <li className="flex items-center gap-2 text-sm font-body text-brand-dark">
                      <Crown className="w-4 h-4 text-brand-yellow" />
                      {t('usage.benefit2') as string}
                    </li>
                  </ul>
                </div>

                {/* Upgrade button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onUpgrade}
                  className="w-full py-3.5 px-4 bg-brand-coral text-white font-display text-lg rounded-xl border-3 border-brand-dark flex items-center justify-center gap-2"
                  style={{ boxShadow: getRtlShadow('md', isRTL) }}
                >
                  <Crown className="w-5 h-5" />
                  {t('usage.upgradeButton') as string}
                </motion.button>

                {/* Wait option */}
                <button
                  onClick={onClose}
                  className="w-full py-2 text-brand-muted font-body text-sm hover:text-brand-dark transition-colors"
                >
                  {t('usage.waitForReset') as string}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UsageLimitModal;
