

import React, { useState, useEffect, useCallback } from 'react';
// FIX: Corrected import path
import { ApplicationData, ApplicationStatus } from '../../types';

const LOCAL_STORAGE_KEY = 'jnu_scholarship_applications';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Applied: '지원 완료',
  Awarded: '선정',
  Rejected: '미선정',
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Awarded: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_DOT_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-500',
  Awarded: 'bg-green-500',
  Rejected: 'bg-red-500',
};

const ApplicationHistory: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  const loadApplications = useCallback(() => {
    try {
      const storedApplicationsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedApplicationsRaw) {
        const parsedApplications: ApplicationData[] = JSON.parse(storedApplicationsRaw);
        // Sort by submission date, newest first
        parsedApplications.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
        setApplications(parsedApplications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Failed to load applications from local storage:", error);
      setApplications([]);
    }
  }, []);

  useEffect(() => {
    // Initial load
    loadApplications();

    // Listen for custom event to reload data
    window.addEventListener('applicationSubmitted', loadApplications);
    window.addEventListener('dataChanged', loadApplications); // Also listen for admin changes

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('applicationSubmitted', loadApplications);
      window.removeEventListener('dataChanged', loadApplications);
    };
  }, [loadApplications]);

  const handleStatusChange = (scholarshipId: string, submissionDate: string, newStatus: ApplicationStatus) => {
    try {
      const storedApplicationsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedApplicationsRaw) {
        let applications: ApplicationData[] = JSON.parse(storedApplicationsRaw);
        const appIndex = applications.findIndex(app => app.scholarshipId === scholarshipId && app.submissionDate === submissionDate);
        if (appIndex !== -1) {
          applications[appIndex].status = newStatus;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
          loadApplications(); // Reload state to reflect the change
        }
      }
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">나의 지원 이력</h3>
      {applications.length > 0 ? (
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {applications.map((app) => (
            <div key={app.scholarshipId + app.submissionDate} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
              <div className="flex justify-between items-center">
                  <div className="flex items-center min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full mr-3 flex-shrink-0 ${STATUS_DOT_STYLES[app.status]}`} title={STATUS_LABELS[app.status]}></span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{app.scholarshipTitle}</p>
                  </div>
                  <div className="relative ml-2">
                    <p
                      className={`text-xs font-semibold rounded-full py-1 px-3 ${STATUS_STYLES[app.status]}`}
                      aria-label={`${app.scholarshipTitle} application status`}
                    >
                     {STATUS_LABELS[app.status]}
                    </p>
                  </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-5">
                지원일: {app.submissionDate}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">신청한 장학금이 없습니다.</p>
      )}
    </div>
  );
};

export default ApplicationHistory;