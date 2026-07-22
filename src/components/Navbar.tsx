/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, Menu, X, ShieldAlert } from 'lucide-react';
import { SiteSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  settings: SiteSettings;
  currentView: 'home' | 'portfolio' | 'estimate' | 'admin';
  setView: (view: 'home' | 'portfolio' | 'estimate' | 'admin') => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({
  settings,
  currentView,
  setView,
  isAdminLoggedIn,
  onLogout,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: '회사 소개' },
    { id: 'portfolio', label: '포트폴리오' },
    { id: 'estimate', label: '견적 상담' },
  ] as const;

  const handleNavClick = (view: 'home' | 'portfolio' | 'estimate' | 'admin') => {
    setView(view);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Premium Hexagon Logo & Brand Typography */}
        <button
          id="nav-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 text-left cursor-pointer group focus:outline-none"
        >
          {/* Hexagon Outline Vector */}
          <div className="text-neutral-950 transition-transform duration-500 group-hover:scale-105 shrink-0">
            <svg className="h-9 w-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 13.6 71 L 13.6 29 L 50 8 L 86.4 29 L 86.4 71 L 50 92 L 24 77 L 24 35 L 50 20 L 76 35 L 76 65 L 50 80 L 34.4 71 L 34.4 41 L 50 32 L 65.6 41 L 65.6 59 L 50 68 L 44.8 65 L 44.8 47 L 50 44 L 55.2 47"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            </svg>
          </div>
          {/* Logo brand text stacked */}
          <div className="flex flex-col justify-center leading-none">
            <span className="text-sm font-extrabold tracking-[0.18em] text-neutral-900 uppercase font-sans">
              DESIGN CUBE
            </span>
            <span className="text-[7.5px] font-bold tracking-[0.38em] text-[#C5A880] uppercase mt-1">
              INTERIOR & BUILD
            </span>
          </div>
        </button>

        {/* Desktop Navigation with high-end editorial uppercase tracking-widest */}
        <div className="hidden md:flex items-center space-x-10">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-semibold uppercase tracking-[0.2em] relative py-2 transition-colors cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-navy-point'
                    : 'text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-navy-point"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Link / Status in Artistic Flair style (green dot / ADMIN MODE) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAdminLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 pl-4 border-l border-neutral-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">ADMIN MODE</span>
              </div>
              <button
                id="btn-admin-panel"
                onClick={() => handleNavClick('admin')}
                className={`p-2 rounded-sm transition-all focus:outline-none ${
                  currentView === 'admin'
                    ? 'bg-neutral-100 text-navy-point'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
                title="관리자 대시보드"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
              <button
                id="btn-logout"
                onClick={onLogout}
                className="text-[10px] font-bold tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer uppercase"
              >
                LOGOUT
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center space-x-2">
          {isAdminLoggedIn && (
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" title="관리자 로그인 상태"></span>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white border-b border-neutral-100 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4 flex flex-col">
              {menuItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left py-2 font-medium tracking-wide text-base border-b border-neutral-50 transition-colors ${
                      isActive ? 'text-navy-point font-bold' : 'text-neutral-600'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {isAdminLoggedIn && (
                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center justify-between py-2 text-base font-semibold border-b border-neutral-50 ${
                    currentView === 'admin' ? 'text-navy-point' : 'text-neutral-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    관리자 대시보드 (CMS)
                  </span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    로그인됨
                  </span>
                </button>
              )}

              {isAdminLoggedIn && (
                <button
                  id="mobile-nav-logout"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="text-left py-2 text-sm text-red-500 font-medium"
                >
                  관리자 로그아웃
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
