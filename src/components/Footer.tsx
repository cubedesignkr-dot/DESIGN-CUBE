/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin, Building, Lock, Instagram, BookOpen } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  setView: (view: 'home' | 'portfolio' | 'estimate' | 'admin') => void;
  currentView: 'home' | 'portfolio' | 'estimate' | 'admin';
}

export default function Footer({ settings, setView, currentView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleAdminShortcut = () => {
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-neutral-900 text-neutral-400 py-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Upper Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-neutral-800">
          
          {/* Brand Intro Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="text-white shrink-0">
                <svg className="h-8 w-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 13.6 71 L 13.6 29 L 50 8 L 86.4 29 L 86.4 71 L 50 92 L 24 77 L 24 35 L 50 20 L 76 35 L 76 65 L 50 80 L 34.4 71 L 34.4 41 L 50 32 L 65.6 41 L 65.6 59 L 50 68 L 44.8 65 L 44.8 47 L 50 44 L 55.2 47"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                  />
                </svg>
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="text-sm font-extrabold tracking-[0.18em] text-white uppercase font-sans">
                  DESIGN CUBE
                </span>
                <span className="text-[7.5px] font-bold tracking-[0.38em] text-[#C5A880] uppercase mt-1">
                  INTERIOR & BUILD
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm">
              우리는 공간의 본질적인 아름다움과 그곳에 거주하는 주체의 편의성을 일치시키는 시공 전문가 그룹입니다. 가치 있는 주거, 화재 및 누수 복구 및 상업 파트너로서 최상의 감각을 선물하겠습니다.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {settings.instagramLink && (
                <a
                  href={settings.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-white border border-neutral-800 rounded-none transition-colors flex items-center gap-1.5"
                  title="인스타그램 방문"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="text-[10px] tracking-wider uppercase font-sans">Instagram</span>
                </a>
              )}
              {settings.blogLink && (
                <a
                  href={settings.blogLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-white border border-neutral-800 rounded-none transition-colors flex items-center gap-1.5"
                  title="네이버 블로그 방문"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[10px] tracking-wider uppercase font-sans">Blog</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Menu Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">SITEMAP</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <button
                  onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`hover:text-white transition-colors cursor-pointer focus:outline-none uppercase tracking-wide ${
                    currentView === 'home' ? 'text-white font-bold' : ''
                  }`}
                >
                  회사 소개 / 철학
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setView('portfolio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`hover:text-white transition-colors cursor-pointer focus:outline-none uppercase tracking-wide ${
                    currentView === 'portfolio' ? 'text-white font-bold' : ''
                  }`}
                >
                  포트폴리오 갤러리
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setView('estimate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`hover:text-white transition-colors cursor-pointer focus:outline-none uppercase tracking-wide ${
                    currentView === 'estimate' ? 'text-white font-bold' : ''
                  }`}
                >
                  1:1 온라인 견적 신청
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">CONTACT US</h4>
            <ul className="space-y-3 text-xs font-light leading-relaxed">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                <span className="font-semibold text-neutral-300 hover:text-white transition-colors">{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                <span className="hover:text-white transition-colors">{settings.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>사업자등록번호: {settings.businessNumber}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Column Copyright / CMS Shortcut */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-[11px] text-neutral-600 gap-4">
          <p>© {currentYear} {settings.logoText}. All Rights Reserved. Designed & Crafted with Pride.</p>
          
          <button
            id="footer-admin-shortcut"
            onClick={handleAdminShortcut}
            className="text-neutral-800 hover:text-neutral-600 transition-colors cursor-pointer text-[9px] tracking-wider font-light"
            title="관리자 로그인"
          >
            <span>관리자</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
