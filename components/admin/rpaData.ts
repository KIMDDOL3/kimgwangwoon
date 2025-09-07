
import { RpaTaskStatus } from '../../types';

export interface RpaTask {
    id: string;
    title: string;
    category: string;
    annualHours: number;
    errorRisk: number; // Scale 1-5
    automationSuitability: number; // Scale 1-5
    priority: 'High' | 'Medium' | 'Low';
    status: RpaTaskStatus;
}

export const RPA_TASKS: RpaTask[] = [
    { id: 'task-01', title: '국가근로장학생 출근부 검증', category: 'Student Support', annualHours: 480, errorRisk: 4, automationSuitability: 5, priority: 'High', status: 'Completed' },
    { id: 'task-02', title: '신규 장학금 공고 모니터링', category: 'Scholarship Admin', annualHours: 240, errorRisk: 2, automationSuitability: 4.8, priority: 'High', status: 'In Progress' },
    { id: 'task-03', title: '정보공시 통계자료 생성', category: 'Compliance', annualHours: 160, errorRisk: 5, automationSuitability: 4.5, priority: 'High', status: 'In Progress' },
    { id: 'task-04', title: '교외장학재단 학적조회 회신', category: 'External Affairs', annualHours: 300, errorRisk: 3, automationSuitability: 4.2, priority: 'Medium', status: 'In Progress' },
    { id: 'task-05', title: '학자금 대출 및 이중수혜 검증', category: 'Compliance', annualHours: 200, errorRisk: 5, automationSuitability: 4.0, priority: 'Medium', status: 'Planned' },
    { id: 'task-06', title: '장학금 신청서류 자격요건 1차 검토', category: 'Application Review', annualHours: 600, errorRisk: 3, automationSuitability: 3.5, priority: 'Low', status: 'Planned' },
];

export const RPA_DASHBOARD_STATS = {
    annualTimeSaved: 1980,
    accuracyImprovement: 99.8,
    automatedTasksCount: RPA_TASKS.filter(t => t.status === 'Completed').length,
};

export const STATUS_CONFIG: Record<RpaTaskStatus, { label: string; className: string; }> = {
    'Completed': { label: '자동화 완료', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    'In Progress': { label: '진행 중', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    'Planned': { label: '계획됨', className: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
};

// FIX: Added AutomationLog interface and MOCK_AUTOMATION_LOGS data to resolve import errors in WeeklyAutomationLog.tsx.
export interface AutomationLog {
    id: string;
    taskName: string;
    itemsProcessed: number;
    timestamp: string;
    status: 'Completed' | 'Completed with Errors';
}

export const MOCK_AUTOMATION_LOGS: AutomationLog[] = [
    { id: 'log-1', taskName: '외국인 유학생 입학허가서 발급', itemsProcessed: 5, timestamp: '2025-09-08 14:30', status: 'Completed with Errors' },
    { id: 'log-2', taskName: '국가근로장학생 출근부 검증', itemsProcessed: 32, timestamp: '2025-09-08 10:05', status: 'Completed' },
    { id: 'log-3', taskName: '교외장학재단 학적조회 회신', itemsProcessed: 1, timestamp: '2025-09-07 16:20', status: 'Completed' },
    { id: 'log-4', taskName: '국가근로장학생 출근부 검증', itemsProcessed: 28, timestamp: '2025-09-06 09:55', status: 'Completed' },
    { id: 'log-5', taskName: '정보공시 통계자료 생성', itemsProcessed: 1, timestamp: '2025-09-05 17:00', status: 'Completed' },
];
