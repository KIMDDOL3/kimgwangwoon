
import React, { useState, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { User, Role, AllScholarships, AppNotification } from './types';
import { ALL_SCHOLARSHIPS as INITIAL_SCHOLARSHIPS, MOCK_USER } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [scholarships, setScholarships] = useState<AllScholarships[]>(INITIAL_SCHOLARSHIPS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

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
  
  const handlePushNotification = (scholarship: AllScholarships) => {
      const newNotification: AppNotification = {
          id: `notif-${Date.now()}`,
          title: '새로운 장학금 추천',
          message: `'${scholarship.title}' 장학금이 새로 등록되었습니다.`,
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
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;