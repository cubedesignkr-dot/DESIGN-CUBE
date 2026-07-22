/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiteSettings, PortfolioItem, Consultation } from '../types';

export const DEFAULT_SETTINGS: SiteSettings = {
  logoText: 'DESIGN CUBE',
  mainTitle: '공간을 바꾸면,\n삶이 달라집니다.',
  mainSubtitle: '디자인 큐브는 고객의 생활을 이해하고 오래도록 만족할 수 있는 공간을 만듭니다.',
  heroImages: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80'
  ],
  pointColor: '#001F3F', // Navy
  fontFamily: 'Pretendard',
  contactPhone: '010-2644-6512',
  contactEmail: 'cubedesign.kr@gmail.com',
  address: '경기 안성시 공도읍 정봉길 101-1 가동 302호',
  businessNumber: '334-02-02905',
  aboutTitle: '우리는 공간을 통해 새로운 가치를 창조합니다.',
  aboutDescription: '디자인큐브는 공간의 가치와 고객의 내면을 연결하는 프리미엄 전문 인테리어 그룹입니다. 1년 무상 사후 보증 관리와 투명한 정산, 그리고 주거공간, 상업공간, 화재 및 누수 전문 기술 복원팀을 별도 구축하여 업계 최고의 신뢰를 드립니다.',
  kakaoLink: 'https://open.kakao.com/o/sExample',
  instagramLink: 'https://www.instagram.com/designcube_interior/',
  blogLink: 'https://blog.naver.com/'
};

export const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: '서초 아크로비스타 50평형 펜트하우스',
    category: '주거공간',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: '전체적인 마감은 내추럴 톤의 최고급 이탈리아산 대리석과 화이트 천연 오크 원목을 조화롭게 배치하여, 고급스러우면서도 아늑한 무드를 자아냈습니다. 간접 등박스를 입체적으로 레이어링해 야간에는 웅장한 볼륨감을 선사합니다.',
    client: '이** 고객님',
    area: '165㎡ (50평형)',
    year: '2026',
    location: '서울시 서초구 서초동',
    beforeImages: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'],
    duringImages: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'],
    afterImages: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'p2',
    title: '성수 헤이그라운드 공유 오피스 디자인',
    category: '상업공간',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: '스타트업과 크리에이터들의 협업 극대화를 위한 유연한 모듈형 워크스테이션 설계. 화이트 메탈 스틸과 에폭시 바닥에 플랜테리어를 다각도로 가미하여, 창의력이 살아나는 미니멀 감각의 친환경 스마트 오피스 공간입니다.',
    client: '(주)루트임팩트',
    area: '420㎡ (127평형)',
    year: '2025',
    location: '서울시 성동구 성수동',
    beforeImages: ['https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80'],
    duringImages: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'],
    afterImages: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'p3',
    title: '한남더힐 침실 누수 피해 복구 및 리모델링',
    category: '화재 및 누수 복구',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80',
    description: '상층부 배관 누수로 인해 손상된 천장과 벽면 석고보드를 전면 교체하고, 정밀 방수 보강 및 친환경 단열 시공을 선행했습니다. 이후 은은한 간접 조명과 프리미엄 실크 마감을 더해 이전보다 완벽하고 아늑한 최고급 안식처로 복원해 드렸습니다.',
    client: '김** 고객님',
    area: '198㎡ (60평형)',
    year: '2026',
    location: '서울시 용산구 한남동',
    beforeImages: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
    duringImages: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80'],
    afterImages: ['https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'p4',
    title: '청담 웰빙 다이닝 레스토랑 루프탑',
    category: '상업공간',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    description: '내추럴한 테라코타 타일과 노출 콘크리트를 베이스로 마감하고 세련된 매트 블랙 바 스탠드를 대조시켰습니다. 오픈 주방에서의 시각적 효과를 극대화하는 곡선형 천장 패널 디자인과 조명 설계가 돋보입니다.',
    client: '청담 그린가든',
    area: '132㎡ (40평형)',
    year: '2026',
    location: '서울시 강남구 청담동',
    beforeImages: [],
    duringImages: [],
    afterImages: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'p5',
    title: '반포 자이 아파트 미니멀 거실 리모델링',
    category: '주거공간',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    description: '벽면 전체를 히든도어로 마감하여 군더더기 없이 일직선으로 떨어지는 극단적인 미니멀리즘을 실현했습니다. 주방과 거실을 가로막던 파티션을 철거해 시각적 개방감을 극대화하고 대형 아일랜드 식탁을 중앙에 배치했습니다.',
    client: '박** 고객님',
    area: '112㎡ (34평형)',
    year: '2025',
    location: '서울시 서초구 반포동',
    beforeImages: [],
    duringImages: [],
    afterImages: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'p6',
    title: '대치동 아파트 천장 누수 복구 및 주방 리모델링',
    category: '화재 및 누수 복구',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    description: '천장 소방 배관 누수로 인해 변색된 천장과 주방 수납가구를 전면 정비한 후 고성능 에코 방수 단열 처리를 마쳤습니다. 빌트인 주방 가구 및 아일랜드 후단 마감 라인을 군더더기 없이 일직선으로 완벽하게 신규 복원 및 설계하였습니다.',
    client: '최** 고객님',
    area: '82㎡ (25평형)',
    year: '2026',
    location: '서울시 강남구 대치동',
    beforeImages: [],
    duringImages: [],
    afterImages: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80']
  }
];

export const DEFAULT_CONSULTATIONS: Consultation[] = [
  {
    id: 'c1',
    name: '홍길동',
    phone: '010-1234-5678',
    email: 'kildong@gmail.com',
    type: '주거공간',
    budget: '5,000만원 ~ 1억원',
    area: '34평형',
    schedule: '2026년 8월 초 시공 희망',
    content: '신축 아파트 마이너스 옵션 세대입니다. 전체 모던하고 미니멀한 화이트 우드 스타일로 대형 아일랜드 식탁 및 시스템 에어컨 우물천장 시공을 원합니다.',
    date: '2026-07-18',
    status: '대기중'
  },
  {
    id: 'c2',
    name: '아이린',
    phone: '010-9876-5432',
    email: 'irene@sm.com',
    type: '상업공간',
    budget: '1억원 이상',
    area: '50평형',
    schedule: '빠른 상담 후 즉시 착공 희망',
    content: '청담동 골목에 위치한 2층 단독건물을 감성적인 로스터리 카페 겸 쇼룸 공간으로 리모델링하고 싶습니다. 외부 파사드 디자인과 단독 정원 테라스 조경도 포함하고 싶습니다.',
    date: '2026-07-15',
    status: '상담진행중',
    adminMemo: '7/16 전화 상담 완료. 7/22 오후 2시 현장 실측 및 기본 도면 제안 미팅 약속 잡음.'
  }
];
