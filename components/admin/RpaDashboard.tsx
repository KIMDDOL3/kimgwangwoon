
import React, { useMemo } from 'react';
import Card from '../ui/Card';
// FIX: Corrected import path for rpaData
import { RPA_TASKS, RPA_DASHBOARD_STATS, STATUS_CONFIG, RpaTask } from './rpaData';
import { RpaTaskStatus } from '../../types';

const StatCard: React.FC<{ title: string; value: string; subtext?: string; icon: React.ReactNode; }> = ({ title, value, subtext, icon }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtext && <p className="text-xs text-gray-500 dark:text-gray-400">{subtext}</p>}
        </div>
    </Card>
);

const BubbleChart: React.FC<{ tasks: RpaTask[] }> = ({ tasks }) => {
    const maxHours = Math.max(...tasks.map(t => t.annualHours), 0);

    return (
        <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="text-gradient-aurora">업무 자동화 기회 분석</span>
            </h3>
            <div className="relative w-full h-80 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border dark:border-gray-700">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-2 -ml-1">
                    <span>높음</span><span>적합도</span><span>낮음</span>
                </div>
                 {/* X-Axis Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 -mb-1">
                    <span>낮음</span><span>연간 소요시간</span><span>높음</span>
                </div>

                {tasks.map(task => {
                    const left = `${(task.annualHours / maxHours) * 90}%`; // 90% to keep bubbles inside
                    const bottom = `${((task.automationSuitability - 3) / 2) * 90}%`; // Scale 3-5 to 0-100%
                    const size = `${20 + task.errorRisk * 6}px`;

                    return (
                        <div
                            key={task.id}
                            className="absolute rounded-full bg-green-500/50 border-2 border-green-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                            style={{ left, bottom, width: size, height: size }}
                            title={task.title}
                        >
                             <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {task.title}
                                <br/>
                                <span className="text-gray-300">시간: {task.annualHours}h, 적합도: {task.automationSuitability}, 위험도: {task.errorRisk}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">버블 크기는 수작업 오류 위험도를 나타냅니다.</p>
        </Card>
    );
};

const PriorityTasks: React.FC<{ tasks: RpaTask[] }> = ({ tasks }) => {
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => b.automationSuitability - a.automationSuitability).slice(0, 5);
    }, [tasks]);

    return (
        <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="text-gradient-aurora">자동화 우선순위 업무</span>
            </h3>
            <div className="space-y-3">
                {sortedTasks.map(task => (
                    <div key={task.id}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</p>
                            <p className="font-mono text-gray-600 dark:text-gray-400">{task.automationSuitability.toFixed(1)}</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                             <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(task.automationSuitability / 5) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};


const TaskStatusTable: React.FC<{ tasks: RpaTask[] }> = ({ tasks }) => (
    <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-gradient-aurora">전체 업무 자동화 현황</span>
        </h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th className="px-4 py-3">업무명</th>
                        <th className="px-4 py-3">우선순위</th>
                        <th className="px-4 py-3">오류 위험도</th>
                        <th className="px-4 py-3">현재 상태</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id} className="border-b dark:border-gray-700">
                            <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{task.title}</td>
                            <td className="px-4 py-3 font-mono text-center">{task.priority}</td>
                            <td className="px-4 py-3 font-mono text-center">{task.errorRisk.toFixed(1)}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${STATUS_CONFIG[task.status].className}`}>
                                    {STATUS_CONFIG[task.status].label}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const RpaDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <Card>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <span className="text-gradient-aurora">RPA 전략 대시보드</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    데이터 기반 분석을 통해 RPA 도입 효과를 예측하고 우선순위를 관리합니다.
                </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="예상 연간 절약 시간"
                    value={`${RPA_DASHBOARD_STATS.annualTimeSaved.toLocaleString()} 시간`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                    title="목표 업무 정확도"
                    value={`${RPA_DASHBOARD_STATS.accuracyImprovement}%`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                 <StatCard 
                    title="핵심 업무 자동화"
                    value={`${RPA_DASHBOARD_STATS.automatedTasksCount} / ${RPA_TASKS.length} 개`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BubbleChart tasks={RPA_TASKS} />
                <PriorityTasks tasks={RPA_TASKS} />
            </div>

            <TaskStatusTable tasks={RPA_TASKS} />

        </div>
    );
};

export default RpaDashboard;