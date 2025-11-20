import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LuxuryErrorProps {
  message: string;
}

const LuxuryError: React.FC<LuxuryErrorProps> = ({ message }) => {
  const isQuotaError = message.includes('rate limit') || message.includes('quota');
  const isAPIKeyError = message.includes('API key');
  const isNetworkError = message.includes('network') || message.includes('connection');
  const isLocationError = message.includes('Location') || message.includes('location');

  // Pick friendly emoji based on error type
  const emoji = isQuotaError
    ? '⏰'
    : isAPIKeyError
    ? '🔑'
    : isNetworkError
    ? '📡'
    : isLocationError
    ? '📍'
    : '🤔';

  // Friendly titles instead of scary ones!
  const title = isQuotaError
    ? "Whoa there, speedy! 🏃‍♂️"
    : isAPIKeyError
    ? "Oops, we need a key! 🔑"
    : isNetworkError
    ? "Connection hiccup! 📡"
    : isLocationError
    ? "Where are you? 📍"
    : "Hmm, something's off! 🤔";

  return (
    <motion.div
      className="animate-fade-in max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Alert className="border-2 border-primary/30 bg-gradient-to-br from-white to-primary/5 shadow-lg rounded-3xl p-8">
        {/* Big friendly emoji */}
        <motion.div
          className="text-6xl mb-4 text-center"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.div>

        <AlertTitle className="font-display text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
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
          Don't worry, Halulu still believes in you! 💪✨
        </motion.p>
      </Alert>
    </motion.div>
  );
};

export default LuxuryError;
