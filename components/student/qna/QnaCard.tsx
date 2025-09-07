
import React from 'react';
import { QnaItem } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
interface QnaCardProps {
    onNavigate: () => void;
    qnaData: QnaItem[];
}
const QnaCard: React.FC<QnaCardProps> = ({ onNavigate, qnaData }) => {
    const unansweredCount = qnaData.filter(q => q.status === 'Unanswered').length;
    return (<Card>
      <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.083-3.083A7.002 7.002 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.75 9.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd"/>
              </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Q&A / 문의하기</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                장학금 관련 궁금한 점을 질문하고 답변을 확인하세요.
                {unansweredCount > 0
            ? <span className="block mt-1 font-semibold text-blue-600 dark:text-blue-400">현재 답변을 기다리는 질문이 {unansweredCount}건 있습니다.</span>
            : <span className="block mt-1 text-gray-500">현재 답변 대기중인 질문이 없습니다.</span>}
            </p>
          </div>
      </div>
      <Button onClick={onNavigate} variant="primary" className="w-full">
        내 질문 확인 및 문의하기
      </Button>
    </Card>);
};
export default QnaCard;
