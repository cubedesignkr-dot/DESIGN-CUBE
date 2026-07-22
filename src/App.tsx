/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteSettings, PortfolioItem, Consultation, ProjectCategory } from './types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_PORTFOLIO,
  DEFAULT_CONSULTATIONS
} from './data/defaultData';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import InquiryForm from './components/InquiryForm';
import AdminCMS from './components/AdminCMS';
import Footer from './components/Footer';

import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // 1. Core States with Durable Local Storage Syncing
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('cube_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          contactPhone: DEFAULT_SETTINGS.contactPhone,
          contactEmail: DEFAULT_SETTINGS.contactEmail,
          address: DEFAULT_SETTINGS.address,
          businessNumber: DEFAULT_SETTINGS.businessNumber,
        };
      } catch (e) {
        console.error('Failed to parse saved settings, falling back to default', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('cube_portfolio');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PortfolioItem[];
        return parsed.map(item => ({
          ...item,
          category: item.category === ('누수복구' as any) ? '화재 및 누수 복구' : item.category
        }));
      } catch (e) {
        console.error('Failed to parse saved portfolio, falling back to default', e);
      }
    }
    return DEFAULT_PORTFOLIO;
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem('cube_consultations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved consultations, falling back to default', e);
      }
    }
    return DEFAULT_CONSULTATIONS;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('cube_admin_auth') === 'true';
  });

  // Navigation states
  const [currentView, setView] = useState<'home' | 'portfolio' | 'estimate' | 'admin'>('home');
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState<ProjectCategory | '전체'>('전체');

  // 2. Real-time Point Color and Font Style Injection
  useEffect(() => {
    // Inject Custom Accent Point Color into CSS property
    document.documentElement.style.setProperty('--point-color', settings.pointColor);
  }, [settings.pointColor]);

  // Derive dynamic inline font-family based on CMS settings
  const getDynamicFontFamily = () => {
    switch (settings.fontFamily) {
      case 'Space Grotesk':
        return '"Space Grotesk", "Noto Sans KR", sans-serif';
      case 'Playfair Display':
        return '"Playfair Display", "Noto Sans KR", serif';
      default:
        return '"Noto Sans KR", system-ui, sans-serif';
    }
  };

  // 3. Database mutation callbacks
  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    localStorage.setItem('cube_settings', JSON.stringify(newSettings));
  };

  const handleUpdatePortfolio = (newPortfolio: PortfolioItem[]) => {
    setPortfolio(newPortfolio);
    localStorage.setItem('cube_portfolio', JSON.stringify(newPortfolio));
  };

  const handleUpdateConsultations = (newConsultations: Consultation[]) => {
    setConsultations(newConsultations);
    localStorage.setItem('cube_consultations', JSON.stringify(newConsultations));
  };

  const handleSubmitInquiry = (newInquiry: Omit<Consultation, 'id' | 'date' | 'status'>) => {
    const freshInquiry: Consultation = {
      id: 'c_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: '대기중',
      ...newInquiry
    };
    const updated = [freshInquiry, ...consultations];
    setConsultations(updated);
    
    try {
      localStorage.setItem('cube_consultations', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded! Stripping large base64 attachments for local storage persistence.", e);
      // Strip base64 image strings to stay under the 5MB localStorage limit
      const sanitized = updated.map(c => ({
        ...c,
        attachedImages: c.attachedImages ? c.attachedImages.map((_, i) => `(현장사진 첨부됨_${i + 1})`) : []
      }));
      try {
        localStorage.setItem('cube_consultations', JSON.stringify(sanitized));
      } catch (err) {
        console.error("Failed to write to localStorage even after sanitizing:", err);
      }
    }

    // Formspree API submission to gather real website lead data
    fetch("https://formspree.io/f/xaqrdwrp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        subject: `[디자인큐브] ${newInquiry.name}님의 견적상담 신청`,
        name: newInquiry.name,
        phone: newInquiry.phone,
        email: newInquiry.email || '미기입',
        type: newInquiry.type,
        budget: newInquiry.budget,
        area: newInquiry.area,
        schedule: newInquiry.schedule,
        content: newInquiry.content,
        attachedImagesCount: newInquiry.attachedImages?.length || 0,
        _message: `새로운 견적상담이 접수되었습니다.

고객명/기업명: ${newInquiry.name}
연락처: ${newInquiry.phone}
이메일: ${newInquiry.email || '미기입'}
공간 유형: ${newInquiry.type}
희망 예산 범위: ${newInquiry.budget}
시공 평수 및 면적: ${newInquiry.area}
희망 공사 일정: ${newInquiry.schedule}

상세 상담 및 문의 내용:
${newInquiry.content}

첨부된 현장 사진 개수: ${newInquiry.attachedImages?.length || 0}개 (웹사이트 관리자 페이지에서 상세 사진을 확인할 수 있습니다.)`
      })
    })
    .then(response => {
      if (response.ok) {
        console.log("Formspree submission succeeded.");
      } else {
        console.error("Formspree submission failed:", response.statusText);
      }
    })
    .catch(error => {
      console.error("Error submitting to Formspree:", error);
    });
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('cube_admin_auth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('cube_admin_auth');
    setView('home');
  };

  // Switch to portfolio with a specific category pre-selected
  const handleNavigateToPortfolioCategory = (category?: '주거공간' | '상업공간' | '화재 및 누수 복구' | '전체') => {
    setPortfolioCategoryFilter(category || '전체');
    setView('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{ fontFamily: getDynamicFontFamily() }}
      className="min-h-screen flex flex-col justify-between transition-all duration-300 antialiased selection:bg-neutral-900 selection:text-white"
    >
      {/* Top Header Navigation */}
      <Navbar
        settings={settings}
        currentView={currentView}
        setView={(view) => {
          setView(view);
          // Default filter back to all when navbar links clicked
          if (view === 'portfolio') {
            setPortfolioCategoryFilter('전체');
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleAdminLogout}
      />

      {/* Main Orchestrator Canvas */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* VIEW 1: HOME */}
            {currentView === 'home' && (
              <div id="view-home">
                {/* Hero Stage */}
                <Hero
                  settings={settings}
                  onNavigateToEstimate={() => {
                    setView('estimate');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onNavigateToPortfolio={() => handleNavigateToPortfolioCategory('전체')}
                />
                
                {/* About us Pillar */}
                <About settings={settings} />
                
                {/* Services Bento Grid */}
                <Services onNavigateToPortfolio={handleNavigateToPortfolioCategory} />
                
                {/* Inline Fast Consulting Form */}
                <InquiryForm onSubmitInquiry={handleSubmitInquiry} />
              </div>
            )}

            {/* VIEW 2: PORTFOLIO */}
            {currentView === 'portfolio' && (
              <div id="view-portfolio">
                <Portfolio
                  portfolioItems={portfolio}
                  initialCategoryFilter={portfolioCategoryFilter}
                />
              </div>
            )}

            {/* VIEW 3: ONLINE ESTIMATE CONSULTATION */}
            {currentView === 'estimate' && (
              <div id="view-estimate">
                <InquiryForm onSubmitInquiry={handleSubmitInquiry} />
              </div>
            )}

            {/* VIEW 4: ADMIN CMS PANEL */}
            {currentView === 'admin' && (
              <div id="view-admin">
                <AdminCMS
                  settings={settings}
                  portfolioItems={portfolio}
                  consultations={consultations}
                  onUpdateSettings={handleUpdateSettings}
                  onUpdatePortfolio={handleUpdatePortfolio}
                  onUpdateConsultations={handleUpdateConsultations}
                  isAdminLoggedIn={isAdminLoggedIn}
                  onLogin={handleAdminLogin}
                  onLogout={handleAdminLogout}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding, Sitemap, and shortcuts */}
      <Footer
        settings={settings}
        setView={(view) => {
          setView(view);
          if (view === 'portfolio') {
            setPortfolioCategoryFilter('전체');
          }
        }}
        currentView={currentView}
      />

      {/* KakaoTalk Floating Consultation Button */}
      {settings.kakaoLink && currentView !== 'admin' && (
        <a
          href={settings.kakaoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/95 px-4 py-3 rounded-full shadow-2xl hover:shadow-neutral-400/50 transition-all duration-300 hover:-translate-y-1 group"
          title="카카오톡 1:1 상담하기"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold tracking-tight">카톡 문의</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </a>
      )}
    </div>
  );
}
