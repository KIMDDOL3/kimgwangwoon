import React from 'react';
import { AllScholarships } from '../../../types';
import ScholarshipDistributionChart from './ScholarshipDistributionChart';
import ScholarshipDataTable from './ScholarshipDataTable';

interface ScholarshipHubProps {
  onBack: () => void;
  onAskAi: (scholarshipTitle: string) => void;
  allScholarships: AllScholarships[];
}

const ScholarshipHub: React.FC<ScholarshipHubProps> = ({ onBack, onAskAi, allScholarships }) => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="min-h-screen bg-black/10 dark:bg-black/40 backdrop-blur-sm">
        {/* Hub Header */}
        <header className="bg-blue-800/80 backdrop-blur-md text-white shadow-lg p-4 sticky top-0 z-20 border-b border-white/20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">장학금 정보 허브</h1>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2"
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">장학금 분포 현황</h2>
                <div className="h-80 flex items-center justify-center">
                    <ScholarshipDistributionChart scholarships={allScholarships} />
                </div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">전체 장학금 목록</h2>
                <ScholarshipDataTable scholarships={allScholarships} onAskAi={onAskAi} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScholarshipHub;