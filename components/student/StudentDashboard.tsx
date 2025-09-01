import React, { useState } from 'react';
import { User, AllScholarships, AppNotification } from '../../types';
import ProfileCard from './ProfileCard';
import ChatInterface from './ChatInterface';
import ApplicationHistory from './ApplicationHistory';
import ScholarshipHubPreview from './hub/ScholarshipHubPreview';
import ScholarshipHub from './hub/ScholarshipHub';
import GpaSearchCard from './GpaSearchCard';
import Button from '../ui/Button';
import NationalScholarshipCard from './NationalScholarshipCard';
import NotificationBell from './NotificationBell';
import ContactAdminCard from './ContactAdminCard';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  allScholarships: AllScholarships[];
  notifications: AppNotification[];
  onDismissNotification: (id: string) => void;
  onDismissAllNotifications: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
    user, 
    onLogout, 
    allScholarships, 
    notifications, 
    onDismissNotification,
    onDismissAllNotifications
}) => {
  const [view, setView] = useState<'dashboard' | 'hub'>('dashboard');
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);

  const handleNavigateToHub = () => setView('hub');
  const handleNavigateToDashboard = () => setView('dashboard');
  const handlePromptConsumed = () => setInitialChatPrompt(null);

  const handleAskAi = (scholarshipTitle: string) => {
    setInitialChatPrompt(`'${scholarshipTitle}' 장학금에 대해 자세히 알려줘.`);
    setView('dashboard');
  };
  
  if (view === 'hub') {
    return <ScholarshipHub onBack={handleNavigateToDashboard} onAskAi={handleAskAi} allScholarships={allScholarships} />;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="min-h-screen bg-black/10 dark:bg-black/40 backdrop-blur-sm">
        <header className="bg-blue-800/80 backdrop-blur-md text-white shadow-lg p-4 sticky top-0 z-20 border-b border-white/20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">전남대학교 장학금 Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-200 hidden md:block">
                환영합니다, <span className="font-semibold">{user.name}</span>님
              </span>
              <NotificationBell 
                notifications={notifications}
                onDismiss={onDismissNotification}
                onDismissAll={onDismissAllNotifications}
                onAskAi={handleAskAi}
                allScholarships={allScholarships}
              />
              <Button onClick={onLogout} variant="secondary">
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard user={user} />
              <NationalScholarshipCard allScholarships={allScholarships} onAskAi={handleAskAi} />
              <GpaSearchCard allScholarships={allScholarships} onAskAi={handleAskAi} />
              <ScholarshipHubPreview onNavigate={handleNavigateToHub} allScholarships={allScholarships} />
              <ApplicationHistory />
              <ContactAdminCard />
            </div>

            <div className="lg:col-span-2">
              <ChatInterface 
                user={user} 
                initialPrompt={initialChatPrompt}
                onPromptConsumed={handlePromptConsumed}
                allScholarships={allScholarships}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;