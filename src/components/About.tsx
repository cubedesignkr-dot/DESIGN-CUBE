/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale, Compass, ShieldCheck, MessageSquare } from 'lucide-react';
import { SiteSettings } from '../types';
import { motion } from 'motion/react';

interface AboutProps {
  settings: SiteSettings;
}

export default function About({ settings }: AboutProps) {
  return (
    <section id="about-section" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Premium Images Collage */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[3/4] w-full max-w-sm mx-auto bg-neutral-100 overflow-hidden shadow-2xl rounded-sm"
            >
              <img
                src={settings.aboutImage || settings.heroImages[2] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"}
                alt="About Design Cube"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-navy-point/5 mix-blend-multiply" />
            </motion.div>
          </div>

          {/* Right Column: Dynamic Text and Pillars */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 text-navy-point text-xs font-bold tracking-[0.25em] uppercase">
                <span>WHY DESIGN CUBE</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight leading-snug">
                {settings.aboutTitle.includes('공간') ? (
                  <>
                    {settings.aboutTitle.split('공간')[0]}
                    <span className="font-bold text-navy-point">공간</span>
                    {settings.aboutTitle.split('공간')[1]}
                  </>
                ) : (
                  settings.aboutTitle
                )}
              </h2>

              {settings.aboutDescription && (
                <p className="text-neutral-500 font-light text-base leading-relaxed whitespace-pre-line">
                  {settings.aboutDescription}
                </p>
              )}

              {/* Company Core Strengths - 2x2 Grid configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-8 border-t border-neutral-100">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-neutral-50 border border-neutral-200/50 flex items-center justify-center text-navy-point">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 tracking-tight">정직한 견적</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    과도한 마진 거품을 걷어내고 상세한 자재 사용 명세서와 물량 산출을 통해 정직하고 합리적인 견적만을 산출해 드립니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-neutral-50 border border-neutral-200/50 flex items-center justify-center text-navy-point">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 tracking-tight">현장 중심 시공</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    도면 설계에만 안주하지 않고, 다년간의 경력을 지닌 현장 소장이 현장에 밀착 상주해 시공 과정 전체를 철저히 감독합니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-neutral-50 border border-neutral-200/50 flex items-center justify-center text-navy-point">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 tracking-tight">책임있는 A/S</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    시공 후 하자 발생 시 법적인 품질보증서 발급은 물론, 신속하고 신뢰할 수 있는 전담 A/S 프로세스를 성실히 가동합니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-neutral-50 border border-neutral-200/50 flex items-center justify-center text-navy-point">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 tracking-tight">투명한 소통</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    고객과의 실시간 전용 채널을 개설하여 일일 작업 진행 상황, 실제 현장 사진을 가감 없이 투명하게 공유하고 소통합니다.
                  </p>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
