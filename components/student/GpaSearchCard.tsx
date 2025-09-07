
import React, { useState } from 'react';
// FIX: Corrected import path
import { AllScholarships } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface GpaSearchCardProps {
  allScholarships: AllScholarships[];
  onAskAi: (scholarshipTitle: string) => void;
}

const GpaSearchCard: React.FC<GpaSearchCardProps> = ({ allScholarships, onAskAi }) => {
  const [gpaInput, setGpaInput] = useState('');
  const [searchResults, setSearchResults] = useState<AllScholarships[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const gpa = parseFloat(gpaInput);
    if (isNaN(gpa) || gpa < 0 || gpa > 4.5) {
      alert('유효한 학점을 입력해주세요 (0.0 ~ 4.5).');
      return;
    }

    const results = allScholarships.filter(s => 
        s.requirements?.minGpa && gpa >= s.requirements.minGpa
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">성적으로 장학금 찾기</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        학점을 입력하여 지원 가능한 모든 장학금(교내/교외)을 확인해보세요.
      </p>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          step="0.01"
          min="0"
          max="4.5"
          value={gpaInput}
          onChange={(e) => setGpaInput(e.target.value)}
          placeholder="학점 입력 (예: 3.5)"
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 bg-gray-50 dark:bg-gray-700"
        />
        <Button onClick={handleSearch} variant="primary">
          검색
        </Button>
      </div>

      {hasSearched && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            검색 결과 ({searchResults.length}건)
          </h4>
          {searchResults.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {searchResults.map(s => (
                <li key={s.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{s.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {s.provider} | 기준 학점: {s.requirements?.minGpa}+
                    </p>
                  </div>
                  <Button onClick={() => onAskAi(s.title)} variant="secondary">
                    AI 문의
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              아쉽지만, 입력하신 성적으로 지원 가능한 장학금이 없습니다.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default GpaSearchCard;
