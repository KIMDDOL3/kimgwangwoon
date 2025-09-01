export interface User {
  id: string;
  name: string;
  universityId: string;
  department: string;
  year: number;
}

export type Role = 'student' | 'admin';

export type ScholarshipCategory = 'Merit-based' | 'Need-based' | 'Talent-based' | 'External' | 'Other';
export type ScholarshipSource = 'Internal' | 'External';

export interface ScholarshipRequirements {
    minGpa?: number;
    allowedYears?: number[];
    allowedDepartments?: string[];
    incomeBracket?: number; 
}

export interface Scholarship {
  id: string;
  title: string;
  category: ScholarshipCategory;
  summary: string;
  fullDescription: string;
  requirements: ScholarshipRequirements;
  applicationUrl: string;
  deadline: string;
}

export interface ExternalScholarship {
  id: string;
  title: string;
  foundation: string;
  summary: string;
  applicationUrl: string;
  deadline: string;
  category: ScholarshipCategory;
}

// A unified type for easier processing
export type AllScholarships = {
  id: string;
  title: string;
  category: ScholarshipCategory;
  source: ScholarshipSource;
  provider: string; // University name or Foundation name
  summary: string;
  deadline: string;
  applicationUrl: string;
  fullDescription: string;
  requirements?: ScholarshipRequirements; // Optional for external, but available for internal
};


export interface ScoredScholarship extends Scholarship {
  score: number;
  reasons: string[];
}

export interface ChatMessage {
  id:string;
  text?: string;
  sender: 'user' | 'bot';
  recommendations?: ScoredScholarship[];
  // FIX: Broadened the type to allow both unified `AllScholarships` and raw `ExternalScholarship` objects as sources.
  sources?: (AllScholarships | ExternalScholarship)[];
  actions?: { text: string; handler: () => void }[];
  isLoading?: boolean;
}

export type DiagnosticQuestionType = 'single-choice' | 'number-input';

export interface DiagnosticQuestion {
  id: string;
  key: keyof User | 'gpa' | 'incomeBracket';
  text: string;
  type: DiagnosticQuestionType;
  options?: { label: string; value: string | number }[];
}

export type DiagnosticAnswers = {
  [key: string]: string | number;
};

export interface FAQItem {
  question: string;
  answer: string;
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
}

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    scholarshipId: string;
}