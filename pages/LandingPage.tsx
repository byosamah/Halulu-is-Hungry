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
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getRtlShadow } from '../utils/rtlShadow';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
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

      {/* ===== HERO BACKGROUND BLOBS - Only covers hero + a bit after ===== */}
      {/* Using inline styles to prevent RTL CSS rules from flipping positions */}
      <div
        className="absolute overflow-hidden pointer-events-none z-0"
        style={{ top: 0, left: 0, right: 0, height: '130vh' }}
      >
        {/* Top left - Coral/Red */}
        <div
          className="absolute w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-brand-coral rounded-full opacity-30 blur-[100px]"
          style={{ top: '-5rem', left: '-5rem' }}
        />
        {/* Top right - Teal */}
        <div
          className="absolute w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-brand-teal rounded-full opacity-25 blur-[100px]"
          style={{ top: '2.5rem', right: '-5rem' }}
        />
        {/* Middle left - Yellow */}
        <div
          className="absolute w-[180px] sm:w-[250px] md:w-[350px] h-[180px] sm:h-[250px] md:h-[350px] bg-brand-yellow rounded-full opacity-35 blur-[80px]"
          style={{ top: '40%', left: '-2.5rem' }}
        />
        {/* Middle right - Pink */}
        <div
          className="absolute w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-brand-pink rounded-full opacity-25 blur-[100px]"
          style={{ top: '60%', right: '-2.5rem' }}
        />
        {/* Bottom left - Purple */}
        <div
          className="absolute w-[150px] sm:w-[220px] md:w-[300px] h-[150px] sm:h-[220px] md:h-[300px] bg-brand-purple rounded-full opacity-20 blur-[80px]"
          style={{ bottom: '20%', left: '5%' }}
        />
        {/* Bottom center - Lime */}
        <div
          className="absolute w-[250px] sm:w-[350px] md:w-[450px] h-[250px] sm:h-[350px] md:h-[450px] bg-brand-green rounded-full opacity-25 blur-[100px]"
          style={{ bottom: '-2.5rem', left: '30%' }}
        />
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/*
            Flexbox with justify-between + dir="rtl" automatically flips layout:
            - LTR: First child → LEFT, Second child → RIGHT
            - RTL: First child → RIGHT, Second child → LEFT
            So we keep the SAME order and let the browser handle the flip!
          */}

          {/* Logo - Always rendered first (LEFT in LTR, RIGHT in RTL) */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8"
              viewBox="0 0 182.59 194.77"
              fill="currentColor"
            >
              <path d="M69.46,5.75v35.25c-7.33,1.12-13.99.31-20.95-2.05l-.17-33.08c-2.1-6.84-11.22-7.28-13.36-.09l-.11,32.64c-6.61,3.06-13.72,3.67-20.92,2.58V6.25c0-.76-1.51-3.13-2.25-3.75C7.01-1.45,1.11,1.03,0,6.79l.02,86.9c1.5,13.63,12.86,24.26,26.62,24.38l.69.66-5.37,61.52c1.04,13.38,12.56,15.06,23.77,14.27,11.82-.83,16.31-7.73,15.22-19.27l-5-57.25c13.69-.08,24.73-9.93,26.95-23.3l.02-89.42c-1.59-7.22-12.28-6.68-13.47.47Z"/>
              <path d="M181.95,42.26c-1.63-19.9-22.2-42.26-42.74-42.26h-26.25v183.25c0,6.45,8.81,10.69,14.31,11.19,13.43,1.22,26.16-.22,25.71-16.71l-5.47-59.41c5.97-3.04,12.65-5.19,18.19-9.33,8.24-6.16,15.16-18,16.2-28.3.97-9.7.86-28.62.05-38.43Z"/>
            </svg>
            <span className="font-display text-lg sm:text-xl text-brand-dark">{t('brandName')}</span>
          </motion.div>

          {/* Buttons - Always rendered second (RIGHT in LTR, LEFT in RTL) */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <motion.button
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app')}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-coral text-white font-display text-sm sm:text-base rounded-xl border-2 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: getRtlShadow('sm', isRTL) }}
            >
              {t('startSearching')} 🔍
            </motion.button>
          </div>
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
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* BIG headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground mb-6"
          >
            {t('heroTitle1')}
            <br />
            <span className="text-gradient">{t('heroTitle2')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Search bar - Matching premium-search style */}
          {/* Responsive width: full on mobile, then constrain on larger screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full px-4 sm:px-0 sm:w-[80vw] md:w-[60vw] lg:w-[51vw] max-w-[650px] mx-auto mb-8"
          >
            <div
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-4 border-brand-dark"
              style={{ boxShadow: getRtlShadow('lg', isRTL, '#00CEC9') }}
            >
              {/*
                Flexbox with dir="rtl" automatically flips layout:
                - LTR: Input LEFT, Button RIGHT
                - RTL: Input RIGHT, Button LEFT
              */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Input - Always rendered first (LEFT in LTR, RIGHT in RTL) */}
                <motion.div
                  className="relative group flex-1"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Search icon - always on the left */}
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-brand-coral transition-all group-hover:scale-110" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`${t('searchPlaceholder')} 🤤`}
                    className="w-full pl-16 pr-4 h-[68px] text-lg border-4 border-brand-dark focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:border-brand-dark transition-all rounded-2xl bg-white font-body text-brand-dark placeholder:text-brand-muted outline-none"
                  />
                </motion.div>

                {/* Let's Eat Button - Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="flex-shrink-0 h-[68px] px-8 rounded-2xl bg-brand-coral text-white font-display font-bold text-lg border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  style={{ boxShadow: getRtlShadow('md', isRTL) }}
                >
                  {t('letsEat')} 🔍
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
            {/* Food tags with emojis - use translated quickTags */}
            {['🍕', '🍖', '🌯', '🍔', '🧆'].map((emoji, i) => {
              const tags = t('quickTags') as unknown as string[];
              const tagName = tags[i];
              return (
                <motion.button
                  key={tagName}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigate(`/app?q=${encodeURIComponent(tagName)}`);
                  }}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-white hover:bg-sunshine/20 rounded-full font-body-medium text-foreground transition-all border-2 border-foreground hover:-translate-x-0.5 hover:-translate-y-0.5"
                  style={{ boxShadow: getRtlShadow('sm', isRTL) }}
                >
                  {emoji} {tagName}
                </motion.button>
              );
            })}
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
              {t('problemTitle')} <span className="underline-playful">{t('problemTitleHighlight')}</span>
            </h2>
          </motion.div>

          {/* 4 Restaurant Cards - All look the same */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            {[
              { emoji: '🍕', name: isRTL ? 'بيتزا بيلا' : "Bella's Pizza", rating: 4.4, reviews: '892' },
              { emoji: '🍝', name: isRTL ? 'جنة الباستا' : 'Pasta Paradise', rating: 4.5, reviews: '1.2k' },
              { emoji: '🥘', name: isRTL ? 'بيت المشاوي' : 'The Grill House', rating: 4.3, reviews: '654' },
              { emoji: '🍜', name: isRTL ? 'نودلز بار' : 'Noodle Bar', rating: 4.4, reviews: '987' },
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
                <p className="font-body text-xs text-brand-muted">{restaurant.reviews} {t('reviews')}</p>
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
            <p className={`font-display-black text-2xl sm:text-3xl md:text-4xl text-brand-dark mb-3 ${isRTL ? 'flex items-center justify-center flex-row-reverse gap-2' : ''}`}>
              <span className={isRTL ? '' : 'mr-2'}>😵‍💫</span>
              {t('problemQuestion')}
            </p>
            <p className="font-body text-lg text-brand-muted">
              {t('problemAnswer')}
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
            className="bg-brand-coral rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 border-4 border-brand-dark text-center"
            style={{ boxShadow: getRtlShadow('xl', isRTL) }}
          >
            {/* Big Detective Emoji */}
            <span className="text-6xl sm:text-7xl md:text-8xl block mb-6">🕵️</span>

            <h2 className="font-display-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-4 text-white">
              {t('detectiveTitle')}
            </h2>
            <p className="font-body text-lg sm:text-xl text-white/90 max-w-xl mx-auto mb-10">
              {t('detectiveSubtitle')}
            </p>

            {/* 3 Investigation Steps */}
            <div
              className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-10"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              {/* Step 1: Reads Between the Lines */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white text-brand-dark rounded-2xl p-6 border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: getRtlShadow('lg', isRTL) }}
              >
                <span className="text-4xl block mb-3" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>📖</span>
                <p className="font-display text-lg mb-2">{t('step1Title')}</p>
                <p className="font-body text-sm text-brand-muted">{t('step1Subtitle')}</p>
              </motion.div>

              {/* Step 2: Weighs the Evidence */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white text-brand-dark rounded-2xl p-6 border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: getRtlShadow('lg', isRTL) }}
              >
                <span className="text-4xl block mb-3" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>⚖️</span>
                <p className="font-display text-lg mb-2">{t('step2Title')}</p>
                <p className="font-body text-sm text-brand-muted">{t('step2Subtitle')}</p>
              </motion.div>

              {/* Step 3: Delivers the Verdict */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-brand-yellow text-brand-dark rounded-2xl p-6 border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: getRtlShadow('lg', isRTL) }}
              >
                <span className="text-4xl block mb-3" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>✅</span>
                <p className="font-display text-lg mb-2">{t('step3Title')}</p>
                <p className="font-body text-sm text-brand-dark/70">{t('step3Subtitle')}</p>
              </motion.div>
            </div>

            {/* Bottom tagline */}
            <p className="font-display text-lg sm:text-xl text-white">
              {t('detectiveTagline')} ⚡
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
            className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 border-4 border-brand-dark"
            style={{ boxShadow: getRtlShadow('lg', isRTL, '#00CEC9') }}
          >
            <div className="text-center mb-10">
              <span className="text-5xl sm:text-6xl md:text-7xl mb-4 block">👩‍🍳</span>
              <h2 className="font-display-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-dark">
                {t('storyTitle')}
              </h2>
            </div>

            <div className="space-y-6 font-body text-lg text-brand-dark leading-relaxed text-center">
              <p>
                <strong className="text-brand-coral">{t('storyParagraph1')}</strong> {t('storyParagraph1b')}
              </p>
              <p>
                {t('storyParagraph2')}
              </p>
              {/* Quote box - teal accent */}
              <div
                className="bg-brand-teal/10 rounded-2xl p-6 border-4 border-brand-dark my-8 text-center"
                style={{ boxShadow: getRtlShadow('lg', isRTL) }}
              >
                <p className="italic text-brand-dark text-xl">
                  "{t('storyQuote')}
                  <span className="font-display-black not-italic block mt-2 text-brand-teal">{t('storyQuoteHighlight')}</span>
                </p>
              </div>
              <p>
                {t('storyParagraph3')}
              </p>
              <p>
                {t('storyParagraph4')}
                <br />
                {t('storyParagraph4b')}
              </p>
              <p className="text-brand-muted">
                {t('storyParagraph5')}
              </p>
            </div>

            {/* CTA at bottom of story card */}
            <div className="text-center mt-10 pt-8 border-t-4 border-brand-dark/10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-brand-coral text-white font-display text-xl rounded-xl border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: getRtlShadow('lg', isRTL) }}
              >
                {t('storyCta')} {isRTL ? '←' : '→'}
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
              {t('pricingTitle')}
            </h2>
            <p className="font-body text-lg text-brand-muted">
              {t('pricingSubtitle')}
            </p>
          </motion.div>

          {/* Pricing Cards - Monthly only (Yearly temporarily hidden) */}
          <div
            className="flex justify-center gap-6 md:gap-8"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >

            {/* Monthly Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-brand-dark w-full max-w-md"
              style={{ boxShadow: getRtlShadow('md', isRTL, '#FFD93D') }}
            >
              {/* Trial Badge */}
              <div className="flex justify-center mb-6">
                <span className="bg-brand-teal text-white font-display text-sm px-4 py-2 rounded-full border-2 border-brand-dark">
                  🎉 {t('monthlyPlanBadge')}
                </span>
              </div>

              {/* Plan Name */}
              <p className="text-center font-display text-lg text-brand-muted mb-4">{t('monthlyPlanName')}</p>

              {/* Price */}
              <div className="text-center mb-6">
                <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-display text-2xl text-brand-muted">$</span>
                  <span className="font-display-black text-5xl sm:text-6xl text-brand-dark">{t('monthlyPrice')}</span>
                </div>
                <p className="font-body text-brand-muted mt-2">{t('monthlyPeriod')}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20">
                  <span className="text-xl bg-brand-yellow/30 p-2 rounded-lg border-2 border-brand-dark/10" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>🔍</span>
                  <span className="font-body-medium text-brand-dark text-sm">{t('monthlyFeature1')}</span>
                </div>
                <div className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20">
                  <span className="text-xl bg-brand-coral/20 p-2 rounded-lg border-2 border-brand-dark/10" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>⭐</span>
                  <span className="font-body-medium text-brand-dark text-sm">{t('monthlyFeature2')}</span>
                </div>
                <div className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20">
                  <span className="text-xl bg-brand-teal/20 p-2 rounded-lg border-2 border-brand-dark/10" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>📍</span>
                  <span className="font-body-medium text-brand-dark text-sm">{t('monthlyFeature3')}</span>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/app')}
                className="w-full py-3 bg-white text-brand-dark font-display text-base rounded-xl border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: getRtlShadow('sm', isRTL) }}
              >
                {t('monthlyCtaBtn')}
              </motion.button>
            </motion.div>

            {/* Yearly Card - Best Value (TEMPORARILY HIDDEN) */}
            {false && <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-brand-dark relative"
              style={{ boxShadow: getRtlShadow('md', isRTL, '#00CEC9') }}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-brand-coral text-white font-display text-sm px-4 py-2 rounded-full border-2 border-brand-dark whitespace-nowrap">
                  🔥 {t('yearlyPlanBadge')}
                </span>
              </div>

              {/* Plan Name */}
              <p className="text-center font-display text-lg text-brand-muted mb-4 mt-4">{t('yearlyPlanName')}</p>

              {/* Price */}
              <div className="text-center mb-6">
                <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-display text-2xl text-brand-muted">$</span>
                  <span className="font-display-black text-5xl sm:text-6xl text-brand-dark">{t('yearlyPrice')}</span>
                </div>
                <p className="font-body text-brand-muted mt-2">{t('yearlyPeriod')}</p>
                <p className="font-body text-sm text-brand-teal mt-1">{t('yearlyMonthly')}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20">
                  <span className="text-xl bg-brand-yellow/30 p-2 rounded-lg border-2 border-brand-dark/10" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>🔍</span>
                  <span className="font-body-medium text-brand-dark text-sm">{t('yearlyFeature1')}</span>
                </div>
                <div className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20">
                  <span className="text-xl bg-brand-coral/20 p-2 rounded-lg border-2 border-brand-dark/10" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>⭐</span>
                  <span className="font-body-medium text-brand-dark text-sm">{t('yearlyFeature2')}</span>
                </div>
                <div className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20">
                  <span className="text-xl bg-brand-teal/20 p-2 rounded-lg border-2 border-brand-dark/10" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>📍</span>
                  <span className="font-body-medium text-brand-dark text-sm">{t('yearlyFeature3')}</span>
                </div>
              </div>

              {/* CTA Button - Highlighted */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/app')}
                className="w-full py-3 bg-brand-coral text-white font-display text-base rounded-xl border-4 border-brand-dark hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: getRtlShadow('sm', isRTL) }}
              >
                {t('yearlyCtaBtn')} 🚀
              </motion.button>
            </motion.div>}
          </div>

          <p className="text-center text-sm text-brand-muted mt-6 font-body">
            {t('pricingDisclaimer')}
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
              {t('faqTitle')}
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
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark"
              style={{ boxShadow: getRtlShadow('md', isRTL, '#FFD93D'), textAlign: isRTL ? 'right' : 'left' }}
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                {t('faq1Question')}
              </p>
              <p className="font-body text-brand-muted">
                {t('faq1Answer')}
              </p>
            </motion.div>

            {/* FAQ 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark"
              style={{ boxShadow: getRtlShadow('sm', isRTL, '#00CEC9'), textAlign: isRTL ? 'right' : 'left' }}
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                {t('faq2Question')}
              </p>
              <p className="font-body text-brand-muted">
                {t('faq2Answer')}
              </p>
            </motion.div>

            {/* FAQ 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark"
              style={{ boxShadow: getRtlShadow('md', isRTL, '#FF6B6B'), textAlign: isRTL ? 'right' : 'left' }}
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                {t('faq3Question')}
              </p>
              <p className="font-body text-brand-muted">
                {t('faq3Answer')}
              </p>
            </motion.div>

            {/* FAQ 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark"
              style={{ boxShadow: getRtlShadow('md', isRTL, '#A855F7'), textAlign: isRTL ? 'right' : 'left' }}
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                {t('faq4Question')}
              </p>
              <p className="font-body text-brand-muted">
                {t('faq4Answer')}
              </p>
            </motion.div>

            {/* FAQ 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border-4 border-brand-dark"
              style={{ boxShadow: getRtlShadow('md', isRTL, '#00B894'), textAlign: isRTL ? 'right' : 'left' }}
            >
              <p className="font-display text-lg sm:text-xl text-brand-dark mb-3">
                {t('faq5Question')}
              </p>
              <p className="font-body text-brand-muted">
                {t('faq5Answer')}
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
            className="bg-brand-teal rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 border-4 border-brand-dark text-center"
            style={{ boxShadow: getRtlShadow('lg', isRTL, '#FF6B6B') }}
          >
            <h2 className="font-display-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-brand-dark mb-6">
              {t('finalCtaTitle1')}
              {isRTL ? ' ' : <br />}
              {t('finalCtaTitle2')}
            </h2>
            <p className="font-body text-xl text-brand-dark/80 mb-10">
              {t('finalCtaSubtitle')}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app')}
              className="px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-white text-brand-dark font-display text-lg sm:text-xl rounded-2xl border-4 border-brand-dark hover:-translate-x-1 hover:-translate-y-1 transition-all"
              style={{ boxShadow: getRtlShadow('lg', isRTL) }}
            >
              {t('finalCtaBtn')} 🍽️
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-12 px-6 z-10">
        <div
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
        >
          <div
            className={`flex items-center gap-3 bg-white rounded-full px-5 py-3 border-2 border-brand-dark ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ boxShadow: getRtlShadow('md', isRTL) }}
          >
            <span className="text-3xl">🍽️</span>
            <span className="font-display text-xl text-brand-dark">{t('brandName')}</span>
          </div>
          <p className="font-body text-brand-dark/70 text-base">
            {t('footerBuiltWith')} ❤️ {' '}
            <a
              href="https://www.osamakhalil.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral hover:underline font-body-medium"
            >
              {t('footerByName')}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
