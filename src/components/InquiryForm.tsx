/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Send, CheckCircle2, Upload, Trash2, X } from 'lucide-react';
import { Consultation, ProjectCategory } from '../types';
import { motion } from 'motion/react';

interface InquiryFormProps {
  onSubmitInquiry: (inquiry: Omit<Consultation, 'id' | 'date' | 'status'>) => void;
}

export default function InquiryForm({ onSubmitInquiry }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: '주거공간' as ProjectCategory | '기타',
    budget: '5,000만원 ~ 1억원',
    area: '',
    schedule: '',
    content: '',
    agree: false
  });

  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const budgetOptions = [
    '3,000만원 미만',
    '3,000만원 ~ 5,000만원',
    '5,000만원 ~ 1억원',
    '1억원 이상'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(e.target.files);
  };

  const processFiles = (fileList: FileList) => {
    const files = Array.from(fileList);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAttachedImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = '이름을 입력해 주세요.';
    if (!formData.phone.trim()) tempErrors.phone = '연락처를 입력해 주세요.';
    else if (!/^\d{2,4}-\d{3,4}-\d{4}$/.test(formData.phone) && !/^\d{9,11}$/.test(formData.phone)) {
      tempErrors.phone = '올바른 연락처 형식으로 입력해 주세요. (예: 010-2644-6512)';
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = '올바른 이메일 형식을 입력해 주세요.';
    }
    if (!formData.area.trim()) tempErrors.area = '평수 혹은 전용면적을 입력해 주세요.';
    if (!formData.schedule.trim()) tempErrors.schedule = '희망 공사 일정을 입력해 주세요.';
    if (!formData.content.trim()) tempErrors.content = '상세 문의 내용을 작성해 주세요.';
    if (!formData.agree) tempErrors.agree = '개인정보 수집 및 동의에 체크해 주셔야 합니다.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        onSubmitInquiry({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          type: formData.type,
          budget: formData.budget,
          area: formData.area,
          schedule: formData.schedule,
          content: formData.content,
          attachedImages: attachedImages
        });
      } catch (err) {
        console.error("Submission callback error:", err);
      }
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      type: '주거공간',
      budget: '5,000만원 ~ 1억원',
      area: '',
      schedule: '',
      content: '',
      agree: false
    });
    setAttachedImages([]);
    setIsSubmitted(false);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div id="inquiry-success-container" className="py-24 bg-white flex items-center justify-center min-h-[60vh] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6 p-8 border border-neutral-200/50 shadow-2xl rounded-none bg-white"
        >
          <div className="w-16 h-16 bg-neutral-50 text-navy-point border border-neutral-200/50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-light text-neutral-900 tracking-tight">상담 신청 완료</h2>
          <p className="text-sm text-neutral-500 font-light leading-relaxed">
            디자인큐브를 신뢰하고 찾아주셔서 진심으로 감사드립니다.<br />
            등록해주신 연락처(<span className="font-semibold text-neutral-800">{formData.phone}</span>)로 
            영업일 기준 24시간 이내에 담당 디자이너가 전화를 드려 상세 안내를 도와드리겠습니다.
          </p>
          <div className="bg-neutral-50 p-4 border border-neutral-200/40 text-left rounded-none text-xs space-y-2 font-light">
            <div className="flex justify-between">
              <span className="text-neutral-400">신청인</span>
              <span className="font-bold text-neutral-700">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">공간 유형</span>
              <span className="font-bold text-neutral-700">{formData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">희망 예산</span>
              <span className="font-bold text-neutral-700">{formData.budget}</span>
            </div>
          </div>
          <button
            id="btn-inquiry-reset"
            onClick={handleReset}
            className="w-full py-4 bg-navy-point text-white text-xs font-bold tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer rounded-none"
          >
            새로운 견적상담 신청하기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section id="inquiry-section" className="py-24 bg-neutral-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-navy-point text-[11px] font-bold tracking-[0.25em] mb-3">
            온라인 견적상담 신청
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mb-4 font-sans">
            당신의 공간을 함께 기획하세요
          </h2>
          <p className="text-neutral-500 font-light text-sm leading-relaxed">
            공사 예정일, 공간의 면적 및 종류, 예산 범위를 편하게 기입해 주세요.<br />
            오랜 시공 빅데이터를 보유한 컨설턴트가 최적의 무료 1차 가견적 포트폴리오를 구성해 연락드리겠습니다.
          </p>
        </div>

        {/* Multi Column Form Layout */}
        <div className="bg-white border border-neutral-200/50 shadow-2xl rounded-none overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Side Info Panel */}
          <div className="md:col-span-4 bg-navy-point text-white p-8 md:p-10 flex flex-col justify-between space-y-8 rounded-none">
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest text-white border-b border-white/10 pb-3">견적상담 안내사항</h3>
              <ul className="space-y-4 text-xs font-light text-neutral-200/90 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-white mt-2 shrink-0"></span>
                  <span><strong>무료 현장실측</strong>: 유선 가견적 조율 후, 디자이너가 현장으로 파견되어 밀도 높게 실측합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-white mt-2 shrink-0"></span>
                  <span><strong>3D 시뮬레이션</strong>: 정식 도면 계약 진행 시 고정밀 투시도 이미지를 제공합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-white mt-2 shrink-0"></span>
                  <span><strong>A/S 책임보증</strong>: 시공 완료 후 1년간 무상 A/S를 제공하며, 책임 있는 사후관리로 고객의 만족을 이어갑니다.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actual Form Fields */}
          <form id="consultation-form" onSubmit={handleSubmit} className="md:col-span-8 p-8 md:p-10 space-y-6">
            
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-700 tracking-wider">
                  고객명 / 기업명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 홍길동"
                  className={`w-full px-4 py-3 bg-neutral-50 border text-sm rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white ${
                    errors.name ? 'border-red-400' : 'border-neutral-200'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-[11px] font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-700 tracking-wider">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="input-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="예: 010-1234-5678"
                  className={`w-full px-4 py-3 bg-neutral-50 border text-sm rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white ${
                    errors.phone ? 'border-red-400' : 'border-neutral-200'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-[11px] font-medium">{errors.phone}</p>}
              </div>
            </div>

            {/* Row 2: Email & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-700 tracking-wider">이메일 주소</label>
                <input
                  type="email"
                  id="input-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="예: info@cube.co.kr"
                  className={`w-full px-4 py-3 bg-neutral-50 border text-sm border-neutral-200 rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white ${
                    errors.email ? 'border-red-400' : ''
                  }`}
                />
                {errors.email && <p className="text-red-500 text-[11px] font-medium">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-700 tracking-wider">공간 유형 <span className="text-red-500">*</span></label>
                <select
                  id="select-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ProjectCategory | '기타' })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white cursor-pointer"
                >
                  <option value="주거공간">주거공간 (아파트, 빌라, 단독주택 등)</option>
                  <option value="상업공간">상업공간 (오피스, 매장, 식음료점 등)</option>
                  <option value="화재 및 누수 복구">화재 및 누수 복구 (화재 복구, 침수 보수 및 방수 공사 등)</option>
                  <option value="기타">기타 공간</option>
                </select>
              </div>
            </div>

            {/* Row 3: Budget & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-700 tracking-wider">희망 예산 범위 <span className="text-red-500">*</span></label>
                <select
                  id="select-budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white cursor-pointer"
                >
                  {budgetOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-700 tracking-wider">
                  시공 평수 및 면적 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="예: 34평형 / 84㎡"
                  className={`w-full px-4 py-3 bg-neutral-50 border text-sm rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white ${
                    errors.area ? 'border-red-400' : 'border-neutral-200'
                  }`}
                />
                {errors.area && <p className="text-red-500 text-[11px] font-medium">{errors.area}</p>}
              </div>
            </div>

            {/* Row 4: Expected Timeline */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-700 tracking-wider">
                희망 공사 일정 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="input-schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="예: 2026년 9월 중순 입주 예정"
                className={`w-full px-4 py-3 bg-neutral-50 border text-sm rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white ${
                  errors.schedule ? 'border-red-400' : 'border-neutral-200'
                }`}
              />
              {errors.schedule && <p className="text-red-500 text-[11px] font-medium">{errors.schedule}</p>}
            </div>

            {/* Row 5: Detailed Request */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-700 tracking-wider">
                상세 상담 및 문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="input-content"
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="예: 거실 천장 우물 시공 및 주방 11자 아일랜드 변경 희망. 전체 마감재는 베이지 포셀린 타일과 화이트 필름 마감을 선호합니다."
                className={`w-full px-4 py-3 bg-neutral-50 border text-sm rounded-none transition-all duration-300 focus:outline-none focus:border-navy-point focus:bg-white resize-y ${
                  errors.content ? 'border-red-400' : 'border-neutral-200'
                }`}
              />
              {errors.content && <p className="text-red-500 text-[11px] font-medium">{errors.content}</p>}
            </div>

            {/* Row 5.5: Photo Upload */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-700 tracking-wider flex items-center justify-between">
                <span>현장 사진 첨부 (선택)</span>
                <span className="text-neutral-400 font-normal tracking-normal text-[10px]">현장 사진을 올리시면 정확한 가견적 상담이 가능합니다.</span>
              </label>
              
              {/* Drag & Drop Zone */}
              <div
                id="image-drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-2 ${
                  isDragOver
                    ? 'border-navy-point bg-neutral-50'
                    : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <Upload className={`w-8 h-8 transition-colors ${isDragOver ? 'text-navy-point' : 'text-neutral-400'}`} />
                <div className="text-xs text-neutral-600">
                  <span className="font-bold text-neutral-800">클릭</span>하거나 이미지를 이곳에 <span className="font-bold text-neutral-800">드래그</span>하세요.
                </div>
                <div className="text-[10px] text-neutral-400 font-light">
                  여러 장의 사진을 동시에 등록할 수 있습니다.
                </div>
              </div>

              {/* Previews Grid */}
              {attachedImages.length > 0 && (
                <div id="image-previews" className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {attachedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square border border-neutral-200 group overflow-hidden">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-neutral-900/80 text-white rounded-full hover:bg-neutral-950 transition-colors opacity-0 group-hover:opacity-100 duration-200"
                        title="사진 삭제"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-[10px] text-white p-1 text-center font-mono truncate">
                        사진 {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Row 6: Agreement Checkbox */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="chk-agree"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded-none text-navy-point focus:ring-0 border-neutral-300 cursor-pointer"
                />
                <label htmlFor="chk-agree" className="ml-2 text-xs text-neutral-500 leading-relaxed cursor-pointer select-none">
                  개인정보 수집 및 상담 제공을 위한 연락 동의 (필수)<br />
                  <span className="text-[10px] text-neutral-400 font-light font-sans">당사는 고객 상담 안내 목적으로만 성명, 연락처 정보를 3년간 수집 및 활용하며 목적 완료 시 영구 파기합니다.</span>
                </label>
              </div>
              {errors.agree && <p className="text-red-500 text-[11px] font-medium">{errors.agree}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                id="btn-submit-inquiry"
                className="w-full py-4 bg-navy-point hover:bg-neutral-800 text-white font-bold text-sm tracking-wider shadow-lg transition-all rounded-none flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>견적상담 신청하기</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
