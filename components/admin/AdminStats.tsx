
import React, { useMemo } from 'react';
// FIX: Corrected import path
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
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
                iconBgClass="bg-green-100 dark:bg-green-900/50"
            />
            <StatCard 
                title="교외 장학금" 
                value={stats.external} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
                iconBgClass="bg-amber-100 dark:bg-amber-900/50"
            />
        </div>
    );
};

export default AdminStats;
