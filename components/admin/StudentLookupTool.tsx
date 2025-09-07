
import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { MOCK_STUDENT_DATABASE } from './automation/mockData';
// FIX: Corrected import path
import { StudentProfile, AllScholarships, ApplicationData } from '../../types';
import StudentProfileView from './StudentProfileView';

interface StudentLookupToolProps {
    allScholarships: AllScholarships[];
    allApplications: ApplicationData[];
}

const StudentLookupTool: React.FC<StudentLookupToolProps> = ({ allScholarships, allApplications }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();
        return MOCK_STUDENT_DATABASE.filter(student => 
            student.name.toLowerCase().includes(lowerCaseQuery) ||
            student.universityId.includes(lowerCaseQuery)
        );
    }, [searchQuery]);

    const handleSelectStudent = (student: StudentProfile) => {
        setSelectedStudent(student);
        setSearchQuery(''); 
    };
    
    const handleClearSelection = () => {
        setSelectedStudent(null);
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <Card>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    <span className="text-gradient-aurora">학생 프로필 조회 및 관리</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                    학생 이름 또는 학번으로 검색하여 상세 프로필, 지원 이력, 그리고 AI 기반 장학금 자격 요건 분석 결과를 확인하세요.
                </p>
            </Card>

            {selectedStudent ? (
                <StudentProfileView 
                    student={selectedStudent}
                    allScholarships={allScholarships}
                    studentApplications={allApplications.filter(app => app.userId === selectedStudent.id)}
                    onBack={handleClearSelection}
                />
            ) : (
                <Card>
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="학생 이름 또는 학번으로 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-50 border rounded-lg outline-none focus:bg-white focus:border-green-600 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:border-green-500"
                            />
                        </div>
                    </div>
                    {searchQuery && (
                         <div className="mt-6 max-w-xl mx-auto">
                            {searchResults.length > 0 ? (
                                <ul className="space-y-2">
                                    {searchResults.map(student => (
                                        <li key={student.id} onClick={() => handleSelectStudent(student)} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 cursor-pointer transition-colors duration-200">
                                            <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{student.universityId} | {student.department}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-4 text-gray-500 dark:text-gray-400">검색 결과가 없습니다.</p>
                            )}
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default StudentLookupTool;