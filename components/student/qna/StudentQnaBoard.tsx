
import React, { useState } from 'react';
import { QnaItem, User } from '../../../types';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
interface StudentQnaBoardProps {
    user: User;
    qnaData: QnaItem[];
    onAddQuestion: (newQuestion: Omit<QnaItem, 'id' | 'date' | 'status'>) => void;
    onBack: () => void;
}
const StudentQnaBoard: React.FC<StudentQnaBoardProps> = ({ user, qnaData, onAddQuestion, onBack }) => {
    const [newQuestion, setNewQuestion] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestion.trim())
            return;
        onAddQuestion({
            question: newQuestion,
            studentName: user.name,
            studentId: user.universityId,
        });
        setNewQuestion('');
    };
    const getStatusChip = (status: QnaItem['status']) => {
        const styles = {
            'Answered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'Unanswered': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        const labels = { 'Answered': '답변 완료', 'Unanswered': '답변 대기중' };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{labels[status]}</span>;
    };
    return (<div className="min-h-screen">
            <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-md p-4 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700/80">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">나의 질문 / 문의하기</h1>
                    <Button onClick={onBack} variant="secondary">
                        대시보드로 돌아가기
                    </Button>
                </div>
            </header>

            <main className="p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* New Question Form */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            <span className="text-gradient-aurora">새로운 질문하기</span>
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} rows={4} className="w-full p-3 border rounded-lg dark:bg-gray-800/80 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="장학금과 관련하여 궁금한 점을 입력해주세요." required/>
                            <div className="text-right">
                                <Button type="submit" variant="primary">질문 제출하기</Button>
                            </div>
                        </form>
                    </Card>

                    {/* Q&A History */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <span className="text-gradient-aurora">나의 질문 내역</span>
                        </h2>
                        <div className="space-y-4">
                            {qnaData.length > 0 ? (qnaData.map(item => (<div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-semibold text-lg text-gray-900 dark:text-white">{item.question}</p>
                                            {getStatusChip(item.status)}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">질문일: {item.date}</p>
                                        
                                        {item.answer && (<div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    <span className="font-bold text-green-700 dark:text-green-400">[답변]</span> {item.answer}
                                                </p>
                                            </div>)}
                                    </div>))) : (<p className="text-center py-8 text-gray-500 dark:text-gray-400">아직 제출한 질문이 없습니다.</p>)}
                        </div>
                    </Card>
                </div>
            </main>
        </div>);
};
export default StudentQnaBoard;
