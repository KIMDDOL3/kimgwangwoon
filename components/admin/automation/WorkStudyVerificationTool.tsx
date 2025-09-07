

import React, { useState, useCallback } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
// FIX: Corrected import path
import { mockWorkLogOcrResult, WorkLogEntry } from './mockData';

const FileDropzone: React.FC<{ onFileSelect: (file: File) => void }> = ({ onFileSelect }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload-work-study" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-green-600 dark:text-green-400 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                        <span>파일 업로드</span>
                        <input id="file-upload-work-study" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.xlsx" />
                    </label>
                    <p className="pl-1">또는 파일을 끌어다 놓으세요</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">PDF, 이미지, 엑셀 파일</p>
            </div>
        </div>
    );
};


const VerificationResults: React.FC<{ results: WorkLogEntry[]; onReset: () => void }> = ({ results, onReset }) => {
    const totalEntries = results.length;
    const mismatches = results.filter(r => r.status === 'Mismatch');

    const getStatusChip = (status: 'Verified' | 'Mismatch') => {
        const styles = {
            Verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Mismatch: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        const labels = { Verified: '일치', Mismatch: '불일치' };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{labels[status]}</span>;
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 검증 항목</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEntries}건</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">검증 완료</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">{totalEntries - mismatches.length}건</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">확인 필요</p>
                    <p className="text-2xl font-bold text-red-800 dark:text-red-200">{mismatches.length}건</p>
                </div>
            </div>
            
            <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                        <tr>
                            <th className="px-4 py-3">학생명</th>
                            <th className="px-4 py-3">날짜</th>
                            <th className="px-4 py-3">출근부 기록</th>
                            <th className="px-4 py-3">시스템 기록</th>
                            <th className="px-4 py-3">상태</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-200">
                        {results.map((entry, index) => (
                            <tr key={index} className={`border-b dark:border-gray-700 ${entry.status === 'Mismatch' ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                                <td className="px-4 py-2 font-semibold">{entry.studentName}</td>
                                <td className="px-4 py-2 font-mono">{entry.date}</td>
                                <td className="px-4 py-2 font-mono">{entry.loggedHours}시간</td>
                                <td className="px-4 py-2 font-mono">{entry.systemHours}시간</td>
                                <td className="px-4 py-2">{getStatusChip(entry.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={onReset}>다른 파일 검증</Button>
                <Button variant="primary">결과 제출 및 완료</Button>
            </div>
        </div>
    );
};

const WorkStudyVerificationTool: React.FC = () => {
    const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
    const [fileName, setFileName] = useState<string>('');
    const [results, setResults] = useState<WorkLogEntry[]>([]);

    const handleFileSelect = (file: File) => {
        setFileName(file.name);
        setStep('processing');
        // Simulate OCR and verification
        setTimeout(() => {
            setResults(mockWorkLogOcrResult);
            setStep('results');
        }, 2500);
    };

    const resetTool = useCallback(() => {
        setStep('upload');
        setFileName('');
        setResults([]);
    }, []);

    const renderContent = () => {
        switch (step) {
            case 'processing':
                return (
                    <div className="text-center p-8">
                         <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <h3 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">AI가 문서를 처리 중입니다...</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                           '{fileName}' 파일에서 OCR로 텍스트를 추출하고<br/>시스템 데이터와 대조하여 검증하고 있습니다.
                        </p>
                    </div>
                );
            case 'results':
                return <VerificationResults results={results} onReset={resetTool} />;
            case 'upload':
            default:
                return <FileDropzone onFileSelect={handleFileSelect} />;
        }
    }

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">국가근로장학생 출근부 자동 검증</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">[RPA 우선순위 #1]</span> 학생 출근부 스캔 파일을 업로드하여 근무 시간을 자동으로 검증합니다.
                    </p>
                </div>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">자동화 완료</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {renderContent()}
            </div>
        </Card>
    );
};

export default WorkStudyVerificationTool;