import React from 'react';
import { motion } from 'framer-motion';

const LuxuryHeader: React.FC = () => (
  <header className="bg-gradient-to-b from-white/90 via-white/80 to-transparent backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-sm">
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="text-center space-y-4">
        {/* 🎈 Main Title - Playful and bold */}
        <motion.h1
          className="font-display text-5xl md:text-7xl font-bold text-foreground leading-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span className="text-primary font-bold">
            Halulu
          </span>{' '}
          <span className="text-foreground">is Hungry</span>{' '}
          <motion.span
            className="inline-block text-5xl md:text-6xl"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 4 }}
          >
            😋
          </motion.span>
        </motion.h1>

        {/* ✨ Fun decorative elements */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex gap-1.5">
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-secondary"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* 🎯 Subtitle - Fun and engaging */}
        <motion.p
          className="font-body text-muted-foreground text-base md:text-lg font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Your AI-powered foodie friend finding the{' '}
          <span className="text-primary font-semibold">perfect bite</span> 🎯
        </motion.p>
      </div>
    </div>
  </header>
);

export default LuxuryHeader;
