

// FIX: Corrected import path for types
import { AllScholarships, User, DiagnosticQuestion, ScholarshipCategory } from './types';

export const MOCK_USER: User = {
  id: 'user-123',
  name: '김광운',
  universityId: '202101234',
  department: '인공지능융합학과',
  year: 3,
};

export const SCHOLARSHIP_CATEGORIES: Record<ScholarshipCategory, { label: string; color: string; className: string; }> = {
    National: { label: '국가', color: '#f59e0b', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' },
    Merit: { label: '성적우수', color: '#10b981', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' },
    Financial: { label: '생활지원', color: '#3b82f6', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    Talent: { label: '특기/재능', color: '#8b5cf6', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300' },
    Other: { label: '기타', color: '#6b7280', className: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
};

export const ALL_SCHOLARSHIPS: AllScholarships[] = [
  // National
  {
    id: 's000',
    title: '국가장학금 I유형',
    category: 'National',
    source: 'Internal', // Classified as internal for management purposes
    provider: '한국장학재단',
    summary: '소득 수준에 연계하여 경제적으로 어려운 학생들에게 보다 많은 혜택을 주는 장학금입니다.',
    deadline: '2025-09-06',
    applicationUrl: 'https://www.kosaf.go.kr/',
    fullDescription: '대한민국 국적의 국내 대학 재학생으로, 학자금 지원 8구간 이하, 직전 학기 12학점 이상 이수 및 B학점(80점) 이상 성적 기준을 충족해야 합니다.',
    requirements: {
      incomeBracket: 8,
      minGpa: 2.75, // B학점 80/100 -> 2.75/4.5 (approx)
    },
  },
  // Internal
  {
    id: 's001',
    title: '성적우수장학금(I)',
    category: 'Merit',
    source: 'Internal',
    provider: '전남대학교',
    summary: '직전 학기 성적이 우수한 학생에게 지급하는 교내 장학금입니다.',
    deadline: '2025-08-30',
    applicationUrl: '#',
    fullDescription: '별도 신청 없이 직전 학기 성적을 기준으로 자동 선발됩니다. 각 단과대학별 기준에 따라 차등 지급됩니다.',
    requirements: {
      minGpa: 4.0,
      allowedYears: [1, 2, 3, 4],
    },
  },
  {
    id: 's002',
    title: '생활지원 장학금',
    category: 'Financial',
    source: 'Internal',
    provider: '전남대학교',
    summary: '경제적으로 어려운 학생들의 생활비 부담을 덜어주기 위한 장학금입니다.',
    deadline: '2025-09-15',
    applicationUrl: '#',
    fullDescription: '기초생활수급자 및 차상위계층 등 경제적 증빙이 가능한 학생을 대상으로 선발합니다. 소득분위 4구간 이하 학생만 신청 가능합니다.',
    requirements: {
      incomeBracket: 4,
    },
  },
  {
    id: 's003',
    title: 'AI융합인재 장학금',
    category: 'Talent',
    source: 'Internal',
    provider: 'AI융합대학',
    summary: 'AI 분야에서 뛰어난 역량을 보이는 학생을 지원하는 특별 장학금입니다.',
    deadline: '2025-09-20',
    applicationUrl: '#',
    fullDescription: '관련 프로젝트, 경진대회 수상 경력 또는 우수한 포트폴리오를 제출한 학생 중 선발합니다. 인공지능융합학과, 지능시스템공학과 학생만 지원 가능합니다.',
    requirements: {
      minGpa: 3.5,
      allowedDepartments: ['인공지능융합학과', '지능시스템공학과'],
    },
  },
   {
    id: 's004',
    title: '신입생 장학금',
    category: 'Merit',
    source: 'Internal',
    provider: '전남대학교',
    summary: '우수한 성적으로 입학한 신입생을 위한 장학금입니다.',
    deadline: '2025-03-30',
    applicationUrl: '#',
    fullDescription: '수능 성적 또는 학생부 성적 기준으로 상위 일부 신입생에게 자동 지급됩니다.',
    requirements: {
      allowedYears: [1],
    },
  },
  // External
  {
    id: 's101',
    title: '삼성드림클래스 장학금',
    category: 'Other',
    source: 'External',
    provider: '삼성재단',
    summary: '교육 소외계층 중학생들에게 학습 기회를 제공하는 대학생 멘토에게 지급됩니다.',
    deadline: '2025-10-01',
    applicationUrl: 'https://www.samsungdreamclass.org/',
    fullDescription: '삼성드림클래스 멘토로 선발되어 활동하는 대학생에게 활동 기간 동안 장학금을 지급합니다. 봉사정신과 리더십을 중점적으로 평가합니다.',
  },
];


export const EXTERNAL_SCHOLARSHIPS = [
  {
    id: 'ext-01',
    title: '현대차 정몽구 재단 장학금',
    foundation: '현대차 정몽구 재단',
    summary: '미래 인재 육성을 목표로 다양한 분야의 대학생들에게 학업 및 자기계발을 지원합니다.',
    applicationUrl: 'https://www.cmkfoundation.org/',
    deadline: '2025-08-28',
  },
  {
    id: 'ext-02',
    title: '포스코 청년미래 장학금',
    foundation: '포스코청암재단',
    summary: '창의적이고 도전적인 이공계 인재를 발굴하여 지원하는 장학 프로그램입니다.',
    applicationUrl: 'https://www.postf.org/',
    deadline: '2025-09-10',
  },
];


export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    key: 'gpa',
    text: '직전 학기 평균 학점을 입력해주세요. (4.5 만점)',
    type: 'number-input',
  },
  {
    key: 'incomeBracket',
    text: '본인의 현재 소득분위 구간을 알고 계신가요?',
    type: 'single-choice',
    options: [
      { label: '1~2 구간', value: 2 },
      { label: '3~4 구간', value: 4 },
      { label: '5~6 구간', value: 6 },
      { label: '7~8 구간', value: 8 },
      { label: '9~10 구간', value: 10 },
      { label: '잘 모르겠어요', value: 10 }, // Default to highest if unknown
    ],
  },
];

export const FAQ_DATA = [
  {
    question: '국가장학금은 언제 신청해야 하나요?',
    answer: '국가장학금은 1학기와 2학기, 연 2회 신청 기간이 있습니다. 보통 1학기는 전년도 11~12월, 2학기는 당해 5~6월에 1차 신청을 받습니다. 자세한 일정은 한국장학재단 홈페이지를 참고해주세요.',
  },
  {
    question: '교내 성적우수 장학금은 어떻게 신청하나요?',
    answer: '대부분의 교내 성적우수 장학금은 별도의 신청 절차 없이 직전 학기 성적을 기준으로 자동 선발됩니다. 일부 특별한 성적 장학금은 별도 공지를 통해 신청받을 수 있습니다.',
  },
  {
    question: '소득분위는 어떻게 확인하나요?',
    answer: '소득분위(학자금 지원구간)는 한국장학재단 홈페이지에서 가구원 정보제공 동의 및 서류 제출을 완료하면 확인하실 수 있습니다.',
  },
];