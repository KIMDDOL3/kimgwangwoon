import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { MOCK_SCRAPED_SCHOLARSHIPS, ScrapedScholarship } from './mockData';
import { AllScholarships } from '../../../types';

interface ExternalScholarshipMonitorToolProps {
    onAdd: (scholarship: AllScholarships) => void;
    onPushNotification: (scholarship: AllScholarships, message: string) => void;
}

const ExternalScholarshipMonitorTool: React.FC<ExternalScholarshipMonitorToolProps> = ({ onAdd, onPushNotification }) => {
    const [scholarships, setScholarships] = useState(MOCK_SCRAPED_SCHOLARSHIPS);
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Simulate finding one new item and marking old "new" items as seen
            setScholarships(prev => [
                {
                    title: 'DB김준기문화재단 2025년 장학생',
                    foundation: 'DB김준기문화재단',
                    summary: 'IT, 금융 분야의 잠재력 있는 인재를 지원하여 글로벌 전문가로 육성합니다.',
                    applicationUrl: '#',
                    deadline: '2025-10-05',
                    new: true,
                },
                ...prev.map(s => ({ ...s, new: false }))
            ]);
            setIsLoading(false);
        }, 2000);
    };

    const handleImport = (scrapedScholarship: ScrapedScholarship, index: number) => {
        const newScholarship: AllScholarships = {
            id: `ext-${Date.now()}`,
            title: scrapedScholarship.title,
            category: 'Other',
            source: 'External',
            provider: scrapedScholarship.foundation,
            summary: scrapedScholarship.summary,
            deadline: scrapedScholarship.deadline,
            applicationUrl: scrapedScholarship.applicationUrl,
            fullDescription: scrapedScholarship.summary, // Use summary as full description
        };

        // Add to main system
        onAdd(newScholarship);

        // Push notification to students
        onPushNotification(newScholarship, `새로운 교외 장학금 '${newScholarship.title}' 공고를 확인해보세요!`);

        // Remove from local list of scraped items
        const updatedScholarships = [...scholarships];
        updatedScholarships.splice(index, 1);
        setScholarships(updatedScholarships);
    };

    return (
        <Card>
            <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">외부 장학금 모니터링 에이전트</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        AI 에이전트가 주요 장학재단 웹사이트를 모니터링하여 신규 공고를 자동으로 탐지합니다.
                    </p>
                </div>
                <Button onClick={handleRefresh} disabled={isLoading} variant="primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" /></svg>
                    {isLoading ? '탐색 중...' : '신규 공고 탐색'}
                </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">탐지된 신규 장학 공고 ({scholarships.length}건)</p>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {scholarships.map((s, index) => (
                        <div key={index} className={`p-4 rounded-lg transition-all ${s.new ? 'bg-emerald-50 dark:bg-emerald-900/40 border-l-4 border-emerald-500' : 'bg-gray-50 dark:bg-gray-800/60'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{s.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{s.foundation} | 마감: {s.deadline}</p>
                                </div>
                                {s.new && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-white">NEW</span>}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{s.summary}</p>
                            <div className="mt-3 flex justify-end gap-2">
                                <Button onClick={() => alert('상세정보 링크로 이동합니다.')} variant="secondary" className="py-1 px-3 text-xs">상세 보기</Button>
                                <Button onClick={() => handleImport(s, index)} variant="primary" className="py-1 px-3 text-xs">시스템에 추가</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default ExternalScholarshipMonitorTool;