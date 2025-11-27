/**
 * LandingPage.tsx - PLAYFUL & COLORFUL REDESIGN
 *
 * A bold, fun landing page that feels like a game, not a boring SaaS site.
 * Design principles:
 * - BIG, chunky typography
 * - Vibrant color blocks
 * - Playful animations
 * - Simple, focused content
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/app?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/app');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Floating food emojis for decoration
  const floatingFoods = ['🍕', '🍜', '🌮', '🍔', '🍣', '🥗', '🥙', '🍛'];

  return (
    <div className="min-h-screen bg-brand-cream overflow-hidden relative">

      {/* ===== GLOBAL COLORFUL BACKGROUND BLOBS - Responsive across entire page ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top left - Coral/Red */}
        <div className="absolute -top-20 -left-20 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-brand-coral rounded-full opacity-30 blur-[100px]" />
        {/* Top right - Teal */}
        <div className="absolute top-10 sm:top-20 -right-20 sm:-right-40 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-brand-teal rounded-full opacity-25 blur-[100px]" />
        {/* Middle left - Yellow */}
        <div className="absolute top-[40%] -left-10 sm:-left-20 w-[180px] sm:w-[250px] md:w-[350px] h-[180px] sm:h-[250px] md:h-[350px] bg-brand-yellow rounded-full opacity-35 blur-[80px]" />
        {/* Middle right - Pink */}
        <div className="absolute top-[60%] -right-10 sm:-right-20 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-brand-pink rounded-full opacity-25 blur-[100px]" />
        {/* Bottom left - Purple */}
        <div className="absolute bottom-[20%] left-[5%] sm:left-[10%] w-[150px] sm:w-[220px] md:w-[300px] h-[150px] sm:h-[220px] md:h-[300px] bg-brand-purple rounded-full opacity-20 blur-[80px]" />
        {/* Bottom center - Lime */}
        <div className="absolute -bottom-10 sm:-bottom-20 left-[30%] sm:left-[40%] w-[250px] sm:w-[350px] md:w-[450px] h-[250px] sm:h-[350px] md:h-[450px] bg-brand-green rounded-full opacity-25 blur-[100px]" />
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b-2 border-brand-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <span className="text-2xl sm:text-3xl">🍽️</span>
            <span className="font-display text-lg sm:text-xl text-brand-dark">Halulu is Hungry</span>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app')}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-coral text-white font-display text-sm sm:text-base rounded-xl border-2 border-brand-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Start Searching 🔍
          </motion.button>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[calc(100vh-70px)] flex items-center justify-center px-4 sm:px-6 pt-4 sm:pt-6 md:pt-8 pb-12 sm:pb-16 md:pb-20 z-10">

        {/* Food emojis - Static decoration, natural scattered look */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Varied distances: some close to edge, some closer to center */}
          {[
            { emoji: '🍕', top: '8%', left: '5%', show: '' },           // far left, top
            { emoji: '🍜', top: '70%', left: '85%', show: '' },         // closer to center, bottom right
            { emoji: '🌮', top: '32%', left: '12%', show: 'hidden sm:block' },  // medium distance, left
            { emoji: '🍔', top: '15%', left: '82%', show: 'hidden sm:block' },  // closer to center, top right
            { emoji: '🍣', top: '75%', left: '6%', show: 'hidden md:block' },   // far left, bottom
            { emoji: '🥗', top: '42%', left: '88%', show: 'hidden md:block' },  // medium right
          ].map((item, i) => (
            <motion.span
              key={i}
              className={`absolute text-3xl sm:text-4xl md:text-5xl lg:text-7xl opacity-80 ${item.show}`}
              style={{
                top: item.top,
                left: item.left,
              }}
              initial={{ opacity: 0, y: 30 }}  // start invisible + below
              animate={{
                opacity: 1,                     // fade in
                y: 0,                           // slide up
                rotate: [0, 3, 0, -3, 0],       // gentle wobble continues
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.1 + i * 0.1 },   // fade in like title
                y: { duration: 0.6, delay: 0.1 + i * 0.1 },         // slide up like title
                rotate: {
                  duration: 6 + i,              // slow wobble
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7 + i * 0.1,         // wobble starts after fade-in
                },
              }}
            >
              {item.emoji}
            </motion.span>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* BIG headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground mb-6"
          >
            Stop arguing about
            <br />
            <span className="text-gradient">where to eat</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            We read thousands of reviews and tell you the truth: Is this place actually good?
          </motion.p>

          {/* Search bar - Matching premium-search style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-gradient-to-br from-white via-primary/5 to-secondary/10 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-primary/20 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative group flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary transition-all group-hover:scale-110" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's your tummy craving? 🤤"
                    className="w-full pl-14 pr-4 h-14 text-lg border-2 border-primary/30 focus:ring-2 focus:ring-primary focus:border-primary transition-all rounded-2xl bg-white font-body text-foreground placeholder:text-muted-foreground/70 shadow-sm hover:shadow-md outline-none"
                  />
                </div>

                {/* Search Button - HIGHLIGHTED! */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="flex-shrink-0 h-14 px-8 rounded-2xl bg-brand-coral text-white font-display font-bold text-lg border-4 border-brand-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5 text-white" />
                  Let's Eat! 🔍
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick tags - Bold with black borders */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {['🍕 Pizza', '🍖 Mansaf', '🍛 Bukhari', '🍔 Burgers', '🧆 Falafel'].map((tag, i) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const query = tag.split(' ')[1];
                  navigate(`/app?q=${encodeURIComponent(query)}`);
                }}
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-white hover:bg-sunshine/20 rounded-full font-body-medium text-foreground transition-all border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </div>

      </section>

      {/* ===== THE PROBLEM - DECISION PARALYSIS ===== */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Every restaurant <span className="underline-playful">looks the same</span>
            </h2>
          </motion.div>

          {/* 4 Restaurant Cards - All look the same */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            {[
              { emoji: '🍕', name: "Bella's Pizza", rating: 4.4, reviews: '892' },
              { emoji: '🍝', name: 'Pasta Paradise', rating: 4.5, reviews: '1.2k' },
              { emoji: '🥘', name: 'The Grill House', rating: 4.3, reviews: '654' },
              { emoji: '🍜', name: 'Noodle Bar', rating: 4.4, reviews: '987' },
            ].map((restaurant, i) => (
              <motion.div
                key={restaurant.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-brand-dark/20 text-center"
              >
                <span className="text-3xl sm:text-4xl block mb-2">{restaurant.emoji}</span>
                <p className="font-display text-sm sm:text-base text-brand-dark mb-2 truncate">{restaurant.name}</p>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                  <span className="font-display-black text-lg text-brand-dark">{restaurant.rating}</span>
                </div>
                <p className="font-body text-xs text-brand-muted">{restaurant.reviews} reviews</p>
              </motion.div>
            ))}
          </div>

          {/* The Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <p className="font-display-black text-2xl sm:text-3xl md:text-4xl text-brand-dark mb-3">
              <span className="mr-2">😵‍💫</span>
              Which one is actually good?
            </p>
            <p className="font-body text-lg text-brand-muted">
              Star ratings lie. Reviews tell the truth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== YOUR AI FOOD DETECTIVE ===== */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Detective card with coral background */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-brand-coral rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 border-4 border-brand-dark shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center"
          >
            {/* Big Detective Emoji */}
            <span className="text-6xl sm:text-7xl md:text-8xl block mb-6">🕵️</span>

            <h2 className="font-display-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-4 text-white">
              Your AI Food Detective
            </h2>
            <p className="font-body text-lg sm:text-xl text-white/90 max-w-xl mx-auto mb-10">
              We read thousands of reviews so you get the truth.
            </p>

            {/* 3 Investigation Steps */}
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
              {/* Step 1: Reads Between the Lines */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white text-brand-dark rounded-2xl p-6 border-4 border-brand-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <span className="text-4xl block mb-3">📖</span>
                <p className="font-display text-lg mb-2">We read everything</p>
                <p className="font-body text-sm text-brand-muted">All 4,000 reviews, not just the stars</p>
              </motion.div>

              {/* Step 2: Weighs the Evidence */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white text-brand-dark rounded-2xl p-6 border-4 border-brand-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <span className="text-4xl block mb-3">⚖️</span>
                <p className="font-display text-lg mb-2">We spot the patterns</p>
                <p className="font-body text-sm text-brand-muted">What do people really say?</p>
              </motion.div>

              {/* Step 3: Delivers the Verdict */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-brand-yellow text-brand-dark rounded-2xl p-6 border-4 border-brand-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <span className="text-4xl block mb-3">✅</span>
                <p className="font-display text-lg mb-2">We give you the truth</p>
                <p className="font-body text-sm text-brand-dark/70">Is it good? Is it worth it?</p>
              </motion.div>
            </div>

            {/* Bottom tagline */}
            <p className="font-display text-lg sm:text-xl text-white">
              Case solved in under 10 seconds ⚡
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== MEET HALULU - THE STORY ===== */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 border-4 border-brand-dark shadow-[8px_8px_0px_0px_var(--brand-teal)] sm:shadow-[12px_12px_0px_0px_var(--brand-teal)]"
          >
            <div className="text-center mb-10">
              <span className="text-5xl sm:text-6xl md:text-7xl mb-4 block">👩‍🍳</span>
              <h2 className="font-display-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-dark">
                Meet Halulu
              </h2>
            </div>

            <div className="space-y-6 font-body text-lg text-brand-dark leading-relaxed">
              <p>
                <strong className="text-brand-coral">Halulu is my wife.</strong> And she was always hungry.
              </p>
              <p>
                Every time we wanted to eat out, she'd spend <em>hours</em> on Google Maps.
                And every time, the same argument:
              </p>
              {/* Quote box - teal accent */}
              <div className="bg-brand-teal/10 rounded-2xl p-6 border-4 border-brand-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] my-8">
                <p className="italic text-brand-dark text-xl">
                  "This one has 4.8 stars with 500 reviews... but this one has 4.5 with 4,000 reviews.
                  <span className="font-display-black not-italic block mt-2 text-brand-teal">Which one is actually better??"</span>
                </p>
              </div>
              <p>
                So I built her an AI that actually <strong className="text-brand-teal">reads the reviews</strong>.
                Not just the stars—the actual words people wrote.
              </p>
              <p>
                Now we find dinner in minutes.
                <br />
                And we don't argue about restaurants anymore.
              </p>
              <p className="text-brand-muted">
                Well... we argue about other things. But not restaurants.
              </p>
            </div>

            {/* CTA at bottom of story card */}
            <div className="text-center mt-10 pt-8 border-t-4 border-brand-dark/10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-brand-coral text-white font-display text-xl rounded-xl border-4 border-brand-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                You can use it too →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-display-black text-2xl sm:text-3xl md:text-5xl text-brand-dark mb-4">
              Fair Pricing
            </h2>
            <p className="font-body text-lg text-brand-muted">
              No tricks. No surprises. Just good recommendations.
            </p>
          </motion.div>

          {/* Pricing Cards - Monthly & Yearly */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">

            {/* Monthly Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-brand-dark shadow-[6px_6px_0px_0px_var(--brand-yellow)]"
            >
              {/* Trial Badge */}
              <div className="flex justify-center mb-6">
                <span className="bg-brand-teal text-white font-display text-sm px-4 py-2 rounded-full border-2 border-brand-dark">
                  🎉 1 Day Free Trial
                </span>
              </div>

              {/* Plan Name */}
              <p className="text-center font-display text-lg text-brand-muted mb-4">Monthly</p>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-display text-2xl text-brand-muted">$</span>
                  <span className="font-display-black text-5xl sm:text-6xl text-brand-dark">7</span>
                </div>
                <p className="font-body text-brand-muted mt-2">per month</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-xl">🔍</span>
                  <span className="font-body-medium text-brand-dark text-sm">100 AI-powered searches</span>
                </div>
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-xl">⭐</span>
                  <span className="font-body-medium text-brand-dark text-sm">Smart review analysis</span>
                </div>
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-xl">📍</span>
                  <span className="font-body-medium text-brand-dark text-sm">Location-based results</span>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/app')}
                className="w-full py-3 bg-white text-brand-dark font-display text-base rounded-xl border-4 border-brand-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Start Free Trial
              </motion.button>
            </motion.div>

            {/* Yearly Card - Best Value */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-brand-dark shadow-[6px_6px_0px_0px_var(--brand-teal)] relative"
            >
              {/* Best Value Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-brand-coral text-white font-display text-sm px-4 py-2 rounded-full border-2 border-brand-dark whitespace-nowrap">
                  🔥 Save 20%
                </span>
              </div>

              {/* Plan Name */}
              <p className="text-center font-display text-lg text-brand-muted mb-4 mt-4">Yearly</p>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-display text-2xl text-brand-muted">$</span>
                  <span className="font-display-black text-5xl sm:text-6xl text-brand-dark">67</span>
                </div>
                <p className="font-body text-brand-muted mt-2">per year</p>
                <p className="font-body text-sm text-brand-teal mt-1">~$5.58/month</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-xl">🔍</span>
                  <span className="font-body-medium text-brand-dark text-sm">1200 AI-powered searches</span>
                </div>
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-xl">⭐</span>
                  <span className="font-body-medium text-brand-dark text-sm">Smart review analysis</span>
                </div>
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-xl">📍</span>
                  <span className="font-body-medium text-brand-dark text-sm">Location-based results</span>
                </div>
              </div>

              {/* CTA Button - Highlighted */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/app')}
                className="w-full py-3 bg-brand-coral text-white font-display text-base rounded-xl border-4 border-brand-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Get Yearly Deal 🚀
              </motion.button>
            </motion.div>
          </div>

          <p className="text-center text-sm text-brand-muted mt-6 font-body">
            No credit card required for trial
          </p>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-display-black text-2xl sm:text-3xl md:text-5xl text-brand-dark mb-4">
              Questions? We got you.
            </h2>
          </motion.div>

          {/* FAQ Cards */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark shadow-[4px_4px_0px_0px_var(--brand-yellow)]"
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                How accurate is it?
              </p>
              <p className="font-body text-brand-muted">
                We analyze what people actually write in their reviews—not just the star rating. The AI looks for patterns across hundreds or thousands of reviews to give you an honest picture.
              </p>
            </motion.div>

            {/* FAQ 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark shadow-[4px_4px_0px_0px_var(--brand-teal)]"
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                Where does this work?
              </p>
              <p className="font-body text-brand-muted">
                Anywhere Google Maps has restaurant data! We're built on top of Google's database, so if it's on Google Maps, we can analyze it.
              </p>
            </motion.div>

            {/* FAQ 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark shadow-[4px_4px_0px_0px_var(--brand-coral)]"
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                What if I don't like the recommendation?
              </p>
              <p className="font-body text-brand-muted">
                Every restaurant is different, and taste is personal. We give you the pros AND cons from real reviews so you can make an informed choice—not a blind one.
              </p>
            </motion.div>

            {/* FAQ 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark shadow-[4px_4px_0px_0px_var(--brand-purple)]"
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                Is my location data private?
              </p>
              <p className="font-body text-brand-muted">
                Your location is only used to find restaurants near you. We don't store it, sell it, or share it. Promise.
              </p>
            </motion.div>

            {/* FAQ 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark shadow-[4px_4px_0px_0px_var(--brand-green)]"
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                How is this different from just reading reviews?
              </p>
              <p className="font-body text-brand-muted">
                You could read 4,000 reviews yourself... or let us summarize them in 10 seconds. We find the patterns humans miss and save you hours of scrolling.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-brand-teal rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 border-4 border-brand-dark shadow-[8px_8px_0px_0px_var(--brand-coral)] sm:shadow-[12px_12px_0px_0px_var(--brand-coral)] text-center"
          >
            <h2 className="font-display-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-brand-dark mb-6">
              Find something good
              <br />
              tonight
            </h2>
            <p className="font-body text-xl text-brand-dark/80 mb-10">
              No more scrolling. No more arguing. Just dinner.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app')}
              className="px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-white text-brand-dark font-display text-lg sm:text-xl rounded-2xl border-4 border-brand-dark shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
            >
              Find My Food 🍽️
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3 border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-3xl">🍽️</span>
            <span className="font-display text-xl text-brand-dark">Halulu is Hungry</span>
          </div>
          <p className="font-body text-brand-dark/70 text-base">
            Built with ❤️ by{' '}
            <a
              href="https://www.osamakhalil.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral hover:underline font-body-medium"
            >
              Osama Khalil
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
