import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ERROR_EMOJI, UI_STRINGS } from '../constants';

interface LuxuryErrorProps {
  message: string;
}

// Error type detection helpers
const ERROR_PATTERNS = {
  quota: ['rate limit', 'quota'],
  apiKey: ['API key'],
  network: ['network', 'connection'],
  location: ['Location', 'location'],
} as const;

const detectErrorType = (message: string): 'quota' | 'apiKey' | 'network' | 'location' | 'unknown' => {
  if (ERROR_PATTERNS.quota.some(pattern => message.includes(pattern))) return 'quota';
  if (ERROR_PATTERNS.apiKey.some(pattern => message.includes(pattern))) return 'apiKey';
  if (ERROR_PATTERNS.network.some(pattern => message.includes(pattern))) return 'network';
  if (ERROR_PATTERNS.location.some(pattern => message.includes(pattern))) return 'location';
  return 'unknown';
};

const LuxuryError: React.FC<LuxuryErrorProps> = ({ message }) => {
  const errorType = detectErrorType(message);

  // Pick friendly emoji based on error type using constants
  const emojiMap: Record<string, string> = {
    quota: ERROR_EMOJI.QUOTA,
    apiKey: ERROR_EMOJI.API_KEY,
    network: ERROR_EMOJI.NETWORK,
    location: ERROR_EMOJI.LOCATION,
    unknown: ERROR_EMOJI.UNKNOWN,
  };
  const emoji = emojiMap[errorType];

  // Friendly titles instead of scary ones!
  const titleMap: Record<string, string> = {
    quota: "Whoa there, speedy! 🏃‍♂️",
    apiKey: "Oops, we need a key! 🔑",
    network: "Connection hiccup! 📡",
    location: "Where are you? 📍",
    unknown: "Hmm, something's off! 🤔",
  };
  const title = titleMap[errorType];

  return (
    <motion.div
      className="animate-fade-in max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Alert className="border-2 border-primary/30 bg-gradient-to-br from-white to-primary/5 shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
        {/* Big friendly emoji */}
        <motion.div
          className="text-4xl sm:text-5xl md:text-6xl mb-4 text-center"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.div>

        <AlertTitle className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
          {title}
        </AlertTitle>

        <AlertDescription className="font-body text-base md:text-lg text-center leading-relaxed text-foreground/80">
          {message}
        </AlertDescription>

        {/* Encouraging message */}
        <motion.p
          className="text-center mt-6 text-sm text-muted-foreground font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {UI_STRINGS.ENCOURAGEMENT} 💪✨
        </motion.p>
      </Alert>
    </motion.div>
  );
};

export default LuxuryError;
