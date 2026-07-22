/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SiteSettings {
  logoText: string;
  mainTitle: string;
  mainSubtitle: string;
  heroImages: string[];
  pointColor: string; // Hex code, e.g. "#001F3F"
  fontFamily: 'Pretendard' | 'Space Grotesk' | 'Playfair Display';
  contactPhone: string;
  contactEmail: string;
  address: string;
  businessNumber: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage?: string;
  kakaoLink?: string;
  instagramLink?: string;
  blogLink?: string;
}

export type ProjectCategory = '주거공간' | '상업공간' | '화재 및 누수 복구';

export interface PortfolioItem {
  id: string;
  title: string;
  category: ProjectCategory;
  image: string;
  description: string;
  client: string;
  area: string;
  year: string;
  location: string;
  beforeImages?: string[];
  duringImages?: string[];
  afterImages?: string[];
}

export interface Consultation {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: ProjectCategory | '기타';
  budget: string;
  area: string;
  schedule: string;
  content: string;
  date: string;
  status: '대기중' | '상담진행중' | '완료';
  adminMemo?: string;
  attachedImages?: string[];
}
