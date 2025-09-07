
import React from 'react';
import ScholarshipDistributionChart from './ScholarshipDistributionChart';
// FIX: Corrected import path
import { AllScholarships } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

interface ScholarshipHubPreviewProps {
  onNavigate: () => void;
  allScholarships: AllScholarships[];
}

const ScholarshipHubPreview: React.FC<ScholarshipHubPreviewProps> = ({ onNavigate, allScholarships }) => {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">교내 및 전체 장학금 탐색</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        국가장학금 외 모든 교내외 장학금 정보를 인포그래픽과 표로 한눈에 확인하세요.
      </p>
      <div className="h-48 my-4 flex items-center justify-center">
        <ScholarshipDistributionChart scholarships={allScholarships} isPreview />
      </div>
      <Button
        onClick={onNavigate}
        variant="primary"
        className="w-full"
      >
        장학금 정보 전체 보기
      </Button>
    </Card>
  );
};

export default ScholarshipHubPreview;
