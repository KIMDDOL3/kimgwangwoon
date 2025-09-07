import React, { useState, useCallback, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import StudentDashboard from "./components/student/StudentDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
// FIX: Corrected import path for types
import { User, Role, AllScholarships, AppNotification, ApplicationData, ApplicationStatus, QnaItem } from "./types";
import { ALL_SCHOLARSHIPS as INITIAL_SCHOLARSHIPS, MOCK_ADMIN_USER, MOCK_STUDENT_USER } from "./constants";
import { MOCK_QNA_DATA } from "./components/admin/qnaData";
const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [scholarships, setScholarships] = useState<AllScholarships[]>(INITIAL_SCHOLARSHIPS);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [applicationData, setApplicationData] = useState<ApplicationData[]>([]);
    const [qnaData, setQnaData] = useState<QnaItem[]>([]);
    const loadDataFromLocalStorage = useCallback((key: string, setter: Function, initialData: any[] = []) => {
        try {
            const storedData = localStorage.getItem(key);
            if (storedData) {
                setter(JSON.parse(storedData));
            }
            else {
                // Seed with mock data if nothing is in local storage
                localStorage.setItem(key, JSON.stringify(initialData));
                setter(initialData);
            }
        }
        catch (error) {
            console.error(`Failed to load ${key} data:`, error);
            setter([]);
        }
    }, []);
    useEffect(() => {
        loadDataFromLocalStorage('jnu_scholarship_applications', setApplicationData);
        loadDataFromLocalStorage('jnu_qna_items', setQnaData, MOCK_QNA_DATA);
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'jnu_scholarship_applications') {
                loadDataFromLocalStorage('jnu_scholarship_applications', setApplicationData);
            }
            if (e.key === 'jnu_qna_items') {
                loadDataFromLocalStorage('jnu_qna_items', setQnaData, MOCK_QNA_DATA);
            }
        };
        const handleCustomEvent = () => {
            loadDataFromLocalStorage('jnu_scholarship_applications', setApplicationData);
            loadDataFromLocalStorage('jnu_qna_items', setQnaData, MOCK_QNA_DATA);
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('dataChanged', handleCustomEvent);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('dataChanged', handleCustomEvent);
        };
    }, [loadDataFromLocalStorage]);
    const handleUpdateApplicationStatus = (userId: string, scholarshipId: string, submissionDate: string, newStatus: ApplicationStatus) => {
        try {
            const updatedData = applicationData.map(app => (app.userId === userId && app.scholarshipId === scholarshipId && app.submissionDate === submissionDate)
                ? { ...app, status: newStatus }
                : app);
            localStorage.setItem('jnu_scholarship_applications', JSON.stringify(updatedData));
            setApplicationData(updatedData);
            window.dispatchEvent(new CustomEvent('dataChanged'));
        }
        catch (error) {
            console.error('Failed to update application status:', error);
        }
    };
    const handleAddQuestion = (newQuestion: Omit<QnaItem, 'id' | 'date' | 'status'>) => {
        const questionToAdd: QnaItem = {
            ...newQuestion,
            id: `qna-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Unanswered',
        };
        const updatedQnaData = [questionToAdd, ...qnaData];
        localStorage.setItem('jnu_qna_items', JSON.stringify(updatedQnaData));
        setQnaData(updatedQnaData);
        window.dispatchEvent(new CustomEvent('dataChanged'));
        alert('질문이 성공적으로 제출되었습니다.');
    };
    const handleUpdateAnswer = (qnaId: string, answer: string) => {
        const updatedQnaData = qnaData.map(item => item.id === qnaId
            ? { ...item, answer: answer, status: 'Answered' as const }
            : item);
        localStorage.setItem('jnu_qna_items', JSON.stringify(updatedQnaData));
        setQnaData(updatedQnaData);
        window.dispatchEvent(new CustomEvent('dataChanged'));
    };
    const handleRoleSelect = (selectedRole: Role) => {
        if (selectedRole === 'student') {
            setUser(MOCK_STUDENT_USER);
        } else {
            setUser(MOCK_ADMIN_USER);
        }
        setRole(selectedRole);
    };
    const handleLogout = () => {
        setUser(null);
        setRole(null);
        setNotifications([]); // Clear notifications on logout
    };
    const handleAddScholarship = (newScholarship: AllScholarships) => {
        setScholarships(prev => [...prev, { ...newScholarship, id: `new-${Date.now()}` }]);
    };
    const handlePushNotification = (scholarship: AllScholarships, message: string) => {
        const newNotification: AppNotification = {
            id: `notif-${Date.now()}`,
            title: scholarship.title, // Use scholarship title
            message: message, // Use custom message from admin
            scholarshipId: scholarship.id,
        };
        setNotifications(prev => [newNotification, ...prev]);
        alert(`'${scholarship.title}' 장학금에 대한 알림을 학생들에게 전송했습니다.`);
    };
    const handleDismissNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };
    const handleDismissAllNotifications = () => {
        setNotifications([]);
    };
    const handleUpdateScholarship = (updatedScholarship: AllScholarships) => {
        setScholarships(prev => prev.map(s => s.id === updatedScholarship.id ? updatedScholarship : s));
    };
    const handleDeleteScholarship = (scholarshipId: string) => {
        if (window.confirm('정말로 이 장학금 정보를 삭제하시겠습니까?')) {
            setScholarships(prev => prev.filter(s => s.id !== scholarshipId));
        }
    };
    const renderContent = () => {
        if (!user || !role) {
            return <LoginScreen onRoleSelect={handleRoleSelect}/>;
        }
        if (role === 'student') {
            return (<StudentDashboard user={user} onLogout={handleLogout} allScholarships={scholarships} notifications={notifications} onDismissNotification={handleDismissNotification} onDismissAllNotifications={handleDismissAllNotifications} qnaData={qnaData.filter(q => q.studentId === user.universityId)} onAddQuestion={handleAddQuestion}/>);
        }
        if (role === 'admin') {
            return (<AdminDashboard user={user} onLogout={handleLogout} scholarships={scholarships} onAdd={handleAddScholarship} onUpdate={handleUpdateScholarship} onDelete={handleDeleteScholarship} onPushNotification={handlePushNotification} applicationData={applicationData} onUpdateStatus={handleUpdateApplicationStatus} qnaData={qnaData} onUpdateAnswer={handleUpdateAnswer}/>);
        }
    };
    return (<div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans">
      {renderContent()}
    </div>);
};
export default App;