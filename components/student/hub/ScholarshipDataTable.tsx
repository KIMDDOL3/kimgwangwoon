import React, { useState, useMemo } from 'react';
import { AllScholarships, ScholarshipCategory, User } from '../../../types';
import { SCHOLARSHIP_CATEGORIES } from '../../../constants';
import Button from '../../ui/Button';

interface DataTableProps {
  scholarships: AllScholarships[];
  onAskAi: (scholarshipTitle: string) => void;
  onApply: (scholarship: AllScholarships) => void;
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

const ScholarshipDataTable: React.FC<DataTableProps> = ({ scholarships, onAskAi, onApply }) => {
  const [sourceFilter, setSourceFilter] = useState<'All' | 'Internal' | 'External'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ScholarshipCategory | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'deadline', direction: 'asc' });

  const filteredScholarships = useMemo(() => {
    return scholarships.filter(s => {
        const sourceMatch = sourceFilter === 'All' || s.source === sourceFilter;
        const categoryMatch = categoryFilter === 'All' || s.category === categoryFilter;
        return sourceMatch && categoryMatch;
    });
  }, [scholarships, sourceFilter, categoryFilter]);

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
      <div className="space-y-4 mb-4">
        {/* Source Filters */}
        <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-gray-600 dark:text-gray-300 mr-2">구분:</span>
            <button
              onClick={() => setSourceFilter('All')}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${sourceFilter === 'All' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              전체
            </button>
            <button
              onClick={() => setSourceFilter('Internal')}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${sourceFilter === 'Internal' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              교내
            </button>
            <button
              onClick={() => setSourceFilter('External')}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${sourceFilter === 'External' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              교외
            </button>
        </div>
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-gray-600 dark:text-gray-300 mr-2">유형:</span>
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${categoryFilter === 'All' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              전체
            </button>
            {Object.entries(SCHOLARSHIP_CATEGORIES).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key as ScholarshipCategory)}
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${categoryFilter === key ? 'bg-green-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {label}
              </button>
            ))}
        </div>
      </div>

      <div className="overflow-x-auto relative border border-white/20 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50/50 dark:bg-gray-700/50 dark:text-gray-300">
            <tr>
              <Th title="장학금명" sortKey="title" sortConfig={sortConfig} requestSort={requestSort} />
              <th scope="col" className="px-6 py-3">유형</th>
              <Th title="지급기관" sortKey="provider" sortConfig={sortConfig} requestSort={requestSort} />
              <Th title="신청마감" sortKey="deadline" sortConfig={sortConfig} requestSort={requestSort} />
              <th scope="col" className="px-6 py-3">신청/문의</th>
            </tr>
          </thead>
          <tbody>
            {sortedScholarships.map(s => (
              <tr key={s.id} className="bg-white/50 dark:bg-gray-800/50 border-b dark:border-gray-700/50 last:border-b-0 hover:bg-white/70 dark:hover:bg-gray-900/40 transition-colors">
                <td className="px-6 py-4 font-semibold text-lg text-gray-900 dark:text-white">{s.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${SCHOLARSHIP_CATEGORIES[s.category].className}`}>
                    {SCHOLARSHIP_CATEGORIES[s.category].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-base">{s.provider}</td>
                <td className="px-6 py-4 font-mono text-base">{s.deadline}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button onClick={() => onApply(s)} variant="primary" className="py-2 px-3">
                      온라인 지원
                    </Button>
                    <Button onClick={() => onAskAi(s.title)} variant="secondary" className="py-2 px-3">
                      AI 문의
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {sortedScholarships.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">해당 조건의 장학금이 없습니다.</p>}
    </div>
  );
};

export default ScholarshipDataTable;