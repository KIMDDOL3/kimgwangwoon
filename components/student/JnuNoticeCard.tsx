import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SCHOLARSHIP_NOTICE_URL = 'https://www.jnu.ac.kr/WebApp/web/HOM/COM/Board/board.aspx?boardID=5&cate=5'; // Example URL

const notices = [
  { id: 1, title: '2025학년도 2학기 국가장학금 1차 신청 최종 마감 안내', date: '2025.09.05' },
  { id: 2, title: '[교내] 2025-2학기 성적우수장학금(Ⅰ,Ⅱ) 선발 결과 안내', date: '2025.08.30' },
  { id: 3, title: '[교외] 현대차 정몽구 재단 2025년도 장학생 선발 공고', date: '2025.08.28' },
  { id: 4, title: '2025학년도 1학기 생활지원 장학금 신청 안내', date: '2025.08.25' },
];

const SkeletonLoader: React.FC = () => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <div className="h-7 w-48 rounded skeleton-loader"></div>
            <div className="h-9 w-20 rounded-lg skeleton-loader"></div>
        </div>
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
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

const JnuNoticeCard: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (isLoading) {
      return <SkeletonLoader />;
  }

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-gradient-aurora">장학금 관련 공지사항</span>
            </h3>
            <a href={SCHOLARSHIP_NOTICE_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">더보기</Button>
            </a>
        </div>
        <div className="space-y-3">
            {notices.map(notice => (
                <a 
                    key={notice.id} 
                    href={SCHOLARSHIP_NOTICE_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 hover:shadow-md"
                >
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center min-w-0">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L4.12 6.584A1 1 0 004 7.5v10a1 1 0 001.894.447l11-6A1 1 0 0018 11V3z" clipRule="evenodd" /></svg>
                            <p className="font-semibold text-base text-gray-800 dark:text-gray-200 truncate">{notice.title}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 font-mono">{notice.date}</span>
                    </div>
                </a>
            ))}
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-300 mt-4">* 위 목록은 최신 장학금 공지사항이 실시간으로 반영되는 예시입니다.</p>
    </Card>
  );
};

export default JnuNoticeCard;