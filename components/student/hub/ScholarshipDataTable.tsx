import React, { useState, useMemo } from 'react';
import { AllScholarships, ScholarshipCategory } from '../../../types';
import { SCHOLARSHIP_CATEGORIES } from '../../../constants';

interface DataTableProps {
  scholarships: AllScholarships[];
  onAskAi: (scholarshipTitle: string) => void;
}

type SortKey = 'title' | 'provider' | 'deadline';
type SortDirection = 'asc' | 'desc';

const Th: React.FC<{
    sortKey: SortKey;
    title: string;
    sortConfig: { key: SortKey; direction: SortDirection };
    requestSort: (key: SortKey) => void;
}> = ({ sortKey, title, sortConfig, requestSort }) => {
    const isSorted = sortConfig.key === sortKey;
    const SortIcon = () => (
        <span className="ml-1.5">
            {isSorted ? (
                sortConfig.direction === 'asc' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg> 
                : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
            )}
        </span>
    );

    return (
        <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort(sortKey)}>
            <div className="flex items-center">
                {title}
                <SortIcon />
            </div>
        </th>
    );
};

const ScholarshipDataTable: React.FC<DataTableProps> = ({ scholarships, onAskAi }) => {
  const [filter, setFilter] = useState<ScholarshipCategory | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'deadline', direction: 'asc' });

  const filteredScholarships = useMemo(() => {
    return scholarships.filter(s => filter === 'All' || s.category === filter);
  }, [scholarships, filter]);

  const sortedScholarships = useMemo(() => {
    const sortableItems = [...filteredScholarships];
    sortableItems.sort((a, b) => {
      let aValue: string | Date = a[sortConfig.key];
      let bValue: string | Date = b[sortConfig.key];

      if (sortConfig.key === 'deadline') {
        const isADate = !isNaN(new Date(aValue).getTime());
        const isBDate = !isNaN(new Date(bValue).getTime());
        if (!isADate) return 1;
        if (!isBDate) return -1;
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [filteredScholarships, sortConfig]);

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('All')}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${filter === 'All' ? 'bg-blue-700 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
          전체
        </button>
        {Object.entries(SCHOLARSHIP_CATEGORIES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setFilter(key as ScholarshipCategory)}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${filter === key ? 'bg-blue-700 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto relative border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <Th title="장학금명" sortKey="title" sortConfig={sortConfig} requestSort={requestSort} />
              <th scope="col" className="px-6 py-3">유형</th>
              <Th title="지급기관" sortKey="provider" sortConfig={sortConfig} requestSort={requestSort} />
              <Th title="신청마감" sortKey="deadline" sortConfig={sortConfig} requestSort={requestSort} />
              <th scope="col" className="px-6 py-3">AI 문의</th>
            </tr>
          </thead>
          <tbody>
            {sortedScholarships.map(s => (
              <tr key={s.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{s.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: `${SCHOLARSHIP_CATEGORIES[s.category].color}20`, color: SCHOLARSHIP_CATEGORIES[s.category].color }}>
                    {SCHOLARSHIP_CATEGORIES[s.category].label}
                  </span>
                </td>
                <td className="px-6 py-4">{s.provider}</td>
                <td className="px-6 py-4 font-mono">{s.deadline}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onAskAi(s.title)} 
                    className="bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 font-semibold py-1.5 px-3 rounded-full text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    title={`'${s.title}'에 대해 AI에게 질문하기`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.837 8.837 0 01-4.43-1.252l-1.396.485a.5.5 0 01-.61-.61l.485-1.396A8.837 8.837 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.707 14.293a6.837 6.837 0 004.243 1.957 7.002 7.002 0 007-7c0-2.83-2.488-5.23-5.83-5.553a.5.5 0 01-.17-.971A8.002 8.002 0 0118 10c0 3.313-3.134 6-7 6a7.837 7.837 0 01-3.69-1.006l-1.854.642a1.5 1.5 0 01-1.82-1.82l.642-1.854A7.837 7.837 0 014 10c0-.341.042-.675.12-1a.5.5 0 01.97.24A6.994 6.994 0 004 10c0 1.58.68 3.024 1.77 4.068a.5.5 0 01-.063.225z" clipRule="evenodd" /></svg>
                    AI 질문
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {sortedScholarships.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">해당 카테고리의 장학금이 없습니다.</p>}
    </div>
  );
};

export default ScholarshipDataTable;