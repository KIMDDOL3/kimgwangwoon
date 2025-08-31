import React, { useState, useEffect, useCallback } from 'react';
import { ApplicationData } from '../../types';

const ApplicationHistory: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  const loadApplications = useCallback(() => {
    try {
      const LOCAL_STORAGE_KEY = 'cnu_scholarship_applications';
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

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('applicationSubmitted', loadApplications);
    };
  }, [loadApplications]);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">나의 지원 이력</h3>
      {applications.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {applications.map((app, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{app.scholarshipTitle}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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