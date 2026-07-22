/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  settings: SiteSettings;
  onNavigateToEstimate: () => void;
  onNavigateToPortfolio: () => void;
}

export default function Hero({ settings, onNavigateToEstimate, onNavigateToPortfolio }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = settings.heroImages && settings.heroImages.length > 0 
    ? settings.heroImages 
    : ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80'];

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section id="hero-section" className="relative w-full h-[85vh] overflow-hidden bg-black">
      {/* Background Images with Fade Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt={`Cube Interior Space ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Subtle luxurious ambient dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-center h-full z-10 text-white">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center space-x-3 mb-6"
          >
            <span className="h-[1px] w-12 bg-white/40"></span>
            <span className="text-xs font-bold tracking-[0.3em] text-white/60 uppercase">
              DESIGN STUDIO
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight leading-[1.15] mb-6 whitespace-pre-line"
          >
            {settings.mainTitle.includes('본질') ? (
              <>
                {settings.mainTitle.split('본질')[0]}
                <span className="font-bold text-white">본질</span>
                {settings.mainTitle.split('본질')[1]}
              </>
            ) : (
              settings.mainTitle
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base md:text-lg text-neutral-300 font-light leading-relaxed mb-10 whitespace-pre-line max-w-md"
          >
            {settings.mainSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5"
          >
            <button
              id="hero-btn-estimate"
              onClick={onNavigateToEstimate}
              className="bg-white text-neutral-950 font-bold text-xs tracking-widest uppercase px-10 py-4 hover:bg-neutral-100 transition-all flex items-center justify-center space-x-3 group cursor-pointer"
            >
              <span>견적 상담</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              id="hero-btn-portfolio"
              onClick={onNavigateToPortfolio}
              className="border border-white/30 hover:border-white text-white font-bold text-xs tracking-widest uppercase px-10 py-4 hover:bg-white/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>포트폴리오</span>
            </button>
          </motion.div>
        </div>
      </div>



      {/* Slider Controls */}
      <div className="absolute bottom-10 right-6 md:right-12 lg:right-56 z-20 flex items-center space-x-4">
        {/* Indicators */}
        <div className="hidden sm:flex items-center space-x-2 mr-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center space-x-2">
          <button
            id="hero-btn-prev"
            onClick={handlePrev}
            className="p-3 border border-white/20 bg-black/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            aria-label="이전 이미지"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="hero-btn-next"
            onClick={handleNext}
            className="p-3 border border-white/20 bg-black/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            aria-label="다음 이미지"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Current Slide Number / Total Count */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 text-white/60 font-mono text-xs tracking-[0.2em]">
        <span className="text-white font-semibold">0{currentIndex + 1}</span> / 0{images.length}
      </div>
    </section>
  );
}
