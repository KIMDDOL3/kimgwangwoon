import React, { useMemo } from 'react';
import { AllScholarships } from '../../types';
import Card from '../ui/Card';

interface AdminStatsProps {
    scholarships: AllScholarships[];
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
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
                iconBgClass="bg-blue-100 dark:bg-blue-900/50"
            />
             <StatCard 
                title="교내 장학금" 
                value={stats.internal} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                iconBgClass="bg-emerald-100 dark:bg-emerald-900/50"
            />
             <StatCard 
                title="교외/재단 장학금" 
                value={stats.external} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600 dark:text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.757 15.243l.213.213a2 2 0 01.015 2.814l-.015.015L7.5 19l-2.243 2.243a2 2 0 01-2.814 0l-.213-.213a2 2 0 010-2.814l.015-.015.213-.213L4 18l2.243-2.243a2 2 0 012.814-.015zM6.243 7.757l-.213-.213a2 2 0 01-.015-2.814l.015-.015L6.5 4l2.243-2.243a2 2 0 012.814 0l.213.213a2 2 0 010 2.814l-.015.015-.213.213L10 6l-2.243 2.243a2 2 0 01-2.814.015z" /></svg>}
                iconBgClass="bg-violet-100 dark:bg-violet-900/50"
            />
        </div>
    );
};

export default AdminStats;