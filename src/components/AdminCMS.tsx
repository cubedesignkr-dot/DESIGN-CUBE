/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  FolderOpen,
  MessageSquare,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle,
  Eye,
  Lock,
  FileText,
  User,
  Phone,
  Calendar,
  Layers,
  MapPin,
  FileEdit,
  Upload,
  X,
  Link,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SiteSettings, PortfolioItem, Consultation, ProjectCategory } from '../types';

interface AdminCMSProps {
  settings: SiteSettings;
  portfolioItems: PortfolioItem[];
  consultations: Consultation[];
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdatePortfolio: (items: PortfolioItem[]) => void;
  onUpdateConsultations: (consultations: Consultation[]) => void;
  isAdminLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AdminCMS({
  settings,
  portfolioItems,
  consultations,
  onUpdateSettings,
  onUpdatePortfolio,
  onUpdateConsultations,
  isAdminLoggedIn,
  onLogin,
  onLogout
}: AdminCMSProps) {
  // Authentication State
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('cube_admin_password') || 'cube1234';
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'settings' | 'portfolio' | 'consultations' | 'guide'>('settings');

  // Form Editing States
  const [editedSettings, setEditedSettings] = useState<SiteSettings>({ ...settings });
  
  // Portfolio Editing States
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<Omit<PortfolioItem, 'id'>>({
    title: '',
    category: '주거공간',
    image: '',
    description: '',
    client: '',
    area: '',
    year: '',
    location: '',
    beforeImages: [],
    duringImages: [],
    afterImages: []
  });

  const [stageUrlInputs, setStageUrlInputs] = useState({
    before: '',
    during: '',
    after: ''
  });

  const handleAddUrlToStage = (stage: 'before' | 'during' | 'after') => {
    const url = stageUrlInputs[stage].trim();
    if (!url) return;
    setPortfolioForm(prev => {
      const field = stage === 'before' ? 'beforeImages' : stage === 'during' ? 'duringImages' : 'afterImages';
      const existing = prev[field] || [];
      return {
        ...prev,
        [field]: [...existing, url]
      };
    });
    setStageUrlInputs(prev => ({ ...prev, [stage]: '' }));
  };

  const handleRemoveImageFromStage = (stage: 'before' | 'during' | 'after', index: number) => {
    setPortfolioForm(prev => {
      const field = stage === 'before' ? 'beforeImages' : stage === 'during' ? 'duringImages' : 'afterImages';
      const existing = prev[field] || [];
      return {
        ...prev,
        [field]: existing.filter((_, idx) => idx !== index)
      };
    });
  };

  const processFilesForStage = (fileList: FileList, stage: 'before' | 'during' | 'after') => {
    const files = Array.from(fileList);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result;
          setPortfolioForm(prev => {
            const field = stage === 'before' ? 'beforeImages' : stage === 'during' ? 'duringImages' : 'afterImages';
            const existing = prev[field] || [];
            return {
              ...prev,
              [field]: [...existing, base64]
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Notifications state
  const [successMsg, setSuccessMsg] = useState('');

  // Photo Slider Modal state
  const [activeSliderImages, setActiveSliderImages] = useState<string[] | null>(null);
  const [activeSliderIndex, setActiveSliderIndex] = useState<number>(0);

  // Inline Delete Confirmation States
  const [inquiryDeleteConfirmId, setInquiryDeleteConfirmId] = useState<string | null>(null);
  const [portfolioDeleteConfirmId, setPortfolioDeleteConfirmId] = useState<string | null>(null);

  const triggerSuccessNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  // Auth Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === adminPassword) {
      onLogin();
      setLoginError('');
      setPasscode('');
      triggerSuccessNotification('관리자 대시보드에 로그인하였습니다.');
    } else {
      setLoginError(`비밀번호가 올바르지 않습니다. (현재 비밀번호: ${adminPassword === 'cube1234' ? 'cube1234' : '설정된 사용자 비밀번호'})`);
    }
  };

  // Password change handler
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPassword.trim();
    if (!trimmed) {
      setPasswordError('새로운 비밀번호를 입력해 주세요.');
      return;
    }
    if (trimmed !== confirmPassword.trim()) {
      setPasswordError('입력하신 비밀번호가 서로 일치하지 않습니다.');
      return;
    }
    
    setAdminPassword(trimmed);
    localStorage.setItem('cube_admin_password', trimmed);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    triggerSuccessNotification('관리자 비밀번호가 안전하게 재설정되었습니다.');
  };

  // Handle forgot password request
  const handleForgotPassword = () => {
    const defaultMaster = 'cube1234';
    setAdminPassword(defaultMaster);
    localStorage.setItem('cube_admin_password', defaultMaster);
    setResetSuccessMsg('비밀번호가 마스터 비밀번호로 즉시 재설정되었습니다.');
    triggerSuccessNotification('마스터 비밀번호로 재설정되었습니다.');
  };

  // Settings Handlers
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(editedSettings);
    triggerSuccessNotification('사이트 환경 설정이 실시간으로 적용 및 저장되었습니다.');
  };

  const handleResetSettings = () => {
    if (window.confirm('사이트 설정을 마지막으로 저장된 상태로 되돌리시겠습니까?')) {
      setEditedSettings({ ...settings });
    }
  };

  const handleHeroImageChange = (index: number, value: string) => {
    const updatedImages = [...editedSettings.heroImages];
    updatedImages[index] = value;
    setEditedSettings({ ...editedSettings, heroImages: updatedImages });
  };

  const handleHeroImageUpload = (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleHeroImageChange(index, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAboutImageUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditedSettings({ ...editedSettings, aboutImage: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // Portfolio Handlers
  const openAddPortfolio = () => {
    setPortfolioForm({
      title: '',
      category: '주거공간',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      description: '',
      client: '신규 고객님',
      area: '99㎡ (30평형)',
      year: '2026',
      location: '서울시 강남구',
      beforeImages: [],
      duringImages: [],
      afterImages: []
    });
    setEditingPortfolioId(null);
    setIsAddingPortfolio(true);
  };

  const openEditPortfolio = (item: PortfolioItem) => {
    setPortfolioForm({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description,
      client: item.client,
      area: item.area,
      year: item.year,
      location: item.location,
      beforeImages: item.beforeImages || [],
      duringImages: item.duringImages || [],
      afterImages: item.afterImages || []
    });
    setEditingPortfolioId(item.id);
    setIsAddingPortfolio(true);
  };

  const handlePortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImage = portfolioForm.image;
    if (!finalImage && portfolioForm.afterImages && portfolioForm.afterImages.length > 0) {
      finalImage = portfolioForm.afterImages[0];
    }

    if (!portfolioForm.title || !finalImage || !portfolioForm.description) {
      alert('필수 값(제목, 대표 이미지 혹은 시공 후 사진, 설명)을 모두 입력해 주세요.');
      return;
    }

    const formToSubmit = {
      ...portfolioForm,
      image: finalImage
    };

    if (editingPortfolioId) {
      // Edit mode
      const updatedList = portfolioItems.map(item => 
        item.id === editingPortfolioId 
          ? { ...item, ...formToSubmit } 
          : item
      );
      onUpdatePortfolio(updatedList);
      triggerSuccessNotification('포트폴리오 게시글이 성공적으로 수정되었습니다.');
    } else {
      // Create mode
      const newItem: PortfolioItem = {
        id: 'p_' + Date.now(),
        ...formToSubmit
      };
      onUpdatePortfolio([newItem, ...portfolioItems]);
      triggerSuccessNotification('신규 포트폴리오 프로젝트가 발행되었습니다.');
    }

    setIsAddingPortfolio(false);
    setEditingPortfolioId(null);
  };

  const handlePortfolioDelete = (id: string, title: string) => {
    if (window.confirm(`[${title}] 포트폴리오를 영구 삭제하시겠습니까?`)) {
      const updatedList = portfolioItems.filter(item => item.id !== id);
      onUpdatePortfolio(updatedList);
      triggerSuccessNotification('포트폴리오가 정상적으로 삭제되었습니다.');
    }
  };

  // Consultations Handlers
  const handleInquiryStatusChange = (id: string, newStatus: '대기중' | '상담진행중' | '완료') => {
    const updated = consultations.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    );
    onUpdateConsultations(updated);
    triggerSuccessNotification('상담 처리 상태가 업데이트되었습니다.');
  };

  const handleInquiryMemoSave = (id: string, memo: string) => {
    const updated = consultations.map(c => 
      c.id === id ? { ...c, adminMemo: memo } : c
    );
    onUpdateConsultations(updated);
    triggerSuccessNotification('상담 메모가 저장되었습니다.');
  };

  const handleInquiryDelete = (id: string, name: string) => {
    if (window.confirm(`[${name}] 고객님의 상담 문의 내역을 데이터베이스에서 완전히 삭제하시겠습니까?`)) {
      const updated = consultations.filter(c => c.id !== id);
      onUpdateConsultations(updated);
      triggerSuccessNotification('상담 내역이 안전하게 삭제되었습니다.');
    }
  };

  // Render Login state if not authenticated
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-screen" className="py-24 bg-neutral-100 flex items-center justify-center min-h-[75vh] px-6">
        <div className="max-w-md w-full bg-white border border-neutral-250 p-10 shadow-xl rounded-none space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-navy-point/10 text-navy-point rounded-none flex items-center justify-center mx-auto mb-2 border border-navy-point/20">
              <Lock className="w-5 h-5 text-navy-point" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-[0.2em]">CUBE CMS LOGIN</h2>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-light">Administrative Console Panel</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {resetSuccessMsg && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs leading-relaxed space-y-1">
                <p className="font-semibold">{resetSuccessMsg}</p>
                <p className="text-[10px] text-blue-600 font-light">※ 즉시 마스터 비밀번호로 로그인하실 수 있습니다.</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ACCESS PASSWORD</label>
              <input
                type="password"
                id="admin-passcode"
                placeholder="비밀번호를 입력해 주세요."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-none text-xs tracking-wide focus:outline-none focus:border-navy-point focus:bg-white"
              />
              {loginError && <p className="text-red-500 text-xs font-medium">{loginError}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] text-neutral-400 hover:text-navy-point underline transition-all focus:outline-none cursor-pointer font-light"
              >
                비밀번호를 잃어버렸습니까?
              </button>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              className="w-full py-3.5 bg-navy-point hover:bg-neutral-800 text-white font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-300 rounded-none cursor-pointer"
            >
              SIGN IN
            </button>
          </form>


        </div>
      </div>
    );
  }

  return (
    <section id="admin-cms-dashboard" className="py-12 bg-neutral-50 min-h-[85vh] text-neutral-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-200 pb-6 mb-8 gap-4">
          <div>
            <div className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase mb-1">
              ADMINISTRATION CMS
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <span>디자인큐브 콘텐츠 총괄 제어반</span>
              <span className="text-[9px] px-2 py-0.5 bg-green-100 text-green-700 rounded-none font-bold tracking-widest uppercase">LIVE</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-[11px] text-neutral-500">
              SESSION: <strong className="text-neutral-800 uppercase tracking-wider font-semibold">Super Admin</strong>
            </span>
            <button
              id="cms-btn-logout"
              onClick={onLogout}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-800 hover:text-white text-neutral-700 text-[10px] font-bold tracking-widest uppercase rounded-none cursor-pointer transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-xs font-semibold rounded-none flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column Navigation Rails */}
          <div className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-none border transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-navy-point text-white border-transparent'
                  : 'bg-white text-neutral-600 hover:bg-neutral-150 hover:text-neutral-900 border-neutral-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>사이트 기본 설정</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-none border transition-all cursor-pointer text-left ${
                activeTab === 'portfolio'
                  ? 'bg-navy-point text-white border-transparent'
                  : 'bg-white text-neutral-600 hover:bg-neutral-150 hover:text-neutral-900 border-neutral-200'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>포트폴리오 관리 ({portfolioItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('consultations')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-none border transition-all cursor-pointer text-left ${
                activeTab === 'consultations'
                  ? 'bg-navy-point text-white border-transparent'
                  : 'bg-white text-neutral-600 hover:bg-neutral-150 hover:text-neutral-900 border-neutral-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>실시간 상담 현황 ({consultations.length})</span>
              {consultations.filter(c => c.status === '대기중').length > 0 && (
                <span className="ml-auto w-2 h-2 bg-red-500"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-none border transition-all cursor-pointer text-left ${
                activeTab === 'guide'
                  ? 'bg-navy-point text-white border-transparent'
                  : 'bg-white text-neutral-600 hover:bg-neutral-150 hover:text-neutral-900 border-neutral-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>CMS 자가 가이드라인</span>
            </button>
          </div>

          {/* Right Column Content Panel */}
          <div className="lg:col-span-9 bg-white border border-neutral-200 p-6 md:p-8 rounded-none min-h-[500px]">
            
            {/* SUBTAB 1: SITE SETTINGS CUSTOMIZER */}
            {activeTab === 'settings' && (
              <>
                <form onSubmit={handleSettingsSave} className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-navy-point" />
                    <span>실시간 웹사이트 정보 및 스타일 커스터마이징</span>
                  </h2>
                  <p className="text-xs text-neutral-400 font-light">텍스트 및 테마 컬러를 변경하면 메인 사이트 및 레이아웃에 실시간으로 즉각 적용됩니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Logo Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600">브랜드 로고 타이틀 (상단)</label>
                    <input
                      type="text"
                      id="cms-logo-text"
                      value={editedSettings.logoText}
                      onChange={(e) => setEditedSettings({ ...editedSettings, logoText: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                    />
                  </div>

                  {/* Font Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600">대표 한글 서체 기조</label>
                    <select
                      id="cms-font"
                      value={editedSettings.fontFamily}
                      onChange={(e) => setEditedSettings({ ...editedSettings, fontFamily: e.target.value as any })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point cursor-pointer"
                    >
                      <option value="Pretendard">Pretendard (가장 모던하고 가독성이 뛰어난 한국어 산세리프)</option>
                      <option value="Space Grotesk">Space Grotesk (고급 영문 매치 및 테크 포워드 스타일)</option>
                      <option value="Playfair Display">Playfair Display (우아하고 깊이 있는 유럽형 클래식 세리프)</option>
                    </select>
                  </div>
                </div>

                {/* Theme Color Selector */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <label className="text-xs font-bold text-neutral-600 block">브랜드 시그니처 테마 컬러 (포인트 컬라)</label>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Presets */}
                    {[
                      { hex: '#001F3F', label: 'Classic Navy' },
                      { hex: '#1E293B', label: 'Slate Gray' },
                      { hex: '#064E3B', label: 'Dark Forest' },
                      { hex: '#78350F', label: 'Amber Bronze' },
                      { hex: '#991B1B', label: 'Deep Crimson' },
                    ].map((col) => (
                      <button
                        type="button"
                        key={col.hex}
                        onClick={() => setEditedSettings({ ...editedSettings, pointColor: col.hex })}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                          editedSettings.pointColor === col.hex
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: col.hex }} />
                        <span>{col.label}</span>
                      </button>
                    ))}

                    {/* Custom Hex Selector */}
                    <div className="flex items-center space-x-2 pl-2 border-l border-neutral-200">
                      <input
                        type="color"
                        id="cms-color-picker"
                        value={editedSettings.pointColor}
                        onChange={(e) => setEditedSettings({ ...editedSettings, pointColor: e.target.value })}
                        className="w-8 h-8 rounded-sm cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        id="cms-color-hex"
                        value={editedSettings.pointColor}
                        onChange={(e) => setEditedSettings({ ...editedSettings, pointColor: e.target.value })}
                        placeholder="#001F3F"
                        className="w-20 px-2 py-1 text-xs border border-neutral-200 bg-neutral-50 font-mono focus:ring-1 focus:ring-navy-point text-center uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section Banner Texts */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider">메인 화면 히어로 텍스트 관리</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-500">메인 대표 카피 (줄바꿈 가능)</label>
                      <textarea
                        id="cms-main-title"
                        rows={2}
                        value={editedSettings.mainTitle}
                        onChange={(e) => setEditedSettings({ ...editedSettings, mainTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-500">메인 보조 설명 카피</label>
                      <textarea
                        id="cms-main-subtitle"
                        rows={3}
                        value={editedSettings.mainSubtitle}
                        onChange={(e) => setEditedSettings({ ...editedSettings, mainSubtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Story / Intro */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider">회사 소개 (About Us) 텍스트 관리</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-500">소개 소제목</label>
                      <input
                        type="text"
                        id="cms-about-title"
                        value={editedSettings.aboutTitle}
                        onChange={(e) => setEditedSettings({ ...editedSettings, aboutTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-500">소개 본문 상세 문구</label>
                      <textarea
                        id="cms-about-desc"
                        rows={5}
                        value={editedSettings.aboutDescription}
                        onChange={(e) => setEditedSettings({ ...editedSettings, aboutDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-500">소개 이미지 (WHY DESIGN CUBE 이미지)</label>
                      <p className="text-[10px] text-neutral-400">초고해상도 이미지 주소(URL)를 직접 입력하거나, 업로드 버튼을 눌러 이미지 파일을 등록할 수 있습니다.</p>
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={editedSettings.aboutImage || ""}
                          onChange={(e) => setEditedSettings({ ...editedSettings, aboutImage: e.target.value })}
                          className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                          placeholder="비워둘 시 기본값(3번째 히어로 배너 이미지)이 사용됩니다."
                        />
                        <label className="p-2 bg-neutral-100 text-neutral-500 hover:text-navy-point hover:bg-neutral-200 rounded-sm transition-colors cursor-pointer flex items-center gap-1" title="이미지 파일 업로드">
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAboutImageUpload(e.target.files)}
                            className="hidden"
                          />
                        </label>
                        {editedSettings.aboutImage && (
                          <a
                            href={editedSettings.aboutImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-navy-point underline hover:text-navy-point/80 shrink-0"
                          >
                            미리보기
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Slide Images List */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider">히어로 배너 슬라이드 이미지 관리</h3>
                  <p className="text-[10px] text-neutral-400">초고해상도 Unsplash 이미지 주소나 실제 웹 이미지 URL을 등록하거나, 오른쪽의 업로드 버튼을 눌러 실제 PC 파일을 등록할 수 있습니다.</p>
                  <div className="space-y-3">
                    {editedSettings.heroImages.map((img, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <span className="text-xs font-semibold text-neutral-400 w-16">슬라이드 {idx + 1}</span>
                        <input
                          type="text"
                          id={`cms-hero-img-${idx}`}
                          value={img}
                          onChange={(e) => handleHeroImageChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                        <label className="p-2 bg-neutral-100 text-neutral-500 hover:text-navy-point hover:bg-neutral-200 rounded-sm transition-colors cursor-pointer flex items-center gap-1" title="이미지 파일 업로드">
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleHeroImageUpload(idx, e.target.files)}
                            className="hidden"
                          />
                        </label>
                        {img && (
                          <a
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-neutral-100 text-neutral-500 hover:text-neutral-800 rounded-sm transition-colors"
                            title="새 탭에서 미리보기"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Contact Footer Information */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider">회사 비즈니스 하단(Footer) 연락 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600">대표 상담 전화</label>
                      <input
                        type="text"
                        id="cms-phone"
                        value={editedSettings.contactPhone}
                        onChange={(e) => setEditedSettings({ ...editedSettings, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600">공식 이메일 주소</label>
                      <input
                        type="email"
                        id="cms-email"
                        value={editedSettings.contactEmail}
                        onChange={(e) => setEditedSettings({ ...editedSettings, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600">대표 지번/도로명 주소</label>
                      <input
                        type="text"
                        id="cms-address"
                        value={editedSettings.address}
                        onChange={(e) => setEditedSettings({ ...editedSettings, address: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600">사업자 등록 번호</label>
                      <input
                        type="text"
                        id="cms-business"
                        value={editedSettings.businessNumber}
                        onChange={(e) => setEditedSettings({ ...editedSettings, businessNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600">카카오톡 문의/상담 링크</label>
                      <input
                        type="text"
                        id="cms-kakao"
                        value={editedSettings.kakaoLink || ""}
                        onChange={(e) => setEditedSettings({ ...editedSettings, kakaoLink: e.target.value })}
                        placeholder="예: https://open.kakao.com/..."
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                      <p className="text-[10px] text-neutral-400">모바일 및 데스크톱에서 작동하는 카카오톡 오픈프로필이나 오픈채팅방 링크를 입력해주세요. 입력 시 화면 우측 하단에 카카오톡 1:1 문의 플로팅 버튼이 표시됩니다.</p>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600">인스타그램 링크</label>
                      <input
                        type="text"
                        id="cms-instagram"
                        value={editedSettings.instagramLink || ""}
                        onChange={(e) => setEditedSettings({ ...editedSettings, instagramLink: e.target.value })}
                        placeholder="예: https://www.instagram.com/개정명"
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                      <p className="text-[10px] text-neutral-400">푸터(하단부)에 연결될 공식 인스타그램 계정의 URL 주소입니다. 비워두시면 푸터에 인스타그램 아이콘이 노출되지 않습니다.</p>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600">네이버 블로그 링크</label>
                      <input
                        type="text"
                        id="cms-blog"
                        value={editedSettings.blogLink || ""}
                        onChange={(e) => setEditedSettings({ ...editedSettings, blogLink: e.target.value })}
                        placeholder="예: https://blog.naver.com/아이디"
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                      <p className="text-[10px] text-neutral-400">푸터(하단부)에 연결될 공식 네이버 블로그의 URL 주소입니다. 비워두시면 푸터에 블로그 아이콘이 노출되지 않습니다.</p>
                    </div>
                  </div>
                </div>

                {/* Settings Action Buttons */}
                <div className="pt-6 border-t border-neutral-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleResetSettings}
                    className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold text-xs tracking-wider uppercase transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>작성 취소</span>
                  </button>
                  <button
                    type="submit"
                    id="btn-cms-settings-save"
                    className="px-6 py-3 bg-navy-point hover:bg-neutral-800 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>설정 실시간 저장 및 발행</span>
                  </button>
                </div>
              </form>

              {/* Admin Password Reset Card */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="max-w-md">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neutral-800" />
                    <span>관리자 접속 비밀번호 변경</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mb-6 leading-relaxed">
                    관리자 페이지 로그인 시 사용할 새로운 비밀번호를 설정합니다. 변경 후에는 로그인 시 설정한 새로운 비밀번호를 입력해야 합니다.
                    <br /><br />
                    <span className="text-amber-600 font-semibold block bg-amber-50 p-3 border border-amber-200 rounded-sm">
                      ※ 초기 마스터 비밀번호는 <strong className="font-mono text-amber-800">cube1234</strong> 입니다.<br />
                      로그인 분실 시 로그인 창 하단의 <strong className="text-amber-800">"비밀번호를 잃어버렸습니까?"</strong> 문구를 누르면 즉시 마스터 비밀번호로 초기화됩니다.
                    </span>
                  </p>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600">새 비밀번호 입력</label>
                      <input
                        type="password"
                        id="cms-new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새로운 비밀번호를 입력해 주세요."
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600">새 비밀번호 확인</label>
                      <input
                        type="password"
                        id="cms-confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 한번 더 입력해 주세요."
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                      />
                    </div>

                    {passwordError && (
                      <p className="text-red-500 text-xs font-medium">{passwordError}</p>
                    )}

                    <button
                      type="submit"
                      id="btn-cms-password-save"
                      className="px-4 py-2 bg-neutral-800 hover:bg-navy-point text-white text-[10px] font-bold tracking-wider uppercase transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>비밀번호 재설정 및 저장</span>
                    </button>
                  </form>
                </div>
              </div>
              </>
            )}

            {/* SUBTAB 2: PORTFOLIO MANAGEMENT (CRUD) */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                
                {/* Header & New Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-navy-point" />
                      <span>포트폴리오 게시글 통합 마스터 리스트 ({portfolioItems.length})</span>
                    </h2>
                    <p className="text-xs text-neutral-400 font-light">등록된 인테리어 포트폴리오를 즉각 수정하거나 새로운 프로젝트를 작성해 보세요.</p>
                  </div>
                  {!isAddingPortfolio && (
                    <button
                      id="btn-cms-add-portfolio"
                      onClick={openAddPortfolio}
                      className="px-4 py-2 bg-navy-point hover:bg-neutral-800 text-white text-xs font-bold rounded-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>새 포트폴리오 추가</span>
                    </button>
                  )}
                </div>

                {/* Form to Add or Edit Portfolio (Slide down) */}
                {isAddingPortfolio && (
                  <form onSubmit={handlePortfolioSubmit} className="bg-neutral-50 p-6 border border-neutral-200 rounded-sm space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                      <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                        <FileEdit className="w-4 h-4 text-navy-point" />
                        <span>{editingPortfolioId ? '기존 포트폴리오 프로젝트 편집' : '신규 포트폴리오 프로젝트 등록'}</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsAddingPortfolio(false)}
                        className="text-xs text-neutral-400 hover:text-neutral-600 font-semibold cursor-pointer"
                      >
                        취소하기
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600">프로젝트 타이틀 *</label>
                        <input
                          type="text"
                          id="portfolio-form-title"
                          value={portfolioForm.title}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                          placeholder="예: 반포 푸르지오 40평형 리모델링"
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600">공간 분류 *</label>
                        <select
                          id="portfolio-form-category"
                          value={portfolioForm.category}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value as ProjectCategory })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point cursor-pointer"
                        >
                          <option value="주거공간">주거공간 (Residential)</option>
                          <option value="상업공간">상업공간 (Commercial)</option>
                          <option value="화재 및 누수 복구">화재 및 누수 복구 (Fire & Leakage Restoration)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-neutral-600">대표 썸네일 이미지 URL 주소 (선택 - 미입력 시 '시공 후 완공사진 1' 자동 사용)</label>
                        <input
                          type="text"
                          id="portfolio-form-image"
                          value={portfolioForm.image}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, image: e.target.value })}
                          placeholder="예: https://images.unsplash.com/photo-... (미입력 시 아래 시공 후 완공사진의 첫 사진이 대표 이미지로 지정됩니다.)"
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-neutral-600">상세 시공 설명 카피 *</label>
                        <textarea
                          id="portfolio-form-desc"
                          rows={4}
                          value={portfolioForm.description}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                          placeholder="공사 공법, 자재 선택, 전반적인 인테리어 무드 등을 상세히 써주세요."
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600">의뢰 고객/브랜드</label>
                        <input
                          type="text"
                          id="portfolio-form-client"
                          value={portfolioForm.client}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, client: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600">공사 면적 (평수/㎡)</label>
                        <input
                          type="text"
                          id="portfolio-form-area"
                          value={portfolioForm.area}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, area: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600">시공 완료 연도 (Year)</label>
                        <input
                          type="text"
                          id="portfolio-form-year"
                          value={portfolioForm.year}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, year: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-600">시공 세부 지역</label>
                        <input
                          type="text"
                          id="portfolio-form-location"
                          value={portfolioForm.location}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, location: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:ring-1 focus:ring-navy-point"
                        />
                      </div>

                      {/* Before (시공 전) 사진 */}
                      <div className="space-y-3 sm:col-span-2 border-t border-neutral-200 pt-6">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800">1. 시공 전 사진 관리 (Before Stage)</h4>
                          <p className="text-[11px] text-neutral-400">철거 직후나 인테리어 시공을 진행하기 전 기존 상태 사진을 등록해 주세요.</p>
                        </div>

                        {/* URL Add and File Upload */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={stageUrlInputs.before}
                              onChange={(e) => setStageUrlInputs({ ...stageUrlInputs, before: e.target.value })}
                              placeholder="인터넷 이미지 URL 주소를 붙여넣거나 오른쪽 업로드 버튼을 사용해 보세요."
                              className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddUrlToStage('before')}
                              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-955 text-xs font-bold rounded-sm whitespace-nowrap cursor-pointer animate-none"
                            >
                              URL 추가
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-955 text-xs font-bold rounded-sm cursor-pointer flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" />
                              <span>사진 파일 업로드</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => e.target.files && processFilesForStage(e.target.files, 'before')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Existing Images Grid */}
                        {portfolioForm.beforeImages && portfolioForm.beforeImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 p-3 bg-white border border-neutral-200 rounded-sm mt-2">
                            {portfolioForm.beforeImages.map((img, idx) => (
                              <div key={idx} className="relative aspect-square bg-neutral-100 border border-neutral-200 group overflow-hidden">
                                <img
                                  src={img}
                                  alt={`Before ${idx}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageFromStage('before', idx)}
                                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer animate-none"
                                  title="삭제"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* During (시공 중) 사진 */}
                      <div className="space-y-3 sm:col-span-2 border-t border-neutral-200 pt-6">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800">2. 시공 중 사진 관리 (During Stage)</h4>
                          <p className="text-[11px] text-neutral-400">철거 완료 후 목공, 배선, 도배, 조명 설치 등 핵심 진행 공정의 시공 중 사진을 등록해 주세요.</p>
                        </div>

                        {/* URL Add and File Upload */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={stageUrlInputs.during}
                              onChange={(e) => setStageUrlInputs({ ...stageUrlInputs, during: e.target.value })}
                              placeholder="인터넷 이미지 URL 주소를 붙여넣거나 오른쪽 업로드 버튼을 사용해 보세요."
                              className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddUrlToStage('during')}
                              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-955 text-xs font-bold rounded-sm whitespace-nowrap cursor-pointer animate-none"
                            >
                              URL 추가
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-955 text-xs font-bold rounded-sm cursor-pointer flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" />
                              <span>사진 파일 업로드</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => e.target.files && processFilesForStage(e.target.files, 'during')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Existing Images Grid */}
                        {portfolioForm.duringImages && portfolioForm.duringImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 p-3 bg-white border border-neutral-200 rounded-sm mt-2">
                            {portfolioForm.duringImages.map((img, idx) => (
                              <div key={idx} className="relative aspect-square bg-neutral-100 border border-neutral-200 group overflow-hidden">
                                <img
                                  src={img}
                                  alt={`During ${idx}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageFromStage('during', idx)}
                                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer animate-none"
                                  title="삭제"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* After (시공 후) 사진 */}
                      <div className="space-y-3 sm:col-span-2 border-t border-neutral-200 pt-6">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800">3. 시공 후 완공 사진 관리 (After Stage)</h4>
                          <p className="text-[11px] text-neutral-400">모든 시공 및 준공 청소가 완료된 고해상도 애프터 완공 사진들을 전시합니다. (최소 1장 필수)</p>
                        </div>

                        {/* URL Add and File Upload */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={stageUrlInputs.after}
                              onChange={(e) => setStageUrlInputs({ ...stageUrlInputs, after: e.target.value })}
                              placeholder="인터넷 이미지 URL 주소를 붙여넣거나 오른쪽 업로드 버튼을 사용해 보세요."
                              className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-sm text-xs focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddUrlToStage('after')}
                              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-955 text-xs font-bold rounded-sm whitespace-nowrap cursor-pointer animate-none"
                            >
                              URL 추가
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-955 text-xs font-bold rounded-sm cursor-pointer flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" />
                              <span>사진 파일 업로드</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => e.target.files && processFilesForStage(e.target.files, 'after')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Existing Images Grid */}
                        {portfolioForm.afterImages && portfolioForm.afterImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 p-3 bg-white border border-neutral-200 rounded-sm mt-2">
                            {portfolioForm.afterImages.map((img, idx) => (
                              <div key={idx} className="relative aspect-square bg-neutral-100 border border-neutral-200 group overflow-hidden">
                                <img
                                  src={img}
                                  alt={`After ${idx}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageFromStage('after', idx)}
                                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer animate-none"
                                  title="삭제"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingPortfolio(false)}
                        className="px-4 py-2 bg-neutral-200 text-neutral-600 text-xs font-bold rounded-sm cursor-pointer"
                      >
                        취소하기
                      </button>
                      <button
                        type="submit"
                        id="btn-cms-portfolio-submit"
                        className="px-4 py-2 bg-navy-point text-white text-xs font-bold rounded-sm cursor-pointer"
                      >
                        {editingPortfolioId ? '게시글 업데이트 완료' : '신규 프로젝트 게시 및 발행'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Portfolio items Table */}
                <div className="overflow-x-auto border border-neutral-100 rounded-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                        <th className="p-4 w-20">이미지</th>
                        <th className="p-4 w-28">공간 분류</th>
                        <th className="p-4">프로젝트명 / 지역</th>
                        <th className="p-4 w-32">면적 / 연도</th>
                        <th className="p-4 w-24 text-right">관리 제어</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {portfolioItems.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-neutral-100 text-navy-point border border-neutral-200/50 rounded-full font-semibold">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-neutral-800 line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{item.location}</p>
                          </td>
                          <td className="p-4 text-neutral-500 font-medium">
                            <p>{item.area}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{item.year}년</p>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end space-x-1.5">
                              <button
                                id={`btn-edit-portfolio-${item.id}`}
                                onClick={() => openEditPortfolio(item)}
                                className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-sm transition-colors cursor-pointer"
                                title="수정"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {portfolioDeleteConfirmId === item.id ? (
                                <div className="flex items-center space-x-1">
                                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-1 border border-red-200">정말 삭제?</span>
                                  <button
                                    onClick={() => {
                                      const updatedList = portfolioItems.filter(p => p.id !== item.id);
                                      onUpdatePortfolio(updatedList);
                                      setPortfolioDeleteConfirmId(null);
                                      triggerSuccessNotification('포트폴리오가 정상적으로 삭제되었습니다.');
                                    }}
                                    className="px-1.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold rounded-sm transition-colors cursor-pointer"
                                  >
                                    확인
                                  </button>
                                  <button
                                    onClick={() => setPortfolioDeleteConfirmId(null)}
                                    className="px-1.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 text-[9px] font-bold rounded-sm transition-colors cursor-pointer"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  id={`btn-delete-portfolio-${item.id}`}
                                  onClick={() => setPortfolioDeleteConfirmId(item.id)}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-sm transition-colors cursor-pointer"
                                  title="삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUBTAB 3: REAL-TIME CONSULTATION MANAGEMENT */}
            {activeTab === 'consultations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-navy-point" />
                    <span>실시간 고객 상담 요청 관리 데이터베이스 ({consultations.length})</span>
                  </h2>
                  <p className="text-xs text-neutral-400 font-light">고객이 홈페이지 견적 상담을 신청하면 이 공간으로 실시간 자동 인입됩니다.</p>
                </div>

                {consultations.length === 0 ? (
                  <div className="py-16 text-center text-neutral-400 font-light border border-dashed border-neutral-200">
                    현재 접수된 상담 상담서가 존재하지 않습니다.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {consultations.map((c) => (
                      <div
                        key={c.id}
                        id={`consultation-cms-${c.id}`}
                        className="p-6 border border-neutral-200 rounded-sm bg-neutral-50/50 hover:bg-white transition-all space-y-4 shadow-sm"
                      >
                        {/* Consultation Header Card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2.5">
                              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1">
                                <User className="w-4 h-4 text-neutral-400" />
                                <span>{c.name} 고객님</span>
                              </h3>
                              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{c.date} 접수</span>
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-sm text-[10px] font-bold uppercase">
                                {c.type}
                              </span>
                              <span className="text-neutral-500 font-medium">| {c.phone} |</span>
                              {c.email && <span className="text-neutral-400 font-light">{c.email}</span>}
                            </div>
                          </div>

                          {/* Action Controller */}
                          <div className="flex items-center space-x-3">
                            {/* Status Selector */}
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase">상태</span>
                              <select
                                value={c.status}
                                onChange={(e) => handleInquiryStatusChange(c.id, e.target.value as any)}
                                className={`px-2 py-1 border text-xs rounded-sm font-semibold cursor-pointer focus:outline-none ${
                                  c.status === '대기중'
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : c.status === '상담진행중'
                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : 'bg-green-50 text-green-600 border-green-200'
                                }`}
                              >
                                <option value="대기중">대기중</option>
                                <option value="상담진행중">상담진행중</option>
                                <option value="완료">완료 (시공대기/종료)</option>
                              </select>
                            </div>

                            {inquiryDeleteConfirmId === c.id ? (
                              <div className="flex items-center space-x-1">
                                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 border border-red-200">정말 삭제?</span>
                                <button
                                  onClick={() => {
                                    const updated = consultations.filter(item => item.id !== c.id);
                                    onUpdateConsultations(updated);
                                    setInquiryDeleteConfirmId(null);
                                    triggerSuccessNotification('상담 내역이 안전하게 삭제되었습니다.');
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-sm transition-colors cursor-pointer"
                                >
                                  확인
                                </button>
                                <button
                                  onClick={() => setInquiryDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 text-[10px] font-bold rounded-sm transition-colors cursor-pointer"
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <button
                                id={`btn-delete-inquiry-${c.id}`}
                                onClick={() => setInquiryDeleteConfirmId(c.id)}
                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-sm transition-colors cursor-pointer"
                                title="상담 내역 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer Requirement details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 border border-neutral-100 rounded-sm text-xs">
                          <div>
                            <span className="text-neutral-400 block mb-0.5">예상 예산</span>
                            <span className="font-bold text-neutral-700">{c.budget}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block mb-0.5">희망 시공 면적</span>
                            <span className="font-bold text-neutral-700">{c.area}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block mb-0.5">희망 입주/시공 일정</span>
                            <span className="font-bold text-neutral-700">{c.schedule}</span>
                          </div>
                        </div>

                        <div className="space-y-1 bg-white p-4 border border-neutral-100 rounded-sm text-xs">
                          <span className="text-neutral-400 block font-semibold">고객 요청 사항</span>
                          <p className="text-neutral-600 leading-relaxed whitespace-pre-line font-light mt-1">
                            {c.content}
                          </p>
                        </div>

                        {c.attachedImages && c.attachedImages.length > 0 && (
                          <div className="space-y-2 bg-white p-4 border border-neutral-100 rounded-sm text-xs">
                            <span className="text-neutral-400 block font-semibold">고객 첨부 현장 및 희망 사진 ({c.attachedImages.length}장)</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-2">
                              {c.attachedImages.map((img, idx) => {
                                const isValidImage = img.startsWith('data:image/') || img.startsWith('http://') || img.startsWith('https://');
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setActiveSliderImages(c.attachedImages || []);
                                      setActiveSliderIndex(idx);
                                    }}
                                    className="relative aspect-square border border-neutral-200 block overflow-hidden group rounded-sm bg-neutral-50 text-left w-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-navy-point"
                                    title="사진 크게보기"
                                  >
                                    {isValidImage ? (
                                      <img
                                        src={img}
                                        alt={`고객 첨부 사진 ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-neutral-400 bg-neutral-100">
                                        <FileText className="w-6 h-6 mb-1 text-neutral-400" />
                                        <span className="text-[9px] font-semibold leading-tight line-clamp-2">{img}</span>
                                      </div>
                                    )}
                                    {isValidImage && (
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white">
                                        <Eye className="w-3.5 h-3.5 mr-1" /> 크게 보기
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Admin Internal Memo Section */}
                        <div className="bg-neutral-100/70 p-4 border border-neutral-200 rounded-sm text-xs space-y-2">
                          <label className="font-bold text-neutral-700 block flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-neutral-400" />
                            <span>디자이너 내부 상담 업무일지 (관리자 전용 메모)</span>
                          </label>
                          <textarea
                            id={`memo-${c.id}`}
                            rows={2}
                            placeholder="전화 통화 내용, 미팅 약속, 협의 특이사항을 적어두세요."
                            defaultValue={c.adminMemo || ''}
                            onBlur={(e) => handleInquiryMemoSave(c.id, e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-sm focus:ring-1 focus:ring-navy-point text-xs"
                          />
                          <p className="text-[10px] text-neutral-400 italic">포커스 해제(입력창 바깥 클릭) 시 자동으로 내용이 데이터베이스에 실시간 기록됩니다.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* SUBTAB 4: CMS USAGE GUIDE */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-navy-point" />
                    <span>디자인큐브 CMS 대시보드 사용 가이드라인</span>
                  </h2>
                  <p className="text-xs text-neutral-400 font-light">코딩 지식이 없는 일반 전산 사원이나 디자이너도 웹을 쉽게 관리하는 체계입니다.</p>
                </div>

                <div className="space-y-4 text-xs text-neutral-600 leading-relaxed font-light">
                  <div className="bg-neutral-50 p-5 border-l-4 border-navy-point rounded-sm space-y-2">
                    <h3 className="font-bold text-neutral-800 text-sm">1. 웹사이트의 실시간 렌더링 동기화</h3>
                    <p>본 대시보드는 <strong>localStorage API</strong>를 기반으로 하여 동작하는 최첨단 콘텐츠 매니지먼트(CMS) 엔진입니다. 관리자 제어반에서 대표 타이틀, 시그니처 테마 컬러, 또는 포트폴리오를 추가하고 "저장" 버튼을 누르시면 메인 페이지나 견적서 양식에 즉각 반영되며 새로고침 후에도 안전하게 유지됩니다.</p>
                  </div>

                  <div className="bg-neutral-50 p-5 border-l-4 border-navy-point rounded-sm space-y-2">
                    <h3 className="font-bold text-neutral-800 text-sm">2. 이미지 파일 관리 팁</h3>
                    <p>디자인큐브 웹사이트는 서버 용량 낭비를 막고 고성능 로딩 스피드를 유지하기 위해, 웹 상에 최적화 업로드되어 있는 고품질 이미지 링크를 붙여넣는 방식을 취하고 있습니다. 신뢰도 높은 무상 라이브러리인 <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-navy-point underline font-medium">Unsplash</a> 등에서 원하시는 고화질 인테리어 사진의 <strong>[이미지 주소 복사]</strong>를 진행하신 뒤 이미지 폼에 그대로 붙여넣으시면 훌륭하게 전시됩니다.</p>
                  </div>

                  <div className="bg-neutral-50 p-5 border-l-4 border-navy-point rounded-sm space-y-2">
                    <h3 className="font-bold text-neutral-800 text-sm">3. 보안 및 관리 수칙</h3>
                    <p>보안상 안전한 사용을 위해 자리를 비우시거나 정식 운영서버로 사이트를 공유하실 때에는 상단의 <strong>[보안 로그아웃]</strong> 버튼을 꼭 눌러 제어 권한을 즉각 잠그셔야 일반 고객의 침입을 원천 예방할 수 있습니다.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-5 py-2.5 bg-navy-point text-white text-xs font-semibold rounded-sm cursor-pointer hover:bg-neutral-800 transition-colors"
                  >
                    지금 설정 변경하러 가기
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* On-Page Photo Slider Modal (No new page/tab) */}
      {activeSliderImages && activeSliderImages.length > 0 && (
        <div 
          id="photo-slider-modal" 
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-neutral-800 backdrop-blur-md">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">디자인큐브 이미지 뷰어</span>
              <span className="text-sm font-semibold text-neutral-100">고객 첨부 사진 ({activeSliderIndex + 1} / {activeSliderImages.length})</span>
            </div>
            <button
              onClick={() => setActiveSliderImages(null)}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
              title="닫기 (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Content (Image viewport + Slide Arrows) */}
          <div className="flex-1 flex items-center justify-between px-4 md:px-12 relative group select-none">
            {/* Left Button */}
            {activeSliderImages.length > 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSliderIndex((prev) => (prev === 0 ? activeSliderImages.length - 1 : prev - 1));
                }}
                className="p-3 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-white rounded-full transition-all border border-neutral-800 cursor-pointer focus:outline-none"
                title="이전 사진"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-12"></div>
            )}

            {/* Selected Photo display */}
            <div className="flex-1 flex items-center justify-center max-h-[65vh] p-4">
              {(() => {
                const currentImg = activeSliderImages[activeSliderIndex];
                const isValid = currentImg.startsWith('data:image/') || currentImg.startsWith('http://') || currentImg.startsWith('https://');
                if (isValid) {
                  return (
                    <img
                      src={currentImg}
                      alt={`첨부 이미지 ${activeSliderIndex + 1}`}
                      className="max-w-full max-h-[65vh] object-contain shadow-2xl border border-neutral-800 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  );
                } else {
                  return (
                    <div className="p-8 bg-neutral-900 border border-neutral-800 text-center rounded-none max-w-md w-full">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
                      <p className="text-sm text-neutral-300 mb-2">이미지 파일을 표시할 수 없습니다.</p>
                      <p className="text-xs text-neutral-500 font-light font-mono break-all">{currentImg}</p>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Right Button */}
            {activeSliderImages.length > 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSliderIndex((prev) => (prev === activeSliderImages.length - 1 ? 0 : prev + 1));
                }}
                className="p-3 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-white rounded-full transition-all border border-neutral-800 cursor-pointer focus:outline-none"
                title="다음 사진"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-12"></div>
            )}
          </div>

          {/* Modal Footer (Mini Thumbnail Strip for easy navigation) */}
          <div className="bg-black/80 px-6 py-6 border-t border-neutral-900 flex flex-col items-center gap-4">
            {activeSliderImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-4">
                {activeSliderImages.map((img, idx) => {
                  const isValid = img.startsWith('data:image/') || img.startsWith('http://') || img.startsWith('https://');
                  const isSelected = idx === activeSliderIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveSliderIndex(idx)}
                      className={`relative w-16 h-16 border-2 flex-shrink-0 transition-all rounded-sm overflow-hidden cursor-pointer ${
                        isSelected ? 'border-yellow-400' : 'border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {isValid ? (
                        <img
                          src={img}
                          alt={`썸네일 ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[10px] text-neutral-500">
                          텍스트
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="text-[11px] text-neutral-500 font-light flex items-center gap-2">
              <span>팁: 좌우 화살표를 누르거나 하단 썸네일을 직접 클릭하여 다른 사진을 확인할 수 있습니다.</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
