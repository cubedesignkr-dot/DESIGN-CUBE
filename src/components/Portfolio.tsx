/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Grid, Eye, Calendar, MapPin, Maximize2, User, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { PortfolioItem, ProjectCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioProps {
  portfolioItems: PortfolioItem[];
  initialCategoryFilter?: ProjectCategory | '전체';
}

export default function Portfolio({ portfolioItems, initialCategoryFilter = '전체' }: PortfolioProps) {
  const [filter, setFilter] = useState<ProjectCategory | '전체'>('전체');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  
  // Slide Show States
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('after');
  const [imageIndex, setImageIndex] = useState(0);

  // Sync with initial filter when redirected from somewhere else
  useEffect(() => {
    if (initialCategoryFilter) {
      setFilter(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  // Reset slider state when a new item is selected
  useEffect(() => {
    if (selectedItem) {
      setActiveTab('after');
      setImageIndex(0);
    }
  }, [selectedItem]);

  const categories: (ProjectCategory | '전체')[] = ['전체', '주거공간', '상업공간', '화재 및 누수 복구'];

  const filteredItems = filter === '전체'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === filter);

  // Helper to retrieve images for the active stage
  const getImagesForStage = (item: PortfolioItem, stage: 'before' | 'during' | 'after'): string[] => {
    if (stage === 'before') {
      return item.beforeImages && item.beforeImages.length > 0 ? item.beforeImages : [];
    }
    if (stage === 'during') {
      return item.duringImages && item.duringImages.length > 0 ? item.duringImages : [];
    }
    // after: if afterImages exists, use it. Otherwise fall back to main project image
    const afters = item.afterImages && item.afterImages.length > 0 ? item.afterImages : [];
    if (afters.length === 0 && item.image) {
      return [item.image];
    }
    return afters;
  };

  const activeImages = selectedItem ? getImagesForStage(selectedItem, activeTab) : [];

  const handlePrevImage = () => {
    if (activeImages.length <= 1) return;
    setImageIndex((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (activeImages.length <= 1) return;
    setImageIndex((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="portfolio-section" className="py-24 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-navy-point text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
            PORTFOLIO
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mb-4">
            시간이 흘러도 변치 않는 <span className="font-bold text-navy-point">완벽함</span>
          </h2>
          <p className="text-neutral-500 font-light text-sm leading-relaxed">
            큐브인테리어의 독창적인 디자인 감각과 장인정신이 빚어낸 공간들을 만나보세요. 
            모든 프로젝트는 기능과 미학의 긴밀한 균형을 기반으로 정밀하게 완성되었습니다.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-16 border-b border-neutral-100 pb-6">
          {categories.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                id={`filter-tab-${cat}`}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-none cursor-pointer focus:outline-none border ${
                  isActive
                    ? 'bg-navy-point text-white border-transparent'
                    : 'text-neutral-500 bg-white hover:bg-neutral-50 hover:text-neutral-900 border-neutral-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-neutral-400 font-light"
            >
              이 카테고리에는 등록된 프로젝트가 없습니다.
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item) => (
                <motion.div
                   key={item.id}
                   id={`portfolio-item-${item.id}`}
                   layout
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   transition={{ duration: 0.4 }}
                   onClick={() => setSelectedItem(item)}
                   className="group relative cursor-pointer bg-neutral-50 overflow-hidden border border-neutral-200/50 hover:shadow-2xl transition-all duration-500 rounded-none"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white text-navy-point rounded-none shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-neutral-100">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-6 bg-white">
                    <span className="text-navy-point font-bold text-[10px] tracking-[0.2em] block uppercase mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-navy-point transition-colors line-clamp-1 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-xs text-neutral-400 gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.98, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 30 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white w-full max-w-5xl rounded-none shadow-2xl border border-neutral-200/50 flex flex-col md:flex-row my-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Left Column: Image Viewer with Tabs & Slider */}
                <div className="md:w-[60%] bg-neutral-950 flex flex-col relative">
                  
                  {/* Floating Category Badge */}
                  <span className="absolute top-4 left-4 z-10 bg-navy-point text-white text-[9px] font-bold px-3 py-1.5 tracking-[0.2em] uppercase rounded-none">
                    {selectedItem.category}
                  </span>

                  {/* Main Display Area */}
                  <div className="relative aspect-[4/3] md:flex-1 bg-neutral-950 flex items-center justify-center group overflow-hidden">
                    {activeImages.length > 0 ? (
                      <>
                        <img
                          src={activeImages[imageIndex]}
                          alt={`${selectedItem.title} - ${activeTab} ${imageIndex + 1}`}
                          className="w-full h-full object-cover transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Slide Navigation Overlay */}
                        {activeImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={handlePrevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 duration-300"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 duration-300"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Image Counter Indicator */}
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-[10px] font-mono tracking-wider">
                          {imageIndex + 1} / {activeImages.length}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 space-y-3">
                        <ImageIcon className="w-12 h-12 text-neutral-700 stroke-[1.2]" />
                        <p className="text-xs font-light">등록된 사진이 없습니다.</p>
                      </div>
                    )}
                  </div>

                  {/* Stage Selection Navigation Tabs */}
                  <div className="flex bg-neutral-900 border-t border-neutral-800 text-center">
                    {(['before', 'during', 'after'] as const).map((stage) => {
                      const isActive = activeTab === stage;
                      const count = getImagesForStage(selectedItem, stage).length;
                      
                      let label = '';
                      if (stage === 'before') label = '시공 전 (Before)';
                      else if (stage === 'during') label = '시공 중 (During)';
                      else label = '시공 후 (After)';

                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => {
                            setActiveTab(stage);
                            setImageIndex(0);
                          }}
                          className={`flex-1 py-4 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                            isActive
                              ? 'bg-neutral-800 text-white border-b-2 border-[#C5A880]'
                              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                          }`}
                        >
                          {label}
                          <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-semibold ${isActive ? 'bg-[#C5A880]/20 text-[#C5A880]' : 'bg-neutral-800 text-neutral-500'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Small Thumbnails strip (If multiple images) */}
                  {activeImages.length > 1 && (
                    <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex justify-center space-x-2 overflow-x-auto">
                      {activeImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageIndex(idx)}
                          className={`w-10 h-10 border transition-all duration-300 relative overflow-hidden shrink-0 ${
                            imageIndex === idx
                              ? 'border-[#C5A880] ring-1 ring-[#C5A880]'
                              : 'border-neutral-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                {/* Right Column: Text Details */}
                <div className="md:w-[40%] p-8 md:p-10 flex flex-col justify-between relative bg-white">
                  
                  {/* Close Button */}
                  <button
                    id="btn-close-modal"
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="space-y-6">
                    <div>
                      <span className="text-navy-point font-bold text-[10px] tracking-[0.2em] block uppercase mb-1">
                        PROJECT BRIEF
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-neutral-900 pr-8">
                        {selectedItem.title}
                      </h3>
                    </div>

                    <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-line font-light">
                      {selectedItem.description}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-100 text-xs font-medium">
                      <div className="flex items-center space-x-2 text-neutral-500">
                        <User className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-neutral-400 tracking-wider uppercase">Client</p>
                          <p className="text-neutral-800">{selectedItem.client}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-neutral-500">
                        <Maximize2 className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-neutral-400 tracking-wider uppercase">Area</p>
                          <p className="text-neutral-800">{selectedItem.area}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-neutral-500">
                        <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-neutral-400 tracking-wider uppercase">Year</p>
                          <p className="text-neutral-800">{selectedItem.year}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-neutral-500">
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-neutral-400 tracking-wider uppercase">Location</p>
                          <p className="text-neutral-800">{selectedItem.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-100">
                    <button
                      id="modal-btn-close"
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-3.5 bg-navy-point text-white text-[10px] font-bold uppercase tracking-[0.25em] rounded-none hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
