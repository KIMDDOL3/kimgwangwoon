import React from 'react';
import { ApplicationData, ApplicationStatus } from '../../types';

interface ApplicationManagementTableProps {
  applications: ApplicationData[];
  onUpdateStatus: (userId: string, scholarshipId: string, submissionDate: string, newStatus: ApplicationStatus) => void;
}

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
    { value: 'Applied', label: '지원 완료' },
    { value: 'Awarded', label: '최종 선정' },
    { value: 'Rejected', label: '미선정' },
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Awarded: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const ApplicationManagementTable: React.FC<ApplicationManagementTableProps> = ({ applications, onUpdateStatus }) => {
    
    const sortedApplications = [...applications].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">학생 장학금 신청 관리</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">학생명</th>
                            <th scope="col" className="px-6 py-3">지원 장학금</th>
                            <th scope="col" className="px-6 py-3">제출 서류</th>
                            <th scope="col" className="px-6 py-3">지원일</th>
                            <th scope="col" className="px-6 py-3">상태 변경</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedApplications.map(app => (
                            <tr key={`${app.userId}-${app.scholarshipId}-${app.submissionDate}`} className="bg-white/50 dark:bg-gray-800/50 border-b dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-900/40">
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{app.userName}</td>
                                <td className="px-6 py-4">{app.scholarshipTitle}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                    {app.fileName ? (
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                            <span className="truncate" title={app.fileName}>{app.fileName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">없음</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-mono">{app.submissionDate}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={app.status}
                                        onChange={(e) => onUpdateStatus(app.userId, app.scholarshipId, app.submissionDate, e.target.value as ApplicationStatus)}
                                        className={`text-xs font-semibold rounded-md py-1.5 pl-3 pr-8 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800 appearance-none cursor-pointer ${STATUS_STYLES[app.status]}`}
                                    >
                                        {STATUS_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {applications.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">접수된 지원서가 없습니다.</p>}
            </div>
        </div>
    );
};

export default ApplicationManagementTable;