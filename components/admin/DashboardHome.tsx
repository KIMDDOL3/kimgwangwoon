import React from 'react';
import { AllScholarships, ApplicationData, QnaItem } from '../../types';
import { AdminView } from './AdminDashboard';
import Card from '../ui/Card';
import AdminStats from './AdminStats';
import ApplicationStats from './ApplicationStats';
import WeeklyAutomationLog from './WeeklyAutomationLog';

interface DashboardHomeProps {
    scholarships: AllScholarships[];
    applicationData: ApplicationData[];
    qnaData: QnaItem[];
    setView: (view: AdminView) => void;
}

const QuickLink: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, value, icon, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
        <div className="flex items-center">
            {icon}
            <div className="ml-4">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>
            </div>
        </div>
    </button>
);


const DashboardHome: React.FC<DashboardHomeProps> = ({ scholarships, applicationData, qnaData, setView }) => {

    const unansweredQna = qnaData.filter(q => q.status === 'Unanswered').length;
    const pendingApplications = applicationData.filter(a => a.status === 'Applied').length;

    return (
        <div className="space-y-8 animate-fade-in">
            <Card>
                 <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <span className="text-gradient-aurora">관리자 대시보드</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    현재 장학금 현황과 처리해야 할 주요 업무를 한눈에 파악하세요.
                </p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        <span className="text-gradient-aurora">주요 업무 바로가기</span>
                    </h3>
                    <div className="space-y-4">
                        <QuickLink
                            title="장학금 관리"
                            value={`${scholarships.length}개의 장학금 운영 중`}
                            icon={<div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg></div>}
                            onClick={() => setView('scholarships')}
                        />
                         <QuickLink
                            title="신청서 처리"
                            value={`${pendingApplications}건의 신청서 검토 필요`}
                            icon={<div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-300" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804V4.804A7.968 7.968 0 0014.5 4z" /></svg></div>}
                            onClick={() => setView('applications')}
                        />
                         <QuickLink
                            title="Q&A 답변"
                            value={`${unansweredQna}개의 미답변 질문`}
                            icon={<div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.083-3.083A7.002 7.002 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.75 9.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" /></svg></div>}
                            onClick={() => setView('qna')}
                        />
                    </div>
                </Card>
                <div>
                    <AdminStats scholarships={scholarships} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ApplicationStats applications={applicationData} />
                <WeeklyAutomationLog />
            </div>
        </div>
    );
};

export default DashboardHome;