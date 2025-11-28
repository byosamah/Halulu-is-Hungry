/**
 * Avatar Utilities
 *
 * Generates random food emoji avatars with brand color backgrounds.
 * Each user gets a unique combination assigned on signup.
 *
 * How it works:
 * - 12 food emojis to choose from
 * - 6 brand colors for backgrounds
 * - Combination stored in user's profile
 */

// ==================
// FOOD EMOJIS
// ==================
// Fun food emojis that match the Halulu brand
export const FOOD_EMOJIS = [
  '🍕', // Pizza
  '🍔', // Burger
  '🌮', // Taco
  '🍜', // Noodles
  '🍣', // Sushi
  '🍱', // Bento
  '🥗', // Salad
  '🍩', // Donut
  '🧁', // Cupcake
  '🍪', // Cookie
  '🥐', // Croissant
  '🍳', // Eggs
] as const;

// Type for food emoji
export type FoodEmoji = typeof FOOD_EMOJIS[number];

// ==================
// BACKGROUND COLORS
// ==================
// Brand colors that work well as avatar backgrounds
export const AVATAR_COLORS = {
  coral: {
    name: 'coral',
    bg: '#FF6B6B',      // brand-coral
    text: '#FFFFFF',
  },
  teal: {
    name: 'teal',
    bg: '#00CEC9',      // brand-teal
    text: '#FFFFFF',
  },
  yellow: {
    name: 'yellow',
    bg: '#FFD93D',      // brand-yellow
    text: '#1a1a2e',    // dark text for contrast
  },
  pink: {
    name: 'pink',
    bg: '#FD79A8',      // brand-pink
    text: '#FFFFFF',
  },
  purple: {
    name: 'purple',
    bg: '#A855F7',      // brand-purple
    text: '#FFFFFF',
  },
  green: {
    name: 'green',
    bg: '#00B894',      // brand-green
    text: '#FFFFFF',
  },
} as const;

// Type for color names
export type AvatarColorName = keyof typeof AVATAR_COLORS;

// Array of color names for random selection
export const AVATAR_COLOR_NAMES: AvatarColorName[] = Object.keys(AVATAR_COLORS) as AvatarColorName[];

// ==================
// RANDOM GENERATORS
// ==================

/**
 * Get a random food emoji
 *
 * @returns A random food emoji from the list
 *
 * @example
 * const emoji = getRandomEmoji(); // '🍕'
 */
export const getRandomEmoji = (): FoodEmoji => {
  const randomIndex = Math.floor(Math.random() * FOOD_EMOJIS.length);
  return FOOD_EMOJIS[randomIndex];
};

/**
 * Get a random avatar color name
 *
 * @returns A random color name from the brand colors
 *
 * @example
 * const color = getRandomColorName(); // 'coral'
 */
export const getRandomColorName = (): AvatarColorName => {
  const randomIndex = Math.floor(Math.random() * AVATAR_COLOR_NAMES.length);
  return AVATAR_COLOR_NAMES[randomIndex];
};

/**
 * Get color values by name
 *
 * @param colorName - The name of the color (e.g., 'coral', 'teal')
 * @returns The color object with bg and text colors
 *
 * @example
 * const color = getColorByName('coral');
 * // { name: 'coral', bg: '#FF6B6B', text: '#FFFFFF' }
 */
export const getColorByName = (colorName: AvatarColorName) => {
  return AVATAR_COLORS[colorName];
};

/**
 * Generate a complete random avatar
 *
 * Use this when creating a new user profile.
 *
 * @returns Object with emoji and color name
 *
 * @example
 * const avatar = generateRandomAvatar();
 * // { emoji: '🍕', colorName: 'coral' }
 *
 * // Save to database:
 * await supabase.from('profiles').insert({
 *   avatar_emoji: avatar.emoji,
 *   avatar_bg_color: avatar.colorName,
 * });
 */
export const generateRandomAvatar = () => {
  return {
    emoji: getRandomEmoji(),
    colorName: getRandomColorName(),
  };
};

/**
 * Get avatar display data from stored values
 *
 * Use this when rendering a user's avatar.
 *
 * @param emoji - The stored emoji string
 * @param colorName - The stored color name
 * @returns Object with all the data needed to render the avatar
 *
 * @example
 * const avatarData = getAvatarDisplayData('🍕', 'coral');
 * // {
 * //   emoji: '🍕',
 * //   backgroundColor: '#FF6B6B',
 * //   textColor: '#FFFFFF',
 * //   colorName: 'coral'
 * // }
 */
export const getAvatarDisplayData = (
  emoji: string,
  colorName: string
) => {
  // Default to coral if color name is invalid
  const color = AVATAR_COLORS[colorName as AvatarColorName] || AVATAR_COLORS.coral;

  return {
    emoji,
    backgroundColor: color.bg,
    textColor: color.text,
    colorName: color.name,
  };
};
