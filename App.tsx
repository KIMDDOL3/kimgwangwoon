
import React, { useState, useCallback, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { User, Role, AllScholarships, AppNotification, ApplicationData, ApplicationStatus } from './types';
import { ALL_SCHOLARSHIPS as INITIAL_SCHOLARSHIPS, MOCK_USER } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [scholarships, setScholarships] = useState<AllScholarships[]>(INITIAL_SCHOLARSHIPS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [applicationData, setApplicationData] = useState<ApplicationData[]>([]);

  const loadApplicationData = useCallback(() => {
    try {
      const storedData = localStorage.getItem('jnu_scholarship_applications');
      if (storedData) {
        setApplicationData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load application data:", error);
      setApplicationData([]);
    }
  }, []);

  useEffect(() => {
    loadApplicationData();
    const handleStorageChange = () => loadApplicationData();
    window.addEventListener('applicationSubmitted', handleStorageChange);
    window.addEventListener('storage', handleStorageChange); // Also listen for direct storage changes
    return () => {
      window.removeEventListener('applicationSubmitted', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadApplicationData]);
  
  const handleUpdateApplicationStatus = (
    userId: string,
    scholarshipId: string,
    submissionDate: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      const storedData = localStorage.getItem('jnu_scholarship_applications');
      if (storedData) {
        let applications: ApplicationData[] = JSON.parse(storedData);
        const appIndex = applications.findIndex(
          (app) =>
            app.userId === userId &&
            app.scholarshipId === scholarshipId &&
            app.submissionDate === submissionDate
        );

        if (appIndex !== -1) {
          applications[appIndex].status = newStatus;
          localStorage.setItem('jnu_scholarship_applications', JSON.stringify(applications));
          loadApplicationData(); // Reload data to reflect changes
          // Dispatch event to notify other components if needed
          window.dispatchEvent(new CustomEvent('applicationUpdated'));
        }
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };


  const handleRoleSelect = (selectedRole: Role) => {
    setUser(MOCK_USER);
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
      return <LoginScreen onRoleSelect={handleRoleSelect} />;
    }

    if (role === 'student') {
      return (
        <StudentDashboard 
            user={user} 
            onLogout={handleLogout} 
            allScholarships={scholarships}
            notifications={notifications}
            onDismissNotification={handleDismissNotification}
            onDismissAllNotifications={handleDismissAllNotifications}
        />
      );
    }

    if (role === 'admin') {
      return (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
          scholarships={scholarships}
          onAdd={handleAddScholarship}
          onUpdate={handleUpdateScholarship}
          onDelete={handleDeleteScholarship}
          onPushNotification={handlePushNotification}
          applicationData={applicationData}
          onUpdateStatus={handleUpdateApplicationStatus}
        />
      );
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;