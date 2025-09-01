import React, { useState } from 'react';
import { ScoredScholarship, User, ApplicationData } from '../../types';
import ApplicationModal from './ApplicationModal';

interface ScholarshipCardProps {
  scholarship: ScoredScholarship;
  user: User;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplicationSubmit = (statement: string) => {
    const applicationData: ApplicationData = {
      scholarshipId: scholarship.id,
      scholarshipTitle: scholarship.title,
      userId: user.id,
      userName: user.name,
      universityId: user.universityId,
      statement: statement,
      submissionDate: new Date().toLocaleString('ko-KR'),
      status: 'Applied',
    };
    
    // Save submission to local storage
    try {
      const LOCAL_STORAGE_KEY = 'jnu_scholarship_applications';
      const storedApplicationsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const applications: ApplicationData[] = storedApplicationsRaw ? JSON.parse(storedApplicationsRaw) : [];
      applications.push(applicationData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
      // Notify other components that a submission happened
      window.dispatchEvent(new CustomEvent('applicationSubmitted'));
    } catch (error) {
      console.error("Failed to save application to local storage:", error);
    }

    alert(`${applicationData.scholarshipTitle} 장학금 신청이 완료되었습니다.`);
    setIsModalOpen(false);
  };
  
  const getScoreColor = (score: number) => {
    if (score > 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-500';
    if (score > 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-500';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300 border-gray-400';
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-lg">
        <div className="p-4 flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{scholarship.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{scholarship.summary}</p>
          </div>
          <div className={`ml-4 flex-shrink-0 w-20 text-center p-2 rounded-lg border-2 ${getScoreColor(scholarship.score)}`}>
            <div className="font-extrabold text-2xl">{scholarship.score}</div>
            <div className="text-xs font-semibold">적합도</div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h5 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">상세 정보</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{scholarship.fullDescription}</p>
            <h5 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">점수 산출 근거</h5>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
              {scholarship.reasons.map((reason, index) => <li key={index}>{reason}</li>)}
            </ul>
          </div>
        )}
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isExpanded ? '간략히 보기' : '자세히 보기'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            온라인 지원
          </button>
        </div>
      </div>
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplicationSubmit}
        scholarship={scholarship}
        user={user}
      />
    </>
  );
};

export default ScholarshipCard;