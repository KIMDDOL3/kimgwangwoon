
// FIX: Corrected import path
import { StudentProfile, InternationalStudent } from '../../../types';

// For WorkStudyVerificationTool.tsx
export interface WorkLogEntry {
  studentName: string;
  date: string;
  loggedHours: number;
  systemHours: number;
  status: 'Verified' | 'Mismatch';
}

export const mockWorkLogOcrResult: WorkLogEntry[] = [
  { studentName: '김민준', date: '2025-06-03', loggedHours: 4, systemHours: 4, status: 'Verified' },
  { studentName: '이서연', date: '2025-06-03', loggedHours: 3, systemHours: 3, status: 'Verified' },
  { studentName: '박도윤', date: '2025-06-03', loggedHours: 5, systemHours: 4, status: 'Mismatch' },
  { studentName: '최지아', date: '2025-06-04', loggedHours: 4, systemHours: 4, status: 'Verified' },
  { studentName: '김민준', date: '2025-06-04', loggedHours: 2, systemHours: 2, status: 'Verified' },
  { studentName: '박도윤', date: '2025-06-05', loggedHours: 3.5, systemHours: 3.5, status: 'Verified' },
];

// For ScholarshipStatusInquiryTool.tsx and StudentLookupTool.tsx
export const MOCK_STUDENT_DATABASE: StudentProfile[] = [
  { id: 'user-001', name: '김민준', universityId: '2022123456', department: '컴퓨터공학부', year: 2, gpa: 3.8, incomeBracket: 5, status: '재학', scholarshipReceived: true, scholarshipName: '성적우수장학금(II)', scholarshipAmount: 1000000 },
  { id: 'user-002', name: '이서연', universityId: '2021111111', department: '경영학부', year: 3, gpa: 4.2, incomeBracket: 7, status: '재학', scholarshipReceived: true, scholarshipName: '성적우수장학금(I)', scholarshipAmount: 1500000 },
  { id: 'user-003', name: '박도윤', universityId: '2020222222', department: '인공지능융합학과', year: 4, gpa: 4.4, incomeBracket: 3, status: '재학', scholarshipReceived: true, scholarshipName: 'AI융합인재 장학금', scholarshipAmount: 2000000 },
  { id: 'user-004', name: '최지아', universityId: '2023333333', department: '신문방송학과', year: 1, gpa: 3.5, incomeBracket: 2, status: '재학', scholarshipReceived: true, scholarshipName: '국가장학금 I유형', scholarshipAmount: 2600000 },
  { id: 'user-005', name: '정현우', universityId: '2021444444', department: '기계공학부', year: 3, gpa: 2.9, incomeBracket: 6, status: '휴학', scholarshipReceived: false },
];

// For DataDisclosureTool.tsx
export const MOCK_STATISTICS_DATA = {
    totalAmount: 12580000000,
    totalRecipients: 8720,
    internalCount: 6540,
    externalCount: 2180,
    byCategory: [
        { category: 'National', count: 4500, amount: 8000000000 },
        { category: 'Merit', count: 2500, amount: 3000000000 },
        { category: 'Financial', count: 1200, amount: 1000000000 },
        { category: 'Talent', count: 320, amount: 500000000 },
        { category: 'Other', count: 200, amount: 80000000 },
    ],
};

// For DualCreditVerificationTool.tsx
export interface FlaggedStudent {
  studentId: string;
  studentName: string;
  reason: 'Exceeds Tuition' | 'On Leave' | 'Graduated';
  details: string;
}

export const MOCK_FLAGGED_STUDENTS: FlaggedStudent[] = [
    { studentId: '2021987654', studentName: '강지훈', reason: 'Exceeds Tuition', details: '등록금 420만원, 수혜 총액 500만원 (+80만원)' },
    { studentId: '2021444444', studentName: '정현우', reason: 'On Leave', details: '2025-1학기 휴학 상태에서 장학금 지급됨.' },
];

// For ExternalScholarshipMonitorTool.tsx
export interface ScrapedScholarship {
    title: string;
    foundation: string;
    summary: string;
    applicationUrl: string;
    deadline: string;
    new: boolean;
}

export const MOCK_SCRAPED_SCHOLARSHIPS: ScrapedScholarship[] = [
    {
        title: '관정 이종환 교육재단 장학생',
        foundation: '관정 이종환 교육재단',
        summary: '대한민국의 미래를 이끌어갈 창의적이고 도전적인 인재를 지원합니다.',
        applicationUrl: '#',
        deadline: '2025-09-30',
        new: false,
    },
    {
        title: '일주학술문화재단 국내학사 장학생',
        foundation: '일주학술문화재단',
        summary: '어려운 환경 속에서도 학업에 정진하는 우수한 학생들을 지원합니다.',
        applicationUrl: '#',
        deadline: '2025-09-25',
        new: false,
    }
];


// For AdmissionCertificateTool.tsx
export const MOCK_INTERNATIONAL_STUDENTS: InternationalStudent[] = [
  { id: 'is-001', name: 'Michael Smith', nationality: 'USA', passportNo: 'US12345678', program: 'Korean Language Program' },
  { id: 'is-002', name: 'Chen Wei', nationality: 'China', passportNo: 'CN98765432', program: 'Exchange Student (Business)' },
  { id: 'is-003', name: 'Yuki Tanaka', nationality: 'Japan', passportNo: 'JP55566677', program: 'M.Sc. Computer Science' },
  { id: 'is-004', name: 'Linh Nguyen', nationality: 'Vietnam', passportNo: 'VN88899900', program: 'Ph.D. Agriculture' },
  { id: 'is-005', name: 'Hans Müller', nationality: 'Germany', passportNo: 'DE11122233', program: 'Exchange Student (Engineering)' },
];
