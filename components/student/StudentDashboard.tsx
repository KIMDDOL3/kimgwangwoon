import React, { useState } from 'react';
// FIX: Corrected import path
import { User, AllScholarships, AppNotification, QnaItem } from '../../types';
import ProfileCard from './ProfileCard';
import ChatInterface from './ChatInterface';
import ApplicationHistory from './ApplicationHistory';
import ScholarshipHubPreview from './hub/ScholarshipHubPreview';
import ScholarshipHub from './hub/ScholarshipHub';
import GpaSearchCard from './GpaSearchCard';
import Button from '../ui/Button';
import NationalScholarshipCard from './NationalScholarshipCard';
import NotificationBell from './NotificationBell';
import JnuNoticeCard from './JnuNoticeCard';
import StudentQnaBoard from './qna/StudentQnaBoard';
import QnaCard from './qna/QnaCard';
interface StudentDashboardProps {
    user: User;
    onLogout: () => void;
    allScholarships: AllScholarships[];
    notifications: AppNotification[];
    onDismissNotification: (id: string) => void;
    onDismissAllNotifications: () => void;
    qnaData: QnaItem[];
    onAddQuestion: (newQuestion: Omit<QnaItem, 'id' | 'date' | 'status'>) => void;
}
type StudentView = 'dashboard' | 'hub' | 'qna';
const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, allScholarships, notifications, onDismissNotification, onDismissAllNotifications, qnaData, onAddQuestion }) => {
    const [view, setView] = useState<StudentView>('dashboard');
    const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);
    const handleNavigateTo = (targetView: StudentView) => setView(targetView);
    const handlePromptConsumed = () => setInitialChatPrompt(null);
    const handleAskAi = (scholarshipTitle: string) => {
        setInitialChatPrompt(`'${scholarshipTitle}' 장학금에 대해 자세히 알려줘.`);
        setView('dashboard');
    };
    if (view === 'hub') {
        return <ScholarshipHub user={user} onBack={() => handleNavigateTo('dashboard')} onAskAi={handleAskAi} allScholarships={allScholarships}/>;
    }
    if (view === 'qna') {
        return <StudentQnaBoard user={user} qnaData={qnaData} onAddQuestion={onAddQuestion} onBack={() => handleNavigateTo('dashboard')}/>;
    }
    return (<div className="min-h-screen">
        <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg text-white shadow-md p-4 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700/80">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">전남대학교 장학금 Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300 hidden md:block">
                환영합니다, <span className="font-semibold">{user.name}</span>님
              </span>
              <NotificationBell notifications={notifications} onDismiss={onDismissNotification} onDismissAll={onDismissAllNotifications} onAskAi={handleAskAi} allScholarships={allScholarships}/>
              <Button onClick={onLogout} variant="secondary">
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* JNU Banner */}
            <a href="https://www.jnu.ac.kr" target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-lg group relative">
                <img src="https://storage.cloud.google.com/personmate/test.png" alt="전남대학교 AI 서머스쿨" className="w-full h-48 object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col items-center justify-center p-4 text-center">
                    <h2 className="font-nanum text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-wide transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:-translate-y-2">
                        지역과 함께 세계로 미래로
                    </h2>
                    <p className="text-white/80 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                        전남대학교 홈페이지 바로가기
                    </p>
                </div>
            </a>
            
            {/* JNU Notice Card */}
            <JnuNoticeCard />
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ProfileCard user={user}/>
                <NationalScholarshipCard allScholarships={allScholarships} onAskAi={handleAskAi}/>
                <GpaSearchCard allScholarships={allScholarships} onAskAi={handleAskAi}/>
                <ScholarshipHubPreview onNavigate={() => handleNavigateTo('hub')} allScholarships={allScholarships}/>
                <ApplicationHistory />
                <QnaCard onNavigate={() => handleNavigateTo('qna')} qnaData={qnaData}/>
              </div>

              <div className="lg:col-span-2">
                <ChatInterface user={user} initialPrompt={initialChatPrompt} onPromptConsumed={handlePromptConsumed} allScholarships={allScholarships}/>
              </div>
            </div>
          </div>
        </main>
    </div>);
};
export default StudentDashboard;