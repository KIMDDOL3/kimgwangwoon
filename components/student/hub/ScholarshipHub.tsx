import React, { useState } from 'react';
import { AllScholarships, ApplicationData, User } from '../../../types';
import ScholarshipDistributionChart from './ScholarshipDistributionChart';
import ScholarshipDataTable from './ScholarshipDataTable';
import ApplicationModal from '../ApplicationModal';
import { MOCK_USER } from '../../../constants'; // Assuming MOCK_USER is a stand-in for the logged-in user.

interface ScholarshipHubProps {
  onBack: () => void;
  onAskAi: (scholarshipTitle: string) => void;
  allScholarships: AllScholarships[];
}

const ScholarshipHub: React.FC<ScholarshipHubProps> = ({ onBack, onAskAi, allScholarships }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<AllScholarships | null>(null);
  
  // In a real app, the user object would be passed down as a prop.
  const user = MOCK_USER; 

  const handleApplyClick = (scholarship: AllScholarships) => {
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
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
      submissionDate: new Date().toLocaleString('ko-KR'),
      status: 'Applied',
      fileName: file?.name,
    };

    try {
      const LOCAL_STORAGE_KEY = 'jnu_scholarship_applications';
      const storedApplicationsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const applications: ApplicationData[] = storedApplicationsRaw ? JSON.parse(storedApplicationsRaw) : [];
      applications.push(applicationData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
      window.dispatchEvent(new CustomEvent('applicationSubmitted'));
    } catch (error) {
      console.error("Failed to save application to local storage:", error);
    }

    alert(`${applicationData.scholarshipTitle} 장학금 신청이 완료되었습니다.`);
    setIsModalOpen(false);
    setSelectedScholarship(null);
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Hub Header */}
        <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg text-white shadow-md p-4 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700/80">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">장학금 정보 허브</h1>
            <button
              onClick={onBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              <span>대시보드로 돌아가기</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">장학금 분포 현황</h2>
                <div className="h-80 flex items-center justify-center">
                    <ScholarshipDistributionChart scholarships={allScholarships} />
                </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">전체 장학금 목록</h2>
                <ScholarshipDataTable scholarships={allScholarships} onAskAi={onAskAi} onApply={handleApplyClick} />
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && selectedScholarship && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleApplicationSubmit}
          scholarship={selectedScholarship}
          user={user}
        />
      )}
    </>
  );
};

export default ScholarshipHub;