
import React, { useState } from 'react';
// FIX: Corrected import for ApplicationStatus type
import { User, AllScholarships, ApplicationData, QnaItem, ApplicationStatus } from '../../types';
import ScholarshipManagementTable from './ScholarshipManagementTable';
import ApplicationManagementTable from './ApplicationManagementTable';
import AutomationTools from './automation/AutomationTools';
import StudentLookupTool from './StudentLookupTool';
import InternationalAffairsDashboard from './international/InternationalAffairsDashboard';
// FIX: Corrected import path for AdminChatInterface
import AdminChatInterface from './chat/AdminChatInterface';
import QnaBoard from './QnaBoard';
import DashboardHome from './DashboardHome';
import RpaDashboard from './RpaDashboard';

interface AdminDashboardProps {
    user: User;
    onLogout: () => void;
    scholarships: AllScholarships[];
    onAdd: (scholarship: AllScholarships) => void;
    onUpdate: (scholarship: AllScholarships) => void;
    onDelete: (scholarshipId: string) => void;
    onPushNotification: (scholarship: AllScholarships, message: string) => void;
    applicationData: ApplicationData[];
    onUpdateStatus: (userId: string, scholarshipId: string, submissionDate: string, newStatus: ApplicationStatus) => void;
    qnaData: QnaItem[];
    onUpdateAnswer: (qnaId: string, answer: string) => void;
}

export type AdminView = 'home' | 'scholarships' | 'applications' | 'qna' | 'automation' | 'rpa' | 'student-lookup' | 'international' | 'chat';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const { user, onLogout, scholarships, onAdd, onUpdate, onDelete, onPushNotification, applicationData, onUpdateStatus, qnaData, onUpdateAnswer } = props;
    const [view, setView] = useState<AdminView>('home');

    // FIX: Made `targetView` and `icon` props optional to support section headers, resolving a TypeScript error.
    const NavLink: React.FC<{
        targetView?: AdminView;
        icon?: React.ReactNode;
        label: string;
        subLabel?: string;
        isSection?: boolean;
    }> = ({ targetView, icon, label, subLabel, isSection = false }) => {
        if (isSection) {
            return <h3 className="px-3 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h3>;
        }
        const isActive = view === targetView;
        return (
            <button
                onClick={() => targetView && setView(targetView)}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
                {icon}
                <span className="flex-1 text-left">{label}</span>
                {subLabel && <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">{subLabel}</span>}
            </button>
        );
    };
    
    const renderContent = () => {
        switch(view) {
            case 'home':
                return <DashboardHome scholarships={scholarships} applicationData={applicationData} qnaData={qnaData} setView={setView} />;
            case 'scholarships':
                return <ScholarshipManagementTable scholarships={scholarships} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} onPushNotification={onPushNotification} />;
            case 'applications':
                return <ApplicationManagementTable applications={applicationData} onUpdateStatus={onUpdateStatus} />;
            case 'qna':
                return <QnaBoard qnaItems={qnaData} onSaveAnswer={onUpdateAnswer} />;
            case 'automation':
                return <AutomationTools />;
            case 'rpa':
                return <RpaDashboard />;
            case 'student-lookup':
                return <StudentLookupTool allScholarships={scholarships} allApplications={applicationData} />;
            case 'international':
                 return <InternationalAffairsDashboard />;
            case 'chat':
                 return <AdminChatInterface />;
            default:
                return <div>페이지를 찾을 수 없습니다.</div>
        }
    };
    
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 px-2 mb-6">
                    <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </div>
                    <h1 className="text-lg font-black text-gray-800 dark:text-white">Admin Portal</h1>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto">
                    <NavLink targetView="home" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} label="대시보드" />
                    <NavLink targetView="scholarships" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>} label="장학금 관리" />
                    <NavLink targetView="applications" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804V4.804A7.968 7.968 0 0014.5 4z" /></svg>} label="신청서 관리" subLabel={`${applicationData.length}`} />
                    <NavLink targetView="qna" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.083-3.083A7.002 7.002 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.75 9.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" /></svg>} label="Q&A 관리" subLabel={`${qnaData.filter(q => q.status === 'Unanswered').length}`} />
                    
                    <NavLink isSection label="Tools & Automation" />
                    <NavLink targetView="rpa" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>} label="RPA 대시보드" />
                    <NavLink targetView="automation" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>} label="자동화 허브" />
                    <NavLink targetView="student-lookup" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>} label="학생 조회" />
                    <NavLink targetView="international" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" /><path d="M12.586 5.586a2 2 0 012.828 0 2 2 0 010 2.828l-3 3a2 2 0 01-2.828 0 2 2 0 010-2.828l3-3zM8.414 11.586a2 2 0 01-2.828 0 2 2 0 010-2.828l3-3a2 2 0 012.828 0 2 2 0 010 2.828l-3 3z" /></svg>} label="국제협력과" />
                    <NavLink targetView="chat" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h7a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>} label="AI 업무 매뉴얼" />
                </nav>

                <div className="mt-auto">
                    <div className="p-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg text-center">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.department}</p>
                    </div>
                     <button onClick={onLogout} className="w-full mt-3 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
