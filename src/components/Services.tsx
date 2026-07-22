/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Landmark, Droplets, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  onNavigateToPortfolio: (category?: '주거공간' | '상업공간' | '화재 및 누수 복구') => void;
}

export default function Services({ onNavigateToPortfolio }: ServicesProps) {
  const serviceList = [
    {
      id: 'residential',
      category: '주거공간' as const,
      title: 'Residential Design',
      subTitle: '주거 공간 리모델링',
      description: '아파트, 주상복합, 단독주택을 위한 맞춤형 주거 솔루션입니다. 생활 동선을 고려한 구조 변경, 정밀 시스템 조명, 에너지 효율을 높이는 고단열 마감을 결합해 안락하고 실용적인 가치를 선사합니다.',
      icon: Home,
      tags: ['아파트 리모델링', '주택 단열/보강', '수납 극대화 설계', '친환경 원목 마감']
    },
    {
      id: 'leakage',
      category: '화재 및 누수 복구' as const,
      title: 'Fire & Leakage Restoration',
      subTitle: '화재 및 누수 복구 리모델링',
      description: '갑작스러운 화재나 배관 누수, 침수 피해를 겪으신 공간을 위해 고장 진단부터 완벽한 탄화물 제거, 방습·단열 공사, 도배 및 목공 마감 복구까지 원스톱으로 완벽하게 수리하고 세련된 인테리어로 재탄생시킵니다.',
      icon: Droplets,
      tags: ['화재 그을음 청소', '첨단 누수 진단', '방습/결로 보강', '원스톱 부분 리폼']
    },
    {
      id: 'commercial',
      category: '상업공간' as const,
      title: 'Commercial Space',
      subTitle: '상업공간 리모델링',
      description: '사무실, 컨셉형 카페, 식음료 매장, 브랜드 쇼룸 전문 시공. 기업의 정체성을 공간 레이아웃에 충실히 반영하여 방문 고객의 경험 가치와 직원의 작업 생산성을 극대화하는 인프라를 구축합니다.',
      icon: Landmark,
      tags: ['스마트 오피스', '감성 카페/F&B', '외관 파사드 연출', '상가 소방/안전설비']
    }
  ];

  return (
    <section id="services-section" className="py-24 bg-neutral-50 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <div className="text-navy-point text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
              WHAT WE DO
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight">
              디자인큐브의 <span className="font-bold text-navy-point">공간</span> 서비스
            </h2>
          </div>
          <p className="max-w-md text-neutral-500 font-light text-sm leading-relaxed">
            주거 공간의 안락함부터 상업 공간의 전략적 인프라, 세심한 가구 컨설팅까지 공간에 관한 전방위 솔루션을 수행합니다.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                id={`service-card-${service.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white border border-neutral-200/50 p-8 rounded-none hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Icon with sharp border */}
                  <div className="w-12 h-12 rounded-none bg-neutral-50 border border-neutral-200/40 flex items-center justify-center text-navy-point mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 block uppercase mb-1">
                    {service.title}
                  </span>
                  
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {service.subTitle}
                  </h3>

                  <p className="text-neutral-500 text-sm font-light leading-relaxed mb-8">
                    {service.description}
                  </p>

                  {/* Tags with sharp border */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-neutral-500 bg-neutral-50 px-2.5 py-1 border border-neutral-100 rounded-none font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore button - High end text line style */}
                <button
                  id={`btn-service-link-${service.id}`}
                  onClick={() => onNavigateToPortfolio(service.category)}
                  className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-widest text-navy-point hover:text-neutral-950 transition-colors cursor-pointer w-fit uppercase border-b border-navy-point/40 pb-0.5 hover:border-neutral-950"
                >
                  <span>{service.category} VIEW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
