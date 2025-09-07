import React from 'react';
import Card from '../ui/Card';
import { MOCK_AUTOMATION_LOGS, AutomationLog } from './rpaData'; // Assuming mock data is in rpaData

const WeeklyAutomationLog: React.FC = () => {
    
    const getStatusChip = (status: AutomationLog['status']) => {
        const styles = {
            'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'Completed with Errors': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };

    const getIcon = (taskName: string) => {
        if (taskName.includes('입학허가서')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
        if (taskName.includes('출근부')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;
    };

    return (
        <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="text-gradient-aurora">주간 자동화 처리 현황</span>
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {MOCK_AUTOMATION_LOGS.map(log => (
                    <div key={log.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-center">
                            <div className="mr-3">{getIcon(log.taskName)}</div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{log.taskName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">처리: {log.itemsProcessed}건 | {log.timestamp}</p>
                            </div>
                        </div>
                        {getStatusChip(log.status)}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default WeeklyAutomationLog;
