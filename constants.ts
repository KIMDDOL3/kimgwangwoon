import { User, Scholarship, DiagnosticQuestion, FAQItem, ExternalScholarship, ScholarshipCategory, AllScholarships } from './types';

export const MOCK_USER: User = {
  id: 'user-001',
  name: '김재학생',
  universityId: '2020123456',
  department: 'Computer Science',
  year: 2,
};

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 's000',
    title: '국가장학금 (I유형)',
    category: 'Need-based',
    summary: '대한민국 국적의 국내 대학 재학생 중 소득수준에 따라 국가가 지원하는 장학금입니다.',
    fullDescription: '학생직접지원형으로, 소득수준에 따라 차등 지원하여 경제적 부담을 경감시켜주는 가장 대표적인 장학금입니다. 매 학기 한국장학재단 홈페이지 또는 모바일 앱을 통해 정해진 기간 내에 반드시 신청해야 합니다. 소득분위(학자금 지원구간) 8구간 이하 학생들에게 등록금 범위 내에서 지원됩니다.',
    requirements: {
      incomeBracket: 8,
      minGpa: 2.75, // C학점 경고제 등 예외사항 존재
    },
    applicationUrl: 'https://www.kosaf.go.kr/ko/main.do',
    deadline: '2024-12-10', // 예시 마감일
  },
  {
    id: 's001',
    title: '성적우수 장학금',
    category: 'Merit-based',
    summary: '직전 학기 성적이 우수한 학생에게 지급되는 장학금입니다.',
    fullDescription: '전남대학교의 학업 성취도 향상을 독려하기 위해, 직전 학기 평점 평균이 3.5 이상인 학생들을 대상으로 선발하여 지급합니다. 별도의 신청 없이 성적 기준으로 자동 선발됩니다.',
    requirements: {
      minGpa: 3.5,
      allowedYears: [1, 2, 3, 4],
    },
    applicationUrl: '#',
    deadline: '2024-12-15',
  },
  {
    id: 's002',
    title: '생활지원 장학금 (교내)',
    category: 'Need-based',
    summary: '경제적으로 도움이 필요한 학생들을 위한 생활비 지원 장학금입니다.',
    fullDescription: '가계 소득 수준을 기준으로, 학업에 어려움을 겪는 학생들에게 생활비를 지원하여 안정적인 대학 생활을 돕습니다. 한국장학재단 소득분위 4구간 이하 학생이 신청 대상입니다.',
    requirements: {
      minGpa: 2.5,
      incomeBracket: 4,
    },
    applicationUrl: '#',
    deadline: '2024-09-30',
  },
  {
    id: 's003',
    title: 'IT 인재육성 장학금',
    category: 'Talent-based',
    summary: '컴퓨터공학과 2, 3학년 학생 중 뛰어난 재능을 보이는 학생을 지원합니다.',
    fullDescription: '미래 IT 산업을 이끌어갈 핵심 인재를 양성하기 위해, 컴퓨터공학과 재학생 중 프로젝트 경험이 풍부하고 성적이 우수한 학생을 선발합니다. 포트폴리오 제출이 필요합니다.',
    requirements: {
      minGpa: 3.7,
      allowedYears: [2, 3],
      allowedDepartments: ['Computer Science'],
    },
    applicationUrl: '#',
    deadline: '2024-10-15',
  },
  {
    id: 's004',
    title: '신입생 장학금',
    category: 'Merit-based',
    summary: '우수한 성적으로 입학한 신입생을 위한 장학금입니다.',
    fullDescription: '수능 또는 내신 성적이 우수한 신입생에게 지급하여 초기 대학 생활 적응을 돕습니다. 입학 성적에 따라 자동으로 선발됩니다.',
    requirements: {
      allowedYears: [1],
    },
    applicationUrl: '#',
    deadline: '2025-03-01',
  },
  {
    id: 's005',
    title: '글로벌 리더십 장학금',
    category: 'Talent-based',
    summary: '해외 교환학생 프로그램 참가자 또는 어학 성적 우수자를 지원합니다.',
    fullDescription: '국제적 감각과 리더십을 갖춘 인재를 지원하기 위한 장학금입니다. 공인 어학 성적(TOEIC 900점 이상 또는 그에 준하는 성적) 제출이 필수입니다.',
    requirements: {
      minGpa: 3.0,
    },
    applicationUrl: '#',
    deadline: '2024-11-01',
  },
];

