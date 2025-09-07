
import React, { useState, useMemo } from 'react';
// FIX: Corrected import path
import { StudentProfile, AllScholarships, ApplicationData, ApplicationStatus, ScoredScholarship, DiagnosticAnswers } from '../../types';
import { scoreScholarships } from '../../utils/scoring';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface StudentProfileViewProps {
    student: StudentProfile;
    allScholarships: AllScholarships[];
    studentApplications: ApplicationData[];
    onBack: () => void;
}

const getStatusChip = (status: ApplicationStatus) => {
    const styles: Record<ApplicationStatus, string> = {
      Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Awarded: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    const labels: Record<ApplicationStatus, string> = { Applied: '지원 완료', Awarded: '선정', Rejected: '미선정' };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{labels[status]}</span>;
};

const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-600 dark:text-green-400';
    if (score > 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
};


const StudentProfileView: React.FC<StudentProfileViewProps> = ({ student, allScholarships, studentApplications, onBack }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<ScoredScholarship[]>([]);

    const handleRunAnalysis = () => {
        setIsAnalyzing(true);
        setAnalysisResults([]);
        
        const answers: DiagnosticAnswers = {
            year: student.year,
            department: student.department,
            gpa: student.gpa,
            incomeBracket: student.incomeBracket,
        };

        setTimeout(() => {
            const allReqBasedScholarships = allScholarships.filter(s => s.requirements);
            const results = scoreScholarships(answers, allReqBasedScholarships);
            setAnalysisResults(results);
            setIsAnalyzing(false);
        }, 1500);
    };

    const getBarColor = (score: number) => {
        if (score > 80) return 'bg-green-500';
        if (score > 50) return 'bg-yellow-500';
        return 'bg-gray-400';
    };


    return (
        <Card>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{student.universityId}</p>
                </div>
                <Button onClick={onBack} variant="secondary">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    목록으로
                </Button>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
                <div><p className="text-sm text-gray-500">학과</p><p className="font-semibold text-gray-800 dark:text-gray-200">{student.department}</p></div>
                <div><p className="text-sm text-gray-500">학년</p><p className="font-semibold text-gray-800 dark:text-gray-200">{student.year}학년</p></div>
                <div><p className="text-sm text-gray-500">학점(GPA)</p><p className="font-semibold text-gray-800 dark:text-gray-200">{student.gpa.toFixed(2)}</p></div>
                <div><p className="text-sm text-gray-500">소득분위</p><p className="font-semibold text-gray-800 dark:text-gray-200">{student.incomeBracket}구간</p></div>
            </div>

            {/* AI Analysis Section */}
            <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">AI 자격 요건 분석</h4>
                <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <Button onClick={handleRunAnalysis} disabled={isAnalyzing}>
                         {isAnalyzing ? '분석 중...' : '적합 장학금 분석 실행'}
                    </Button>
                    {isAnalyzing && <p className="text-sm text-gray-500 mt-2">학생 프로필을 기반으로 AI가 적합한 장학금을 분석 중입니다...</p>}
                    
                    {analysisResults.length > 0 && (
                         <div className="mt-4">
                            <h5 className="font-semibold mb-3">분석 결과: 추천 장학금 Top 5</h5>
                            <ul className="space-y-4">
                                {analysisResults.slice(0, 5).map(s => (
                                    <li key={s.id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.title}</span>
                                            <span className={`text-sm font-bold ${getScoreColor(s.score)}`}>{s.score}% 일치</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div 
                                                className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getBarColor(s.score)}`} 
                                                style={{ width: `${s.score}%` }}
                                            ></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Application History Section */}
            <div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">지원 이력 ({studentApplications.length}건)</h4>
                 <div className="overflow-x-auto max-h-80 border rounded-lg dark:border-gray-700">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                            <tr>
                                <th className="px-4 py-3">지원 장학금</th>
                                <th className="px-4 py-3">지원일</th>
                                <th className="px-4 py-3">상태</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-gray-200">
                            {studentApplications.length > 0 ? studentApplications.map((app, index) => (
                                <tr key={index} className="border-b dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <td className="px-4 py-3 font-semibold">{app.scholarshipTitle}</td>
                                    <td className="px-4 py-3 font-mono">{app.submissionDate}</td>
                                    <td className="px-4 py-3">{getStatusChip(app.status)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">지원 이력이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </Card>
    );
};

export default StudentProfileView;