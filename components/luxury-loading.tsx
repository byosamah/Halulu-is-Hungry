import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const LuxuryLoading: React.FC = () => (
  <div className="space-y-12 animate-fade-in">
    {/* 🎪 Fun Loading Animation */}
    <div className="text-center py-16 space-y-8">
      {/* 🍔 Bouncing food emojis instead of boring spinner! */}
      <div className="flex items-center justify-center gap-4">
        <motion.div
          className="text-6xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        >
          🍕
        </motion.div>
        <motion.div
          className="text-6xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          🍜
        </motion.div>
        <motion.div
          className="text-6xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        >
          🍔
        </motion.div>
      </div>

      {/* Fun loading messages */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="font-display text-3xl md:text-4xl text-foreground font-bold">
          Finding your perfect bite! 😋
        </p>
        <p className="text-lg text-muted-foreground font-body">
          Halulu is sniffing through thousands of reviews...{' '}
          <span className="inline-block animate-wiggle">👃</span>
        </p>
      </motion.div>

      {/* 🎯 Colorful loading dots */}
      <div className="flex items-center justify-center gap-2">
        <motion.div
          className="h-3 w-3 rounded-full bg-primary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className="h-3 w-3 rounded-full bg-accent"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.2,
          }}
        />
        <motion.div
          className="h-3 w-3 rounded-full bg-secondary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.4,
          }}
        />
      </div>
    </div>

    {/* Skeleton Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border/60 animate-bounce-in" style={{ animationDelay: `${i * 0.15}s`, opacity: 0, animationFillMode: 'forwards' }}>
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-3/4 rounded-xl bg-primary/10" />
            <Skeleton className="h-5 w-1/2 rounded-xl bg-accent/10" />
            <Skeleton className="h-4 w-2/3 rounded-xl bg-secondary/10" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full rounded-xl bg-muted" />
            <Skeleton className="h-4 w-5/6 rounded-xl bg-muted" />
            <Skeleton className="h-12 w-full rounded-2xl mt-4 bg-primary/20" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default LuxuryLoading;