export const EXTERNAL_SCHOLARSHIPS: ExternalScholarship[] = [
  {
    id: 'e001',
    title: '삼성드림클래스 장학금',
    foundation: '삼성드림클래스',
    summary: '교육 기회가 부족한 중학생들에게 학습 기회를 제공하는 대학생 멘토에게 지급되는 장학금입니다.',
    applicationUrl: '#',
    deadline: '2024-11-20',
    category: 'External',
  },
  {
    id: 'e002',
    title: '현대차 정몽구 재단 장학금',
    foundation: '현대차 정몽구 재단',
    summary: '미래 인재 육성을 목표로, 다양한 분야의 대학생 및 대학원생을 지원하는 종합 장학 프로그램입니다.',
    applicationUrl: '#',
    deadline: '2024-10-31',
    category: 'External',
  },
  {
    id: 'e003',
    title: 'LG연암문화재단 장학금',
    foundation: 'LG연암문화재단',
    summary: '해외 유학을 준비하는 이공계 석박사 과정 학생들을 지원하여 학문적 성장을 돕습니다.',
    applicationUrl: '#',
    deadline: '2024-11-05',
    category: 'External',
  },
];

export const ALL_SCHOLARSHIPS: AllScholarships[] = [
  ...SCHOLARSHIPS.map(s => ({
    ...s,
    source: 'Internal' as const,
    provider: '전남대학교',
  })),
  ...EXTERNAL_SCHOLARSHIPS.map(s => ({
    ...s,
    source: 'External' as const,
    provider: s.foundation,
    // FIX: Added missing `fullDescription` property required by the `AllScholarships` type.
    fullDescription: s.summary, 
    requirements: { // Example: Manually added requirements for external scholarships
      minGpa: 3.0
    }
  })),
];


// FIX: Removed the `icon` property and its JSX value because JSX is invalid in a .ts file. This property was not used anywhere in the application.
export const SCHOLARSHIP_CATEGORIES: Record<ScholarshipCategory, { label: string; color: string; }> = {
    'Merit-based': { label: '성적우수', color: '#3b82f6' },
    'Need-based': { label: '생활지원', color: '#facc15' }, // Changed to gold for National Scholarship
    'Talent-based': { label: '특기/인재', color: '#f97316' },
    'External': { label: '교외/재단', color: '#8b5cf6' },
    'Other': { label: '기타', color: '#64748b' },
};


export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q1',
    key: 'year',
    text: '현재 학년이 어떻게 되시나요?',
    type: 'single-choice',
    options: [
      { label: '1학년', value: 1 },
      { label: '2학년', value: 2 },
      { label: '3학년', value: 3 },
      { label: '4학년', value: 4 },
    ],
  },
  {
    id: 'q2',
    key: 'department',
    text: '소속 학과가 어떻게 되시나요?',
    type: 'single-choice',
    options: [
      { label: '컴퓨터공학과', value: 'Computer Science' },
      { label: '경영학과', value: 'Business' },
      { label: '기타', value: 'Other' },
    ],
  },
  {
    id: 'q3',
    key: 'gpa',
    text: '직전 학기 평점 평균(GPA)을 입력해주세요. (4.5 만점)',
    type: 'number-input',
  },
  {
    id: 'q4',
    key: 'incomeBracket',
    text: '한국장학재단 소득분위가 어떻게 되시나요?',
    type: 'single-choice',
    options: [
      { label: '1~2 구간', value: 2 },
      { label: '3~4 구간', value: 4 },
      { label: '5~6 구간', value: 6 },
      { label: '7~8 구간', value: 8 },
      { label: '9~10 구간', value: 10 },
      { label: '잘 모름/해당 없음', value: 99 },
    ],
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: '장학금 신청은 어떻게 하나요?',
    answer: '각 장학금의 상세 정보에 있는 \'신청하기\' 버튼을 통해 해당 페이지로 이동하거나, 학교 포털의 장학금 신청 메뉴에서 직접 신청할 수 있습니다. 필요한 서류를 미리 확인하고 준비하세요.',
  },
  {
    question: '자가진단 결과는 100% 정확한가요?',
    answer: '자가진단 결과는 입력해주신 정보를 바탕으로 한 참고용 추천입니다. 실제 선발 여부는 장학금 지급 규정 및 심사에 따라 달라질 수 있으므로, 최종 자격 요건은 반드시 공고를 통해 확인하셔야 합니다.',
  },
  {
    question: '소득분위는 어디서 확인할 수 있나요?',
    answer: '한국장학재단 홈페이지(www.kosaf.go.kr)에서 학자금 지원구간 확인이 가능합니다. 매 학기 정해진 기간에 신청해야 하니, 일정을 놓치지 않도록 주의하세요.',
  },
  {
    question: '성적우수 장학금은 자동으로 신청되나요?',
    answer: '대부분의 성적우수 장학금은 별도 신청 없이 직전 학기 성적을 기준으로 자동 선발됩니다. 하지만 일부 특별 성적 장학금은 신청이 필요할 수 있으니, 각 장학금의 상세 설명을 확인하는 것이 좋습니다.',
  },
];