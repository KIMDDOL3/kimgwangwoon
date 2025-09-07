
import React from 'react';
import Card from '../ui/Card';

const SectionTitle: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
    <div className="flex items-center mb-4">
        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg mr-4">
            {icon}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
    </div>
);

const Box: React.FC<{ title: string; subtitle?: string; color: string; children?: React.ReactNode; className?: string }> = ({ title, subtitle, color, children, className }) => (
    <div className={`border-l-4 ${color} bg-gray-50 dark:bg-gray-800/60 p-4 rounded-r-md shadow-sm ${className}`}>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        {children && <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">{children}</div>}
    </div>
);

const Arrow: React.FC<{ label?: string, className?: string }> = ({ label, className }) => (
    <div className={`flex flex-col items-center justify-center my-2 mx-auto ${className}`}>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">{label}</span>
        <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
);

const AppBlueprint: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <Card>
                <h1 className="text-4xl font-black text-center mb-2">
                    <span className="text-gradient-aurora">앱 설계도 및 워크플로우</span>
                </h1>
                <p className="text-center text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    이 데모 앱의 아키텍처, 사용자 흐름, 핵심 로직을 시각적으로 설명하여 전체 구조를 쉽게 이해할 수 있도록 돕습니다.
                </p>
                 <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md mt-4 max-w-3xl mx-auto">
                    <strong>참고:</strong> 본 서비스는 실제 포털과 연동되지 않은 데모 버전입니다. 데이터는 브라우저의 LocalStorage에만 저장됩니다.
                </p>
            </Card>

            <Card>
                <SectionTitle
                    title="시스템 아키텍처 (System Architecture)"
                    subtitle="앱을 구성하는 기술 요소와 데이터 흐름입니다."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m0-10v2m0 6v2M6 12H4m16 0h-2m-10 0h2m6 0h2M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <Box title="Frontend" subtitle="사용자 인터페이스" color="border-blue-500">
                        <p>• React 19 & TypeScript</p>
                        <p>• Tailwind CSS (Styling)</p>
                        <p>• State: React Hooks (`useState`)</p>
                    </Box>

                    <div className="text-center text-gray-400 dark:text-gray-500 font-mono">
                        <p>&lt;-- API Call --&gt;</p>
                        <p>&lt;-- (HTTPS) --&gt;</p>
                    </div>

                    <div className="space-y-4">
                        <Box title="AI Service" subtitle="Google" color="border-green-500">
                            <p>• Gemini 2.5 Flash Model</p>
                            <p>• @google/genai SDK</p>
                        </Box>
                        <Box title="Data Layer (Demo)" subtitle="브라우저 저장소" color="border-yellow-500">
                            <p>• LocalStorage</p>
                            <p>• <strong>(상용화 시 Backend로 대체)</strong></p>
                        </Box>
                    </div>
                </div>
            </Card>
            
            <Card>
                <SectionTitle
                    title="업무 워크플로우 (Workflows)"
                    subtitle="사용자 역할에 따른 주요 기능 흐름입니다."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Student Workflow */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">👨‍🎓 학생 (Student)</h3>
                        <Box title="1. 로그인" subtitle="역할 선택" color="border-sky-500" />
                        <Arrow />
                        <Box title="2. 대시보드" subtitle="주요 정보 확인" color="border-sky-500">
                            <p>• 프로필, 공지, 추천 장학금</p>
                        </Box>
                        <Arrow />
                        <Box title="3. 장학금 탐색" color="border-sky-500">
                           <p>• <strong>AI 챗봇:</strong> 자연어 질의응답</p>
                           <p>• <strong>자가진단:</strong> 맞춤 추천</p>
                           <p>• <strong>정보 허브:</strong> 전체 목록 확인</p>
                        </Box>
                        <Arrow />
                         <Box title="4. 장학금 신청" subtitle="온라인 지원서 작성" color="border-sky-500">
                            <p>• AI 자기소개서 검토 기능</p>
                        </Box>
                    </div>

                    {/* Admin Workflow */}
                    <div className="space-y-2">
                         <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">👩‍💼 관리자 (Admin)</h3>
                         <Box title="1. 로그인" subtitle="역할 선택" color="border-violet-500" />
                        <Arrow />
                        <Box title="2. 대시보드" subtitle="전체 현황 파악" color="border-violet-500">
                             <p>• 통계, 처리 필요 업무 확인</p>
                        </Box>
                        <Arrow />
                        <Box title="3. 데이터 관리" color="border-violet-500">
                           <p>• <strong>장학금 관리:</strong> CRUD, Push 알림</p>
                           <p>• <strong>신청서 관리:</strong> 상태 변경</p>
                           <p>• <strong>Q&A 관리:</strong> 답변 등록</p>
                        </Box>
                        <Arrow />
                        <Box title="4. 업무 자동화" subtitle="RPA 도구 활용" color="border-violet-500">
                            <p>• 출근부 검증, 학적 조회 등</p>
                        </Box>
                    </div>
                </div>
            </Card>

            <Card>
                <SectionTitle
                    title="핵심 로직 (Core Logic)"
                    subtitle="앱의 주요 AI 및 데이터 처리 로직입니다."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>}
                />
                <div className="space-y-4">
                    <Box title="AI 챗봇 (RAG)" subtitle="services/geminiService.ts" color="border-fuchsia-500">
                        <p><strong>Retrieval-Augmented Generation (검색 증강 생성)</strong> 방식을 사용하여 답변의 정확도를 높입니다.</p>
                        <ol className="list-decimal list-inside mt-2 pl-2">
                            <li>사용자 질문에서 키워드를 추출합니다.</li>
                            <li>앱 내부 장학금 데이터(`constants.ts`)에서 관련 정보를 검색(Retrieval)합니다.</li>
                            <li>검색된 정보와 대화 기록을 컨텍스트로 포함하여 Gemini AI에게 프롬프트를 전달합니다.</li>
                            <li>AI는 제공된 컨텍스트를 기반으로 답변을 생성(Generation)합니다.</li>
                        </ol>
                    </Box>
                    <Box title="맞춤 장학금 추천 로직" subtitle="utils/scoring.ts" color="border-rose-500">
                         <p>자가진단 답변을 기반으로 각 장학금의 적합도 점수를 계산합니다.</p>
                         <ol className="list-decimal list-inside mt-2 pl-2">
                             <li><strong>1단계 (자격 필터링):</strong> 학년, 학과, 최소 학점, 소득분위 등 필수 요건을 충족하지 못하는 장학금을 제외합니다.</li>
                             <li><strong>2단계 (점수 계산):</strong> 자격 요건을 충족하는 장학금에 대해, 조건이 얼마나 구체적이고 까다로운지에 따라 가중치를 부여하여 점수를 매깁니다.</li>
                             <li><strong>3단계 (정렬):</strong> 계산된 점수가 높은 순으로 정렬하여 사용자에게 추천합니다.</li>
                         </ol>
                    </Box>
                </div>
            </Card>
        </div>
    );
};

export default AppBlueprint;
