import React, { useState } from 'react';
import { ScoredScholarship, User } from '../../types';
import ApplicationModal from './ApplicationModal';
import { ApplicationData } from '../../types';

interface RecommendedScholarshipsProps {
  scholarships: ScoredScholarship[];
  user: User;
}

const getScoreColor = (score: number) => {
    if (score > 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-400';
    if (score > 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300 border-gray-400';
};


const RecommendedScholarships: React.FC<RecommendedScholarshipsProps> = ({ scholarships, user }) => {
  const topScholarships = scholarships.filter(s => s.score > 0).slice(0, 3);
  const [modalScholarship, setModalScholarship] = useState<ScoredScholarship | null>(null);

  const handleApplicationSubmit = (statement: string, file?: File) => {
    if (!modalScholarship) return;

    const applicationData: ApplicationData = {
      scholarshipId: modalScholarship.id,
      scholarshipTitle: modalScholarship.title,
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
    setModalScholarship(null);
  };
  
  return (
    <>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">추천 장학금 Top {topScholarships.length}</h3>
        {topScholarships.length > 0 ? (
          <div className="space-y-4">
            {topScholarships.map(s => (
              <div key={s.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{s.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.summary}</p>
                  </div>
                  <div className={`flex-shrink-0 w-16 text-center p-1 rounded-lg border ${getScoreColor(s.score)}`}>
                    <div className="font-bold text-xl">{s.score}점</div>
                    <div className="text-xs font-semibold">적합도</div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button 
                        onClick={() => setModalScholarship(s)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                        온라인 지원
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">추천할 만한 장학금을 찾지 못했습니다. 자가진단을 통해 더 정확한 추천을 받아보세요.</p>
        )}
      </div>
      {modalScholarship && (
        <ApplicationModal
            isOpen={!!modalScholarship}
            onClose={() => setModalScholarship(null)}
            onSubmit={handleApplicationSubmit}
            scholarship={modalScholarship}
            user={user}
        />
      )}
    </>
  );
};

export default RecommendedScholarships;