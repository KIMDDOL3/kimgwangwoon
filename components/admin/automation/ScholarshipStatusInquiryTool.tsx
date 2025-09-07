

import React, { useState, useCallback } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
// FIX: Corrected import paths
import { StudentProfile } from '../../../types';
import { MOCK_STUDENT_DATABASE } from './mockData';

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
                    <label htmlFor="file-upload-inquiry" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>파일 업로드</span>
                        <input id="file-upload-inquiry" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.xlsx" />
                    </label>
                    <p className="pl-1">또는 파일을 끌어다 놓으세요</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">장학재단 요청 파일 (엑셀, PDF 등)</p>
            </div>
        </div>
    );
};


const InquiryResults: React.FC<{ results: StudentProfile[]; onReset: () => void }> = ({ results, onReset }) => {
    
    const getStatusChip = (status: '재학' | '휴학') => {
        const styles = {
            '재학': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            '휴학': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div>
             <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                        <tr>
                            <th className="px-4 py-3">학생명</th>
                            <th className="px-4 py-3">학과/학년</th>
                            <th className="px-4 py-3">학적상태</th>
                            <th className="px-4 py-3">2025년 장학금 수혜내역</th>
                            <th className="px-4 py-3">수혜금액</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-200">
                        {results.map((student) => (
                            <tr key={student.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-3 font-semibold">{student.name}</td>
                                <td className="px-4 py-3">{student.department}, {student.year}학년</td>
                                <td className="px-4 py-3">{getStatusChip(student.status)}</td>
                                <td className="px-4 py-3">{student.scholarshipReceived ? `여 (${student.scholarshipName})` : '부'}</td>
                                <td className="px-4 py-3 font-mono">{student.scholarshipAmount ? `${student.scholarshipAmount.toLocaleString()}원` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={onReset}>다른 파일 처리</Button>
                <Button variant="primary">회신 파일 다운로드</Button>
            </div>
        </div>
    );
};

const ScholarshipStatusInquiryTool: React.FC = () => {
    const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
    const [fileName, setFileName] = useState<string>('');
    const [results, setResults] = useState<StudentProfile[]>([]);

    const handleFileSelect = (file: File) => {
        setFileName(file.name);
        setStep('processing');
        // Simulate AI lookup
        setTimeout(() => {
            // In a real app, you would parse the file and query for these specific students
            setResults(MOCK_STUDENT_DATABASE.slice(0, 3)); 
            setStep('results');
        }, 2000);
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
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <h3 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">AI가 요청을 처리 중입니다...</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                           '{fileName}' 파일의 학생 목록을 분석하고<br/>학사정보시스템에서 데이터를 자동으로 조회하여 회신 양식을 작성합니다.
                        </p>
                    </div>
                );
            case 'results':
                return <InquiryResults results={results} onReset={resetTool} />;
            case 'upload':
            default:
                return <FileDropzone onFileSelect={handleFileSelect} />;
        }
    }

    return (
        <Card>
            <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">교외장학재단 학적조회 자동 회신</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-semibold text-sky-600 dark:text-sky-400">[RPA 우선순위 #4]</span> 재단 요청 파일을 업로드하여 학생 학적 및 수혜여부를 자동 조회하고 회신합니다.
                    </p>
                </div>
                 <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">진행 중</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {renderContent()}
            </div>
        </Card>
    );
};

export default ScholarshipStatusInquiryTool;