import React, { useState, useEffect, useCallback } from 'react';
// FIX: Corrected import path
import { ApplicationData, ApplicationStatus } from '../../types';

const LOCAL_STORAGE_KEY = 'jnu_scholarship_applications';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Applied: '지원 완료',
  Awarded: '선정',
  Rejected: '미선정',
};

const STATUS_DOT_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-500',
  Awarded: 'bg-green-500',
  Rejected: 'bg-red-500',
};

const SkeletonLoader: React.FC = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="h-6 w-32 mb-4 rounded skeleton-loader"></div>
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center min-w-0">
                            <div className="w-2.5 h-2.5 rounded-full mr-3 flex-shrink-0 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                        <div className="h-6 w-20 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600 mt-2 ml-5"></div>
                </div>
            ))}
        </div>
    </div>
);


const ApplicationHistory: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
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

  if (isLoading) {
    return <SkeletonLoader />;
  }
  
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
                    <p className="text-xs font-semibold rounded-full py-1 px-3 bg-opacity-80 backdrop-blur-sm">
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