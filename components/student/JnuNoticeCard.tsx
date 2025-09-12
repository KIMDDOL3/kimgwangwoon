import React, { useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AllScholarships } from '../../types';

const SCHOLARSHIP_NOTICE_URL = 'https://www.jnu.ac.kr/WebApp/web/HOM/COM/Board/board.aspx?boardID=5&cate=5';

interface JnuNoticeCardProps {
    isLoading: boolean;
    allScholarships: AllScholarships[];
    onNoticeClick: (scholarship: AllScholarships) => void;
}

const SkeletonLoader: React.FC = () => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <div className="h-7 w-48 rounded skeleton-loader"></div>
            <div className="h-9 w-20 rounded-lg skeleton-loader"></div>
        </div>
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center gap-4">
                        <div className="h-5 w-3/4 rounded skeleton-loader"></div>
                        <div className="h-4 w-1/5 rounded skeleton-loader"></div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const JnuNoticeCard: React.FC<JnuNoticeCardProps> = ({ isLoading, allScholarships, onNoticeClick }) => {
    const notices = useMemo(() => {
        // Show the 5 scholarships with the most imminent deadlines, regardless of whether they are past or future.
        // Sort by deadline ascending.
        return [...allScholarships]
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
          .slice(0, 5);
    }, [allScholarships]);

    if (isLoading) {
      return <SkeletonLoader />;
    }

    return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-gradient-aurora">최신 장학금 공지</span>
            </h3>
            <a href={SCHOLARSHIP_NOTICE_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">더보기</Button>
            </a>
        </div>
        <div className="space-y-3">
            {notices.map(notice => (
                <button 
                    key={notice.id} 
                    onClick={() => onNoticeClick(notice)}
                    className="block w-full text-left p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 hover:shadow-md"
                >
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center min-w-0">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L4.12 6.584A1 1 0 004 7.5v10a1 1 0 001.894.447l11-6A1 1 0 0018 11V3z" clipRule="evenodd" /></svg>
                            <p className="font-semibold text-base text-gray-800 dark:text-gray-200 truncate">{notice.title}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 font-mono">~{notice.deadline}</span>
                    </div>
                </button>
            ))}
        </div>
        {notices.length === 0 && <p className="text-center py-4 text-gray-500">현재 등록된 최신 장학금이 없습니다.</p>}
        <p className="text-xs text-center text-gray-500 dark:text-gray-300 mt-4">* 위 목록은 마감일이 임박한 최신 장학금 정보입니다.</p>
    </Card>
    );
};

export default JnuNoticeCard;