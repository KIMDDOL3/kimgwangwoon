import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { MOCK_FLAGGED_STUDENTS, FlaggedStudent } from './mockData';

const DualCreditVerificationTool: React.FC = () => {
    const [step, setStep] = useState<'idle' | 'processing' | 'results'>('idle');
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');

    const handleStartVerification = () => {
        setStep('processing');
        setProgress(0);
        setProgressText('학사 DB에서 재학생/휴학생/졸업생 정보 조회 중...');

        const steps = [
            { prog: 25, text: '한국장학재단 학자금 대출 내역 연동 중...' },
            { prog: 50, text: '교내/교외 장학금 수혜 내역 조회 중...' },
            { prog: 75, text: '등록금 정보와 수혜 총액 교차 검증 중...' },
            { prog: 100, text: '검증 완료. 확인 필요 항목을 확인합니다.' },
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                setProgress(steps[currentStep].prog);
                setProgressText(steps[currentStep].text);
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => setStep('results'), 500);
            }
        }, 1200);
    };
    
    const handleReset = () => {
        setStep('idle');
        setProgress(0);
    }
    
    const getReasonChip = (reason: FlaggedStudent['reason']) => {
        const styles: Record<typeof reason, string> = {
            'Exceeds Tuition': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            'On Leave': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'Graduated': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
         const labels: Record<typeof reason, string> = {
            'Exceeds Tuition': '등록금 초과',
            'On Leave': '휴학생',
            'Graduated': '졸업생',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[reason]}`}>{labels[reason]}</span>;
    };

    const renderContent = () => {
        switch (step) {
            case 'processing':
                return (
                    <div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-center text-sm text-cyan-700 dark:text-cyan-300 font-semibold">{progressText}</p>
                    </div>
                );
            case 'results':
                return (
                    <div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">검증 완료</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                총 8,720건의 데이터를 검증하여 <span className="text-red-600 dark:text-red-400">{MOCK_FLAGGED_STUDENTS.length}건</span>의 확인 필요 항목을 발견했습니다.
                            </p>
                        </div>
                        <div className="overflow-x-auto max-h-80">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">학생명</th>
                                        <th className="px-4 py-3">유형</th>
                                        <th className="px-4 py-3">상세 내용</th>
                                        <th className="px-4 py-3">조치</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 dark:text-gray-200">
                                    {MOCK_FLAGGED_STUDENTS.map(student => (
                                        <tr key={student.studentId} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3 font-semibold">{student.studentName}</td>
                                            <td className="px-4 py-3">{getReasonChip(student.reason)}</td>
                                            <td className="px-4 py-3">{student.details}</td>
                                            <td className="px-4 py-3"><Button variant="secondary" className="text-xs py-1 px-2">사례 검토</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="secondary" onClick={handleReset}>새로고침</Button>
                            <Button variant="primary">결과 보고서 다운로드</Button>
                        </div>
                    </div>
                );
            case 'idle':
            default:
                return (
                     <div className="text-center p-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">학기별 이중수혜 검증 주기</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">
                           버튼을 클릭하여 2025학년도 1학기 전체 재학생 대상<br/> 학자금 대출 및 장학금 이중수혜 여부 검증을 시작합니다.
                        </p>
                        <Button onClick={handleStartVerification} variant="primary">검증 프로세스 시작</Button>
                    </div>
                );
        }
    };


    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">학자금 대출 및 이중수혜 검증</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">[RPA 우선순위 #5]</span> AI가 전체 학생 데이터를 대조하여 검토가 필요한 사례만 자동으로 추출합니다.
                    </p>
                </div>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">계획됨</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {renderContent()}
            </div>
        </Card>
    );
};

export default DualCreditVerificationTool;