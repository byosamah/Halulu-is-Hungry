/**
 * RTL Shadow Helper
 *
 * Returns the correct shadow based on RTL state.
 * In RTL mode (Arabic), shadows point LEFT instead of RIGHT.
 *
 * This approach uses inline styles which GUARANTEES the correct
 * shadow direction, unlike CSS custom properties which may not
 * work reliably with Tailwind v4.
 */

// Shadow sizes mapping - matches our neobrutalist design
const SHADOW_SIZES = {
  xs: { x: 2, y: 2 },
  sm: { x: 3, y: 3 },
  md: { x: 4, y: 4 },
  lg: { x: 6, y: 6 },
  xl: { x: 8, y: 8 },
  '2xl': { x: 12, y: 12 },
};

// Type for shadow size keys
export type ShadowSize = keyof typeof SHADOW_SIZES;

/**
 * Get shadow value (consistent direction for neobrutalist design)
 *
 * @param size - Shadow size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * @param isRTL - Whether the current language is RTL (Arabic) - kept for API compatibility
 * @param color - Shadow color (default: solid black)
 * @returns CSS box-shadow value string
 *
 * NOTE: Shadows always point bottom-right for consistent neobrutalist look.
 * The flexbox/grid layout handles RTL positioning of elements automatically.
 *
 * @example
 * // Basic usage
 * style={{ boxShadow: getRtlShadow('lg', isRTL) }}
 *
 * @example
 * // With custom color
 * style={{ boxShadow: getRtlShadow('lg', isRTL, 'var(--color-brand-teal)') }}
 */
export const getRtlShadow = (
  size: ShadowSize,
  isRTL: boolean,
  color: string = 'rgba(0,0,0,1)'
): string => {
  const { x, y } = SHADOW_SIZES[size];
  // Shadows always point bottom-right for consistent neobrutalist design
  // RTL layout is handled by flexbox/grid direction, not shadow direction
  const shadow = `${x}px ${y}px 0px 0px ${color}`;
  // DEBUG: Log shadow values to verify they're correct
  console.log(`[getRtlShadow] size=${size}, isRTL=${isRTL}, color=${color} => ${shadow}`);
  return shadow;
};

/**
 * Common shadow presets with brand colors
 */
export const getShadowPresets = (isRTL: boolean) => ({
  // Default black shadows
  neo: {
    xs: getRtlShadow('xs', isRTL),
    sm: getRtlShadow('sm', isRTL),
    md: getRtlShadow('md', isRTL),
    lg: getRtlShadow('lg', isRTL),
    xl: getRtlShadow('xl', isRTL),
    '2xl': getRtlShadow('2xl', isRTL),
  },
  // Teal shadows (for search box, etc.)
  teal: {
    sm: getRtlShadow('sm', isRTL, '#00CEC9'),
    md: getRtlShadow('md', isRTL, '#00CEC9'),
    lg: getRtlShadow('lg', isRTL, '#00CEC9'),
    xl: getRtlShadow('xl', isRTL, '#00CEC9'),
  },
  // Coral shadows (for top picks, CTAs)
  coral: {
    sm: getRtlShadow('sm', isRTL, '#FF6B6B'),
    md: getRtlShadow('md', isRTL, '#FF6B6B'),
    lg: getRtlShadow('lg', isRTL, '#FF6B6B'),
    xl: getRtlShadow('xl', isRTL, '#FF6B6B'),
  },
  // Yellow shadows (for AI score)
  yellow: {
    sm: getRtlShadow('sm', isRTL, '#FFD93D'),
    md: getRtlShadow('md', isRTL, '#FFD93D'),
    lg: getRtlShadow('lg', isRTL, '#FFD93D'),
  },
});
