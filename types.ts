
export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  universityId: string;
  department: string;
  year: number;
}

export type ScholarshipCategory = 'National' | 'Merit' | 'Financial' | 'Talent' | 'Other';
export type ScholarshipSource = 'Internal' | 'External';

export interface ScholarshipRequirements {
  incomeBracket?: number;
  minGpa?: number;
  allowedYears?: number[];
  allowedDepartments?: string[];
}

export interface AllScholarships {
  id: string;
  title: string;
  category: ScholarshipCategory;
  source: ScholarshipSource;
  provider: string;
  summary: string;
  deadline: string;
  applicationUrl: string;
  fullDescription: string;
  requirements?: ScholarshipRequirements;
}

export interface ScoredScholarship extends AllScholarships {
  score: number;
  reasons: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  scholarshipId: string;
}

export type ApplicationStatus = 'Applied' | 'Awarded' | 'Rejected';

export interface ApplicationData {
  scholarshipId: string;
  scholarshipTitle: string;
  userId: string;
  userName: string;
  universityId: string;
  statement: string;
  submissionDate: string;
  status: ApplicationStatus;
  fileName?: string;
}

export type QnaStatus = 'Unanswered' | 'Answered';

export interface QnaItem {
    id: string;
    question: string;
    answer?: string;
    studentName: string;
    studentId: string;
    date: string;
    status: QnaStatus;
}

export interface DiagnosticQuestion {
  key: keyof DiagnosticAnswers;
  text: string;
  type: 'number-input' | 'single-choice';
  options?: { label: string; value: number | string }[];
}

export interface DiagnosticAnswers {
  gpa?: number;
  incomeBracket?: number;
  year?: number;
  department?: string;
}

export interface ExternalScholarship {
  id: string;
  title: string;
  foundation: string;
  summary: string;
  applicationUrl: string;
  deadline: string;
}

// FIX: Moved ManualEntry here to be globally accessible and avoid type conflicts.
export interface ManualEntry {
    id: string;
    category: 'Scholarship' | 'Application' | 'System' | 'RPA';
    keywords: string[];
    question: string;
    answer: string;
}

export interface ChatMessage {
  id: string;
  text?: string;
  sender: 'user' | 'bot';
  isLoading?: boolean;
  // FIX: Updated sources to be a union type to support both student and admin chat contexts.
  sources?: (AllScholarships | ExternalScholarship | ManualEntry)[];
  recommendations?: ScoredScholarship[];
  actions?: { text: string; handler: () => void }[];
}

export interface StudentProfile {
    id: string;
    name: string;
    universityId: string;
    department: string;
    year: number;
    gpa: number;
    incomeBracket: number;
    status: '재학' | '휴학';
    scholarshipReceived: boolean;
    scholarshipName?: string;
    scholarshipAmount?: number;
}

export type RpaTaskStatus = 'Completed' | 'In Progress' | 'Planned';

export interface InternationalStudent {
  id: string;
  name: string;
  nationality: string;
  passportNo: string;
  program: string;
}

export interface CollaborationChannel {
    id: string; // e.g., 'chan-s001'
    scholarshipId: string;
    scholarshipTitle: string;
    createdAt: string;
}

export interface ChannelMessage {
    id:string; // e.g., 'msg-timestamp'
    channelId: string;
    senderId: string; // admin user id
    senderName: string; // admin user name
    text: string;
    timestamp: string; // ISO string
}