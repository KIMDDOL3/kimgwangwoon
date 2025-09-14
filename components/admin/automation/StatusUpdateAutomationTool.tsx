import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ApplicationData, ApplicationStatus } from '../../../types';

interface StatusUpdateAutomationToolProps {
    applications: ApplicationData[];
    onUpdateStatus: (userId: string, scholarshipId: string, submissionDate: string, newStatus: ApplicationStatus) => void;
}

const StatusUpdateAutomationTool: React.FC<StatusUpdateAutomationToolProps> = ({ applications, onUpdateStatus }) => {
    const [step, setStep] = useState<'idle' | 'processing' | 'results'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [updatedCount, setUpdatedCount] = useState(0);

    // Simulate the RPA process
    useEffect(() => {
        if (step !== 'processing') return;

        let isMounted = true;
        const processLogs: string[] = [];
        let updatesMade = 0;

        const addLog = (message: string) => {
            if (!isMounted) return;
            const timestamp = new Date().toLocaleTimeString();
            processLogs.push(`[${timestamp}] ${message}`);
            setLogs([...processLogs]);
        };

        const runSimulation = async () => {
            addLog("RPA 봇 시작: 장학금 신청 상태 동기화 프로세스를 시작합니다.");
            await new Promise(res => setTimeout(res, 1000));
            addLog("FIMS(학사정보시스템)에 로그인합니다...");
            await new Promise(res => setTimeout(res, 1500));
            addLog("로그인 성공. 신청 내역 조회 시작...");

            // Find applications that are still 'Applied'
            const pendingApplications = applications.filter(app => app.status === 'Applied');
            if (pendingApplications.length === 0) {
                addLog("모든 신청서가 이미 처리되었습니다. 동기화할 항목이 없습니다.");
            } else {
                // For demo, we'll pick a few to update
                const appsToUpdate = pendingApplications.slice(0, 3);
                
                for (const app of appsToUpdate) {
                    await new Promise(res => setTimeout(res, 1000));
                    addLog(`[조회] ${app.userName} (${app.universityId}) - '${app.scholarshipTitle}' 조회 중...`);
                    
                    // Simulate finding a new status. Let's cycle through Awarded and Rejected.
                    const newStatus: ApplicationStatus = updatesMade % 2 === 0 ? 'Awarded' : 'Rejected';
                    await new Promise(res => setTimeout(res, 1500));
                    addLog(`[발견] FIMS 시스템 상태: '${newStatus}'. 대시보드와 동기화가 필요합니다.`);
                    
                    // Call the update function passed via props
                    onUpdateStatus(app.userId, app.scholarshipId, app.submissionDate, newStatus);
                    updatesMade++;

                    await new Promise(res => setTimeout(res, 500));
                    addLog(`[성공] 대시보드 상태가 '${newStatus}'(으)로 업데이트되었습니다.`);
                }
                setUpdatedCount(updatesMade);
            }

            await new Promise(res => setTimeout(res, 1000));
            addLog("프로세스 완료. FIMS에서 로그아웃합니다.");
            if (isMounted) {
                setStep('results');
            }
        };

        runSimulation();

        return () => { isMounted = false; };
    }, [step, applications, onUpdateStatus]);

    const handleStart = () => {
        setStep('processing');
        setLogs([]);
        setUpdatedCount(0);
    };

    const handleReset = () => {
        setStep('idle');
        setLogs([]);
    };

    const renderContent = () => {
        switch (step) {
            case 'processing':
                return (
                    <div className="bg-gray-900 dark:bg-black font-mono text-xs text-gray-300 rounded-lg p-4 h-64 overflow-y-auto">
                        {logs.map((log, index) => (
                            <p key={index} className={`whitespace-pre-wrap ${log.includes('[성공]') ? 'text-green-400' : ''}`}>
                                {log}
                            </p>
                        ))}
                    </div>
                );
            case 'results':
                return (
                    <div className="text-center p-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">동기화 완료</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                           총 <span className="font-bold text-green-600 dark:text-green-400">{updatedCount}</span>건의 신청 상태가 FIMS 시스템과 성공적으로 동기화되었습니다.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            '신청서 관리' 탭에서 업데이트된 상태를 확인할 수 있습니다.
                        </p>
                        <div className="mt-6">
                            <Button onClick={handleReset} variant="primary">
                                다시 실행
                            </Button>
                        </div>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="text-center p-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            버튼을 클릭하여 RPA 봇을 실행합니다. 봇은 학사정보시스템(FIMS)을 스캔하여 변경된 신청 상태를 이 대시보드에 자동으로 동기화합니다.
                        </p>
                        <Button onClick={handleStart} variant="primary">
                            신청 상태 자동 동기화 시작
                        </Button>
                    </div>
                );
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">신청 상태 일괄 동기화</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        RPA 봇을 실행하여 학사정보시스템의 최종 선정 결과를 자동으로 업데이트합니다.
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

export default StatusUpdateAutomationTool;
