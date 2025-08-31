import React, { useMemo } from 'react';
import { AllScholarships } from '../../types';
import Card from '../ui/Card';

interface AdminStatsProps {
    scholarships: AllScholarships[];
}

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center space-x-4 p-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </Card>
);

const AdminStats: React.FC<AdminStatsProps> = ({ scholarships }) => {

    const stats = useMemo(() => {
        const total = scholarships.length;
        const internal = scholarships.filter(s => s.source === 'Internal').length;
        const external = total - internal;
        return { total, internal, external };
    }, [scholarships]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="총 장학금 수" 
                value={stats.total} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
            />
             <StatCard 
                title="교내 장학금" 
                value={stats.internal} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            />
             <StatCard 
                title="교외/재단 장학금" 
                value={stats.external} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-2.387-.477a2 2 0 01-.547-1.806a2 2 0 011.806-.547l2.387.477a6 6 0 013.86-.517l.318-.158a6 6 0 003.86-.517l2.387-.477a2 2 0 011.806.547a2 2 0 01.547 1.806l-.477 2.387a6 6 0 01-.517 3.86l-.158.318a6 6 0 01-.517 3.86l-2.387.477a2 2 0 01-1.806-.547a2 2 0 01-.547-1.806l.477-2.387a6 6 0 01.517-3.86l.158-.318a6 6 0 00.517-3.86l2.387-.477a2 2 0 001.806-.547a2 2 0 00.547-1.806z" transform="translate(-4 -4) scale(0.8)"/></svg>}
            />
        </div>
    );
};

export default AdminStats;