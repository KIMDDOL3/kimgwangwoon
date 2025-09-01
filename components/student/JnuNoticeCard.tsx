import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const JNU_NOTICE_URL = 'https://www.jnu.ac.kr/WebApp/web/HOM/COM/Board/board.aspx?boardID=5&cate=5';

const notices = [
  { id: 1, title: '2025학년도 2학기 국가장학금 1차 신청 안내', date: '2025.08.23' },
  { id: 2, title: '[일반공지] 2025년 2학기 전남대학교 총장 장학생 선발 안내', date: '2025.08.21' },
  { id: 3, title: '2025학년도 교내장학금 신청 기간 연장 안내', date: '2025.08.20' },
  { id: 4, title: '글로벌 리더십 장학금 신청 자격 변경 공지', date: '2025.08.19' },
];

const JnuNoticeCard: React.FC = () => {
  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">전남대학교 공지사항</h3>
            <a href={JNU_NOTICE_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">더보기</Button>
            </a>
        </div>
        <div className="space-y-3">
            {notices.map(notice => (
                <a 
                    key={notice.id} 
                    href={JNU_NOTICE_URL} 
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
        <p className="text-xs text-center text-gray-500 dark:text-gray-300 mt-4">* 위 목록은 최신 공지사항이 실시간으로 반영되는 예시입니다.</p>
    </Card>
  );
};

export default JnuNoticeCard;