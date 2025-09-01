
import React from 'react';
import { User, AllScholarships, ApplicationData, ApplicationStatus } from '../../types';
import AdminStats from './AdminStats';
import ScholarshipManagementTable from './ScholarshipManagementTable';
import ApplicationStats from './ApplicationStats';
import ApplicationManagementTable from './ApplicationManagementTable';
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
  applicationData: ApplicationData[];
  onUpdateStatus: (userId: string, scholarshipId: string, submissionDate: string, newStatus: ApplicationStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, onLogout, scholarships, onAdd, onUpdate, onDelete, onPushNotification, applicationData, onUpdateStatus 
}) => {
  return (
    <div className="min-h-screen">
      <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg text-white shadow-md p-4 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">전남대학교 장학금 Dashboard (Admin)</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300 hidden md:block">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">장학금 통계</h2>
              <AdminStats scholarships={scholarships} />
          </Card>
          <Card>
            <ApplicationStats applications={applicationData} />
          </Card>
           <Card>
              <ApplicationManagementTable 
                  applications={applicationData} 
                  onUpdateStatus={onUpdateStatus} 
              />
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
  );
};

export default AdminDashboard;