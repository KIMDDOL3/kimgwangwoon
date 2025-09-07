
import React from 'react';
// FIX: Corrected import path
import { AllScholarships } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface NationalScholarshipCardProps {
  allScholarships: AllScholarships[];
  onAskAi: (scholarshipTitle: string) => void;
}

const NationalScholarshipCard: React.FC<NationalScholarshipCardProps> = ({ allScholarships, onAskAi }) => {
  const nationalScholarship = allScholarships.find(s => s.id === 's000');

  if (!nationalScholarship) {
    return null;
  }

  return (
    <Card className="border-2 border-yellow-400 dark:border-yellow-500 bg-gradient-to-br from-yellow-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80">
      <div className="flex items-start gap-4">
        <div className="bg-yellow-400 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4M5 3a2 2 0 00-2 2v1c0 1.1.9 2 2 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11h14a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 012-2z" />
            </svg>
        </div>
        <div>
            <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-300 mb-2">{nationalScholarship.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                {nationalScholarship.summary}
            </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-yellow-300 dark:border-yellow-600/50 flex flex-col sm:flex-row gap-3">
        <a 
          href={nationalScholarship.applicationUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full sm:w-auto flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
            한국장학재단에서 신청하기
        </a>
        <Button onClick={() => onAskAi(nationalScholarship.title)} variant="secondary" className="w-full sm:w-auto">
          AI에게 상세 문의하기
        </Button>
      </div>
    </Card>
  );
};

export default NationalScholarshipCard;
