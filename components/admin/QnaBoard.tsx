

import React, { useState, useMemo } from 'react';
// FIX: Corrected import path
import { QnaItem, QnaStatus } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
interface QnaBoardProps {
    qnaItems: QnaItem[];
    onSaveAnswer: (id: string, answer: string) => void;
}
const QnaBoard: React.FC<QnaBoardProps> = ({ qnaItems, onSaveAnswer }) => {
    const [filter, setFilter] = useState<'All' | QnaStatus>('All');
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [answerText, setAnswerText] = useState('');
    const filteredItems = useMemo(() => {
        const sorted = [...qnaItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (filter === 'All') {
            return sorted;
        }
        return sorted.filter(item => item.status === filter);
    }, [qnaItems, filter]);
    const handleEditClick = (item: QnaItem) => {
        setEditingItemId(item.id);
        setAnswerText(item.answer || '');
    };
    const handleCancel = () => {
        setEditingItemId(null);
        setAnswerText('');
    };
    const handleSave = (id: string) => {
        onSaveAnswer(id, answerText);
        handleCancel();
    };
    const FilterButton: React.FC<{
        value: typeof filter;
        label: string;
    }> = ({ value, label }) => (<button onClick={() => setFilter(value)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${filter === value
            ? 'bg-green-600 text-white shadow'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            {label}
        </button>);
    return (<div className="space-y-8 animate-fade-in-up">
            <Card>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    <span className="text-gradient-aurora">Q&A 게시판 관리</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    학생들이 제출한 장학금 관련 질문을 확인하고 답변을 관리합니다.
                </p>
            </Card>

            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <FilterButton value="All" label="전체"/>
                    <FilterButton value="Unanswered" label="미답변"/>
                    <FilterButton value="Answered" label="답변 완료"/>
                </div>

                <div className="space-y-4">
                    {filteredItems.map(item => (<div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{item.question}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {item.studentName} ({item.studentId}) | {item.date}
                                    </p>
                                </div>
                                {item.status === 'Answered' ? (<span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">답변 완료</span>) : (<span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">미답변</span>)}
                            </div>
                            
                            {editingItemId === item.id ? (<div className="mt-4">
                                    <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} rows={4} className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600" placeholder="답변을 입력하세요..."/>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button variant="secondary" onClick={handleCancel}>취소</Button>
                                        <Button variant="primary" onClick={() => handleSave(item.id)}>답변 저장</Button>
                                    </div>
                                </div>) : (<div className="mt-4">
                                    {item.answer ? (<p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.answer}</p>) : (<p className="text-gray-400 italic">아직 답변이 등록되지 않았습니다.</p>)}
                                    <div className="text-right mt-2">
                                        <Button variant="secondary" onClick={() => handleEditClick(item)}>
                                            {item.answer ? '답변 수정' : '답변하기'}
                                        </Button>
                                    </div>
                                </div>)}
                        </div>))}
                     {filteredItems.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">해당 조건의 질문이 없습니다.</p>}
                </div>
            </Card>
        </div>);
};
export default QnaBoard;