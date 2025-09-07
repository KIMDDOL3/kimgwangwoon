
import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
// FIX: Corrected import path
import { InternationalStudent } from '../../../types';
import { MOCK_INTERNATIONAL_STUDENTS } from '../automation/mockData';

type ProcessStatus = 'Success' | 'Error';
type ProcessStep = 'upload' | 'processing' | 'results';

interface ProcessResult {
    student: InternationalStudent;
    status: ProcessStatus;
    details: string;
}

const AdmissionCertificateTool: React.FC = () => {
    const [step, setStep] = useState<ProcessStep>('upload');
    const [fileName, setFileName] = useState<string | null>(null);
    const [studentsToProcess, setStudentsToProcess] = useState<InternationalStudent[]>([]);
    const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
    const [logMessages, setLogMessages] = useState<string[]>([]);
    const [finalResults, setFinalResults] = useState<ProcessResult[]>([]);

    useEffect(() => {
        if (step === 'processing' && currentProcessingIndex < studentsToProcess.length) {
            const student = studentsToProcess[currentProcessingIndex];
            const isErrorCase = student.passportNo === 'DE11122233'; // Simulate an error for this student
            let stepDelay = 1000;

            const processSteps = [
                () => addLog(`[INFO] FIMS 접속 및 로그인...`),
                () => addLog(`[SUCCESS] 담당자 계정으로 로그인 성공.`),
                () => addLog(`[INFO] '표준입학허가서 발급' 메뉴로 이동...`),
                () => addLog(`[PROCESSING] 학생 처리 시작: ${student.name} (${student.passportNo})`),
                () => addLog(`[INFO] 학생 정보 입력: 성명, 국적, 여권번호, 과정...`),
                () => {
                    if (isErrorCase) {
                        addLog(`[ERROR] FIMS 시스템 오류: 필수 필드(프로그램) 누락. 처리를 건너뜁니다.`);
                        setFinalResults(prev => [...prev, { student, status: 'Error', details: 'FIMS 필수 필드 누락' }]);
                        // Skip next steps on error
                        setTimeout(() => setCurrentProcessingIndex(currentProcessingIndex + 1), stepDelay * 2);
                        return false; // Stop further steps for this student
                    } else {
                        addLog(`[SUCCESS] 입력 내용 검증 완료.`);
                        return true;
                    }
                },
                () => addLog(`[INFO] 입학허가서 번호 획득: JNU-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`),
                () => addLog(`[INFO] PDF 문서 다운로드 중...`),
                () => {
                    addLog(`[SUCCESS] 다운로드 완료: ${student.name.replace(/\s+/g, '_')}_Admission.pdf`);
                    setFinalResults(prev => [...prev, { student, status: 'Success', details: `PDF 발급 완료` }]);
                },
                () => setTimeout(() => setCurrentProcessingIndex(currentProcessingIndex + 1), stepDelay), // Move to next student
            ];
            
            let currentStepIndex = 0;
            const executeStep = () => {
                if (currentStepIndex < processSteps.length) {
                    const result = processSteps[currentStepIndex]();
                    // If a step returns false, it means we should stop processing this student
                    // FIX: Changed condition to be type-safe against void/number/boolean return types.
                    if (typeof result === 'boolean' && !result) return;
                    currentStepIndex++;
                    setTimeout(executeStep, stepDelay);
                }
            };
            
            if (currentProcessingIndex === 0) {
                 const initialLogs = [
                    `[START] 총 ${studentsToProcess.length}명의 학생에 대한 입학허가서 발급 프로세스를 시작합니다.`
                 ];
                 setLogMessages(initialLogs);
                 setTimeout(executeStep, stepDelay);
            } else {
                 executeStep();
            }

        } else if (step === 'processing' && currentProcessingIndex >= studentsToProcess.length) {
             addLog(`[COMPLETE] 모든 학생 처리 완료.`);
             setTimeout(() => setStep('results'), 1500);
        }
    }, [step, currentProcessingIndex, studentsToProcess]);

    const addLog = (message: string) => {
        setLogMessages(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    };

    const handleFileSelect = () => {
        setFileName('admitted_students_list.xlsx');
        setStudentsToProcess(MOCK_INTERNATIONAL_STUDENTS);
    };

    const startProcessing = () => {
        setCurrentProcessingIndex(0);
        setFinalResults([]);
        setStep('processing');
    };
    
    const handleReset = () => {
        setStep('upload');
        setFileName(null);
        setStudentsToProcess([]);
        setCurrentProcessingIndex(0);
        setLogMessages([]);
        setFinalResults([]);
    };
    
    const renderUploadStep = () => (
        <div>
             <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. 발급 대상자 데이터 추출</h4>
             <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">입학허가를 발급할 학생 명단이 포함된 엑셀 파일을 업로드하세요.</p>
             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload-admission" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-green-600 dark:text-green-400 hover:text-green-500">
                            <span>파일 선택</span>
                            <input id="file-upload-admission" name="file-upload" type="file" className="sr-only" onChange={handleFileSelect} accept=".xlsx,.xls" />
                        </label>
                        <p className="pl-1">또는 파일을 끌어다 놓으세요</p>
                    </div>
                </div>
            </div>
            {fileName && (
                <div className="mt-4">
                    <p className="font-semibold text-center text-gray-700 dark:text-gray-200">'{fileName}' 파일이 준비되었습니다. 총 {studentsToProcess.length}명의 학생이 처리됩니다.</p>
                     <div className="mt-4 text-center">
                        <Button onClick={startProcessing} variant="primary">자동화 봇 실행</Button>
                    </div>
                </div>
            )}
        </div>
    );
    
    const renderProcessingStep = () => (
         <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. RPA 봇 실시간 처리 현황</h4>
             <div className="flex flex-col md:flex-row gap-4 h-96">
                <div className="w-full md:w-1/3 border dark:border-gray-600 rounded-lg p-3">
                    <h5 className="font-semibold mb-2">처리 대기열</h5>
                    <ul className="space-y-1 text-sm">
                        {studentsToProcess.map((s, i) => (
                            <li key={s.id} className={`p-1.5 rounded ${i < currentProcessingIndex ? 'text-gray-400 line-through' : i === currentProcessingIndex ? 'bg-blue-100 dark:bg-blue-900/50 font-bold' : ''}`}>
                                {s.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full md:w-2/3 border dark:border-gray-600 rounded-lg p-3 bg-gray-900 dark:bg-black font-mono text-xs text-gray-300 overflow-y-auto">
                   {logMessages.map((msg, i) => (
                        <p key={i} className={`whitespace-pre-wrap ${msg.includes('[ERROR]') ? 'text-red-400' : msg.includes('[SUCCESS]') ? 'text-green-400' : ''}`}>
                            {msg}
                        </p>
                    ))}
                </div>
             </div>
        </div>
    );
    
    const renderResultsStep = () => {
         const successCount = finalResults.filter(r => r.status === 'Success').length;
         const errorCount = finalResults.length - successCount;
        return (
             <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. 발급 결과 취합 및 통보</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-center"><p className="text-sm">총 처리</p><p className="font-bold text-xl">{finalResults.length}건</p></div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg text-center"><p className="text-sm">발급 성공</p><p className="font-bold text-xl text-green-700 dark:text-green-300">{successCount}건</p></div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg text-center"><p className="text-sm">발급 실패</p><p className="font-bold text-xl text-red-700 dark:text-red-300">{errorCount}건</p></div>
                </div>
                 <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                             <tr>
                                <th className="px-4 py-2">학생명</th><th className="px-4 py-2">상태</th><th className="px-4 py-2">비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalResults.map(r => (
                                <tr key={r.student.id} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">{r.student.name}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${r.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{r.status}</span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{r.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <Button variant="secondary" onClick={() => alert('처리 로그가 다운로드됩니다.')}>로그 다운로드</Button>
                    <Button variant="secondary" onClick={() => alert('발급된 PDF 파일들을 ZIP으로 다운로드합니다.')}>PDF 전체 다운로드</Button>
                    <Button variant="primary" onClick={() => alert('성공한 학생들에게 이메일로 자동 통보합니다.')}>이메일 자동 통보</Button>
                     <Button variant="secondary" onClick={handleReset}>새로운 파일 처리</Button>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">외국인 유학생 입학허가서 발급</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        RPA 봇을 실행하여 대상자 명단 전체의 표준 입학허가서를 자동으로 일괄 발급합니다.
                    </p>
                </div>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">신규</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {
                    step === 'upload' ? renderUploadStep() :
                    step === 'processing' ? renderProcessingStep() :
                    renderResultsStep()
                }
            </div>
        </Card>
    );
};

export default AdmissionCertificateTool;
