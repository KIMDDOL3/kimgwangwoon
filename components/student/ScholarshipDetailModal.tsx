import React from 'react';
import { AllScholarships } from '../../types';
import Button from '../ui/Button';
import { SCHOLARSHIP_CATEGORIES } from '../../constants';

interface ScholarshipDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarship: AllScholarships | null;
  onApply: (scholarship: AllScholarships) => void;
  onAskAi: (scholarshipTitle: string) => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-gray-800 dark:text-gray-200">{value}</p>
    </div>
);

const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({ isOpen, onClose, scholarship, onApply, onAskAi }) => {
  if (!isOpen || !scholarship) return null;

  const requirements = scholarship.requirements || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 transform transition-all duration-300 animate-fade-in-up max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-start border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
            <div>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${SCHOLARSHIP_CATEGORIES[scholarship.category].className}`}>
                    {SCHOLARSHIP_CATEGORIES[scholarship.category].label}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{scholarship.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{scholarship.provider}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 self-start p-1 -mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </header>

        <main className="overflow-y-auto pr-2 space-y-6">
            <section>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">요약</h3>
                <p className="text-gray-700 dark:text-gray-300">{scholarship.summary}</p>
            </section>

             <section>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">상세 정보</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{scholarship.fullDescription}</p>
            </section>
            
            <section>
                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">신청 정보</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <DetailItem label="신청 마감일" value={scholarship.deadline} />
                    <DetailItem label="신청 방법" value={<a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">온라인 링크/안내 확인</a>} />
                 </div>
            </section>

            {Object.keys(requirements).length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">지원 자격</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {requirements.minGpa && <DetailItem label="최소 GPA" value={`${requirements.minGpa} / 4.5`} />}
                        {requirements.incomeBracket && <DetailItem label="소득분위" value={`${requirements.incomeBracket}구간 이하`} />}
                        {requirements.allowedYears && <DetailItem label="대상 학년" value={`${requirements.allowedYears.join(', ')}학년`} />}
                        {requirements.allowedDepartments && <DetailItem label="대상 학과" value={requirements.allowedDepartments.join(', ')} />}
                    </div>
                </section>
            )}

        </main>

        <footer className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-end space-x-3">
            <Button onClick={() => onAskAi(scholarship.title)} variant="secondary">AI 문의</Button>
            <Button onClick={() => onApply(scholarship)} variant="primary">온라인 지원</Button>
        </footer>
      </div>
    </div>
  );
};

export default ScholarshipDetailModal;
