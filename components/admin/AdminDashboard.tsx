
import React from 'react';
import { User, AllScholarships } from '../../types';
import AdminStats from './AdminStats';
import ScholarshipManagementTable from './ScholarshipManagementTable';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  scholarships: AllScholarships[];
  onAdd: (scholarship: AllScholarships) => void;
  onUpdate: (scholarship: AllScholarships) => void;
  onDelete: (scholarshipId: string) => void;
  onPushNotification: (scholarship: AllScholarships, message: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, scholarships, onAdd, onUpdate, onDelete, onPushNotification }) => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="min-h-screen bg-black/10 dark:bg-black/40 backdrop-blur-sm">
        <header className="bg-blue-800/80 backdrop-blur-md text-white shadow-lg p-4 sticky top-0 z-20 border-b border-white/20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">CNU Scholarship Dashboard (Admin)</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-200 hidden md:block">
                관리자: <span className="font-semibold">{user.name}</span>님
              </span>
              <Button onClick={onLogout} variant="secondary">
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Card>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">현황 요약</h2>
                <AdminStats scholarships={scholarships} />
            </Card>
            <Card>
                <ScholarshipManagementTable 
                    scholarships={scholarships}
                    onAdd={onAdd}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onPushNotification={onPushNotification}
                />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
