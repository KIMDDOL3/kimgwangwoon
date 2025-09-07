
import React, { useMemo } from 'react';
// FIX: Corrected import paths
import { ApplicationData, ApplicationStatus } from '../../types';
import Card from '../ui/Card';

interface ApplicationStatsProps {
    applications: ApplicationData[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; iconBgClass: string; }> = ({ title, value, icon, iconBgClass }) => (
    <Card className="flex items-center space-x-4 p-4">
        <div className={`${iconBgClass} p-3 rounded-full`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </Card>
);

const ApplicationStats: React.FC<ApplicationStatsProps> = ({ applications }) => {
    const stats = useMemo(() => {
        const total = applications.length;
        const statusCounts = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<ApplicationStatus, number>);

        const scholarshipCounts = applications.reduce((acc, app) => {
            acc[app.scholarshipTitle] = (acc[app.scholarshipTitle] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        // FIX: Used a more explicit sort function (b[1] - a[1]) to ensure type safety.
        const topScholarships = Object.entries(scholarshipCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        return {
            total,
            applied: statusCounts.Applied || 0,
            awarded: statusCounts.Awarded || 0,
            rejected: statusCounts.Rejected || 0,
            topScholarships
        };
    }, [applications]);

    return (
        <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                <span className="text-gradient-aurora">장학금 신청 통계</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                    title="총 지원 건수" 
                    value={stats.total} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    iconBgClass="bg-blue-100 dark:bg-blue-900/50"
                />
                <StatCard 
                    title="지원 완료" 
                    value={stats.applied} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    iconBgClass="bg-blue-100 dark:bg-blue-900/50"
                />
                <StatCard 
                    title="최종 선정" 
                    value={stats.awarded} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    iconBgClass="bg-green-100 dark:bg-green-900/50"
                />
                <StatCard 
                    title="미선정" 
                    value={stats.rejected} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    iconBgClass="bg-red-100 dark:bg-red-900/50"
                />
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    <span className="text-gradient-aurora">가장 많이 지원한 장학금 Top 3</span>
                </h3>
                {stats.topScholarships.length > 0 ? (
                    <ul className="space-y-2">
                        {stats.topScholarships.map(([title, count], index) => (
                            <li key={title} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-8">{index + 1}.</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
                                </div>
                                <span className="font-bold text-green-600 dark:text-green-400">{count}회 지원</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">아직 접수된 지원서가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default ApplicationStats;
