import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { MOCK_STATISTICS_DATA } from './mockData';
import { SCHOLARSHIP_CATEGORIES } from '../../../constants';

const DataDisclosureTool: React.FC = () => {
    const [step, setStep] = useState<'config' | 'processing' | 'results'>('config');
    const [reportType, setReportType] = useState('Semester Statistics');
    const [period, setPeriod] = useState('2025-1');

    const handleGenerate = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('results');
        }, 2500);
    };
    
    const handleReset = () => {
        setStep('config');
    }

    const renderContent = () => {
        switch (step) {
            case 'processing':
                return (
                     <div className="text-center p-8">
                         <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-4 h-4 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-4 h-4 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <h3 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">AI가 리포트를 생성 중입니다...</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                           학사 DB, 장학금 시스템, 재무 시스템에서 데이터를 집계하고<br/>'대학 정보 공시' 표준 양식에 맞춰 통계를 작성하고 있습니다.
                        </p>
                    </div>
                );
            case 'results':
                return (
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2025학년도 1학기 장학금 수혜 현황 보고서</h4>
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-center">
                            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-500 dark:text-gray-400">총 지급액</p><p className="font-bold text-xl text-violet-600 dark:text-violet-400">{(MOCK_STATISTICS_DATA.totalAmount / 100000000).toFixed(1)}억원</p></div>
                            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-500 dark:text-gray-400">총 수혜인원</p><p className="font-bold text-xl text-gray-800 dark:text-gray-200">{MOCK_STATISTICS_DATA.totalRecipients.toLocaleString()}명</p></div>
                            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-500 dark:text-gray-400">교내</p><p className="font-bold text-xl text-gray-800 dark:text-gray-200">{MOCK_STATISTICS_DATA.internalCount}명</p></div>
                            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-500 dark:text-gray-400">교외</p><p className="font-bold text-xl text-gray-800 dark:text-gray-200">{MOCK_STATISTICS_DATA.externalCount}명</p></div>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                                    <tr>
                                        <th className="px-4 py-3">장학금 유형</th>
                                        <th className="px-4 py-3">수혜인원 (명)</th>
                                        <th className="px-4 py-3">지급액 (원)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 dark:text-gray-200">
                                    {MOCK_STATISTICS_DATA.byCategory.map(item => (
                                        <tr key={item.category} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-2 font-semibold">{SCHOLARSHIP_CATEGORIES[item.category as keyof typeof SCHOLARSHIP_CATEGORIES].label}</td>
                                            <td className="px-4 py-2">{item.count.toLocaleString()}</td>
                                            <td className="px-4 py-2 font-mono">{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                           </table>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="secondary" onClick={handleReset}>다른 리포트 생성</Button>
                            <Button variant="primary">엑셀 파일로 다운로드</Button>
                        </div>
                    </div>
                );
            case 'config':
            default:
                return (
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">리포트 종류</label>
                            <select value={reportType} onChange={e => setReportType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                <option value="Semester Statistics">학기별 장학금 수혜 통계</option>
                                <option value="Department Comparison">단과대학별 지급 현황</option>
                                <option value="Annual Disclosure">연간 정보공시 자료</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">대상 기간</label>
                            <select value={period} onChange={e => setPeriod(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                <option value="2025-1">2025학년도 1학기</option>
                                <option value="2024-2">2024학년도 2학기</option>
                                <option value="2024-1">2024학년도 1학기</option>
                            </select>
                        </div>
                        <div className="pt-6">
                           <Button onClick={handleGenerate} variant="primary">리포트 생성</Button>
                        </div>
                    </div>
                );
        }
    };


    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">정보공시 및 통계자료 자동 생성</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-semibold text-sky-600 dark:text-sky-400">[RPA 우선순위 #3]</span> 분산된 데이터를 AI가 자동으로 취합하여 정보공시 보고서를 생성합니다.
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

export default DataDisclosureTool;
