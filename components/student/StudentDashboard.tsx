
import React, { useState, useMemo } from 'react';
// FIX: Corrected import path and added new types
import { User, AllScholarships, AppNotification, QnaItem, ChatMessage, ApplicationData, ScoredScholarship, DiagnosticAnswers } from '../../types';
import ProfileCard from './ProfileCard';
import ChatInterface from './ChatInterface';
import ApplicationHistory from './ApplicationHistory';
import ScholarshipHubPreview from './hub/ScholarshipHubPreview';
import ScholarshipHub from './hub/ScholarshipHub';
import Button from '../ui/Button';
import NationalScholarshipCard from './NationalScholarshipCard';
import NotificationBell from './NotificationBell';
import JnuNoticeCard from './JnuNoticeCard';
import StudentQnaBoard from './qna/StudentQnaBoard';
import QnaCard from './qna/QnaCard';
import ScholarshipDetailModal from './ScholarshipDetailModal';
import ApplicationModal from './ApplicationModal';
import { scoreScholarships } from '../../utils/scoring';
import RecommendedScholarships from './RecommendedScholarships';
import GpaSearchCard from './GpaSearchCard';

interface StudentDashboardProps {
    user: User;
    onLogout: () => void;
    allScholarships: AllScholarships[];
    notifications: AppNotification[];
    onDismissNotification: (id: string) => void;
    onDismissAllNotifications: () => void;
    qnaData: QnaItem[];
    onAddQuestion: (newQuestion: Omit<QnaItem, 'id' | 'date' | 'status'>) => void;
    isLoading: boolean;
    chatHistory: ChatMessage[];
    onSaveChatHistory: (newHistory: ChatMessage[]) => void;
}
type StudentView = 'dashboard' | 'hub' | 'qna';
const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, allScholarships, notifications, onDismissNotification, onDismissAllNotifications, qnaData, onAddQuestion, isLoading, chatHistory, onSaveChatHistory }) => {
    const [view, setView] = useState<StudentView>('dashboard');
    const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);

    const [selectedScholarship, setSelectedScholarship] = useState<AllScholarships | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

    const recommendedScholarships = useMemo((): ScoredScholarship[] => {
        // For demo purposes, we'll use the user's profile and add mock data for GPA and income bracket,
        // as the base User object doesn't contain them. In a real app, this data would come from the user's profile.
        const studentAnswers: DiagnosticAnswers = {
            gpa: 3.8, // Mock GPA for '김광운'
            incomeBracket: 6, // Mock income bracket for '김광운'
            year: user.year,
            department: user.department,
        };
        // Filter for scholarships that have requirements to be scored
        const scorableScholarships = allScholarships.filter(s => s.requirements);
        return scoreScholarships(studentAnswers, scorableScholarships);
    }, [user, allScholarships]);


    const handleNavigateTo = (targetView: StudentView) => setView(targetView);
    const handlePromptConsumed = () => setInitialChatPrompt(null);
    
    const handleAskAi = (scholarshipTitle: string) => {
        setInitialChatPrompt(`'${scholarshipTitle}' 장학금에 대해 자세히 알려줘.`);
        setView('dashboard'); // Ensure chat is visible
    };

    const handleNoticeClick = (scholarship: AllScholarships) => {
        setSelectedScholarship(scholarship);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedScholarship(null);
    };
    
    const handleApplyClick = (scholarship: AllScholarships) => {
        setSelectedScholarship(scholarship);
        setIsDetailModalOpen(false); // Close detail if it was open
        setIsApplicationModalOpen(true);
    };

    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false);
        setSelectedScholarship(null);
    };
    
    const handleApplicationSubmit = (statement: string, file?: File) => {
        if (!selectedScholarship) return;
        
        const applicationData: ApplicationData = {
          scholarshipId: selectedScholarship.id,
          scholarshipTitle: selectedScholarship.title,
          userId: user.id,
          userName: user.name,
          universityId: user.universityId,
          statement: statement,
          submissionDate: new Date().toISOString().split('T')[0],
          status: 'Applied',
          fileName: file?.name,
        };

        try {
          const LOCAL_STORAGE_KEY = 'jnu_scholarship_applications';
          const storedApplicationsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
          const applications: ApplicationData[] = storedApplicationsRaw ? JSON.parse(storedApplicationsRaw) : [];
          applications.push(applicationData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
          window.dispatchEvent(new CustomEvent('dataChanged'));
        } catch (error) {
          console.error("Failed to save application to local storage:", error);
        }

        alert(`${applicationData.scholarshipTitle} 장학금 신청이 완료되었습니다.`);
        handleCloseApplicationModal();
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
            <a href="https://www.jnu.ac.kr" target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-lg group">
                <img src="https://storage.googleapis.com/personmate/test.png" alt="JNU Banner" className="w-full h-48 object-cover object-center"/>
            </a>
            
            {/* JNU Notice Card */}
            <JnuNoticeCard 
                isLoading={isLoading} 
                allScholarships={allScholarships}
                onNoticeClick={handleNoticeClick}
            />
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ProfileCard user={user}/>

                {recommendedScholarships.length > 0 && (
                    <RecommendedScholarships user={user} scholarships={recommendedScholarships} />
                )}
                
                <NationalScholarshipCard allScholarships={allScholarships} onAskAi={handleAskAi}/>
                <ScholarshipHubPreview onNavigate={() => handleNavigateTo('hub')} allScholarships={allScholarships}/>
                <ApplicationHistory isLoading={isLoading} />
                <QnaCard onNavigate={() => handleNavigateTo('qna')} qnaData={qnaData}/>
              </div>

              <div className="lg:col-span-2">
                <ChatInterface 
                  user={user} 
                  initialPrompt={initialChatPrompt} 
                  onPromptConsumed={handlePromptConsumed} 
                  allScholarships={allScholarships}
                  initialMessages={chatHistory}
                  onSaveHistory={onSaveChatHistory}
                />
              </div>
            </div>
          </div>
        </main>
        
        {isDetailModalOpen && selectedScholarship && (
          <ScholarshipDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            scholarship={selectedScholarship}
            onApply={handleApplyClick}
            onAskAi={(title) => {
              handleCloseDetailModal();
              handleAskAi(title);
            }}
          />
        )}

        {isApplicationModalOpen && selectedScholarship && (
            <ApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={handleCloseApplicationModal}
                onSubmit={handleApplicationSubmit}
                scholarship={selectedScholarship}
                user={user}
            />
        )}
    </div>);
};
export default StudentDashboard;