/**
 * UserAvatar Component
 *
 * Displays a user's avatar with their food emoji and brand color background.
 *
 * Features:
 * - Circular avatar with emoji
 * - Brand color background
 * - Multiple sizes (sm, md, lg)
 * - Neobrutalist border style
 * - RTL-aware shadows
 *
 * Usage:
 * ```tsx
 * <UserAvatar emoji="🍕" colorName="coral" size="md" />
 * ```
 */

import React from 'react';
import { getAvatarDisplayData, AvatarColorName } from '../lib/avatarUtils';
import { getRtlShadow } from '../utils/rtlShadow';
import { useLanguage } from '../contexts/LanguageContext';

// ==================
// TYPES
// ==================

interface UserAvatarProps {
  // The food emoji to display (e.g., '🍕')
  emoji: string;
  // The color name for background (e.g., 'coral', 'teal')
  colorName: string;
  // Size variant
  size?: 'sm' | 'md' | 'lg';
  // Optional click handler
  onClick?: () => void;
  // Optional additional classes
  className?: string;
}

// Size configurations
const SIZES = {
  sm: {
    container: 'w-8 h-8',      // 32px
    emoji: 'text-base',        // 16px
    border: 'border-2',
    shadow: 'xs' as const,
  },
  md: {
    container: 'w-10 h-10',    // 40px
    emoji: 'text-xl',          // 20px
    border: 'border-2',
    shadow: 'sm' as const,
  },
  lg: {
    container: 'w-14 h-14',    // 56px
    emoji: 'text-2xl',         // 24px
    border: 'border-3',
    shadow: 'sm' as const,
  },
};

// ==================
// COMPONENT
// ==================

const UserAvatar: React.FC<UserAvatarProps> = ({
  emoji,
  colorName,
  size = 'md',
  onClick,
  className = '',
}) => {
  const { isRTL } = useLanguage();

  // Get the display data (background color, etc.)
  const avatarData = getAvatarDisplayData(emoji, colorName);

  // Get size configuration
  const sizeConfig = SIZES[size];

  // Base classes for the avatar
  const baseClasses = `
    ${sizeConfig.container}
    ${sizeConfig.border}
    border-brand-dark
    rounded-full
    flex
    items-center
    justify-center
    transition-all
    duration-200
  `;

  // Interactive classes (if clickable)
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
    : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      style={{
        backgroundColor: avatarData.backgroundColor,
        boxShadow: getRtlShadow(sizeConfig.shadow, isRTL),
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <span
        className={`${sizeConfig.emoji} select-none`}
        role="img"
        aria-label={isRTL ? 'صورة المستخدم' : 'User avatar'}
      >
        {avatarData.emoji}
      </span>
    </div>
  );
};

export default UserAvatar;
