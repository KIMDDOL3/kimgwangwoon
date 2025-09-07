
import React from 'react';
// FIX: Corrected import path
import { Role } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

// RFP (Request for Proposal) content as constants
const RFP_GCP_SPECIFIC_MD = `
# 전남대학교 장학금 AI Assistant 고도화 프로젝트 입찰 제안 요청서 (RFP)

## 1. 프로젝트 개요

*   **프로젝트명**: 전남대학교 장학금 AI Assistant 고도화 및 상용화
*   **프로젝트 목표**: 현재 개발된 프로토타입을 기반으로, 실제 전남대학교 학생 및 관리자가 안정적으로 사용할 수 있는 고성능, 확장 가능한 정식 웹 애플리케이션으로 완성하는 것을 목표로 합니다.
*   **주요 기능**:
    *   **학생용**: 맞춤 장학금 자가진단, AI 챗봇을 통한 자연어 질의응답, 전체 장학금 정보 탐색, 온라인 지원 및 이력 관리, Q&A 게시판.
    *   **관리자용**: 대시보드, 장학금 정보 CRUD, 학생 지원서 관리, Q&A 답변 관리, RPA 기반 업무 자동화 도구, 학생 프로필 조회.
*   **현황**: React, TypeScript, Tailwind CSS 기반의 프론트엔드 프로토타입이 구현되어 있으며, Google Gemini API를 활용한 핵심 기능이 동작하고 있습니다. 데이터는 현재 로컬 스토리지 및 상수 파일에 의존하고 있어 백엔드 시스템 구축이 시급합니다.

## 2. 작업 범위 (Statement of Work)

*   **A. 백엔드 시스템 신규 개발**
    *   **요구사항**: 현재 \`localStorage\` 기반의 데이터 처리 구조를 대체할 안정적인 서버 및 데이터베이스 시스템을 구축합니다.
    *   **세부 과업**:
        1.  **데이터베이스 설계 및 구축**: 사용자, 장학금, 신청 내역, Q&A 등 모든 데이터를 관리할 수 있는 관계형 데이터베이스(예: PostgreSQL) 스키마 설계 및 구축.
        2.  **API 서버 개발**: 프론트엔드와 데이터를 주고받을 수 있는 안전하고 효율적인 RESTful API 서버 구축 (예: Node.js/NestJS).
        3.  **사용자 인증/인가**: 학생/관리자 역할 기반의 안전한 로그인 및 접근 제어(RBAC) 기능 구현 (JWT 또는 OAuth 2.0 기반).
        4.  **파일 스토리지 연동**: 장학금 신청 시 제출하는 서류(PDF 등)를 안전하게 업로드하고 관리할 수 있는 클라우드 스토리지(예: GCS, S3) 연동.

*   **B. AI 기능 고도화**
    *   **요구사항**: AI 챗봇의 정확성과 안정성을 높이고, API 키를 안전하게 관리합니다.
    *   **세부 과업**:
        1.  **Gemini API 호출 백엔드 이전**: 현재 클라이언트 측에서 직접 호출하는 Gemini API를 백엔드 서버를 통해 호출하도록 변경하여 API 키를 보호하고 요청을 중앙에서 관리.
        2.  **RAG(검색 증강 생성) 시스템 강화**:
            *   장학금 관련 정보(공지, 상세 설명 등)를 벡터 임베딩으로 변환.
            *   Vector DB(예: Pinecone)를 구축하여, 사용자 질문 의도에 가장 정확한 정보를 찾아 Gemini API에 컨텍스트로 제공함으로써 답변 정확도 극대화.
        3.  **채팅 이력 관리**: 사용자별 채팅 이력을 데이터베이스에 저장하여 이전 대화 내용을 기억하고 이어갈 수 있는 기능 구현.

*   **C. 프론트엔드 고도화**
    *   **요구사항**: 기존 프로토타입 코드의 품질을 높이고, UI/UX를 개선하여 사용자 경험을 극대화합니다.
    *   **세부 과업**:
        1.  **코드 리팩토링 및 최적화**: 재사용성, 유지보수성, 성능을 고려하여 전체 코드베이스를 검토하고 개선.
        2.  **UI/UX 개선**: 전반적인 디자인 시스템을 정립하고, 사용자 동선을 최적화하며, 모든 디바이스에 대응하는 반응형 디자인 완성. 웹 접근성(A11y) 표준 준수.
        3.  **상태 관리 도입**: 복잡해질 애플리케이션 상태를 효율적으로 관리하기 위한 전역 상태 관리 라이브러리(예: Redux Toolkit, Zustand) 도입 검토 및 적용.
        4.  **API 연동**: 신규 개발된 백엔드 API와 안정적으로 통신하도록 데이터 fetching 로직 전면 개편 (예: SWR, React Query 사용).

*   **D. 인프라 구축 및 배포 자동화**
    *   **요구사항**: 안정적인 서비스 운영을 위한 클라우드 인프라 구축 및 CI/CD 파이프라인을 통한 배포 자동화를 구현합니다.
    *   **세부 과업**:
        1.  **클라우드 인프라 설계 및 구축**: 서비스 규모와 특성을 고려한 최적의 클라우드(예: GCP, AWS) 인프라 설계 및 프로비저닝.
        2.  **CI/CD 파이프라인 구축**: GitHub Actions 등을 활용하여 코드 변경 시 자동으로 테스트, 빌드, 배포가 이루어지는 파이프라인 구축.
        3.  **보안 및 모니터링**: SSL 적용, 방화벽 설정 등 기본적인 보안 조치를 수행하고, 서비스 상태를 모니터링할 수 있는 시스템 구축.

## 3. 기술 스택 (Technical Stack)

*   **현재 스택 (참고용)**
    *   Frontend: React 19, TypeScript, Tailwind CSS
    *   AI: \`@google/genai\` (Gemini API)
*   **권장 스택 (제안사에서 더 나은 스택 제안 가능)**
    *   **Frontend**: **Next.js**, TypeScript, Tailwind CSS, SWR/React Query
    *   **Backend**: **Node.js (NestJS)**, TypeScript
    *   **Database**: **PostgreSQL**
    *   **Vector DB**: Pinecone, ChromaDB 등
    *   **Infrastructure**: Vercel (Frontend), **Google Cloud Platform** (Backend, DB)
    *   **CI/CD**: GitHub Actions

## 4. 업무 지침 (Work Guidelines)

*   **프로젝트 관리**: 애자일(Scrum) 방법론을 기반으로 2주 단위 스프린트로 프로젝트를 진행합니다. Jira, Asana 등 협업 도구를 사용합니다.
*   **커뮤니케이션**: Slack 등 지정된 채널을 통해 상시 소통하며, 주 1회 정기적인 진행 상황 공유 회의를 진행합니다.
*   **코드 품질**:
    *   모든 코드는 Git(GitHub)을 통해 버전 관리되며, Pull Request 기반의 코드 리뷰를 의무화합니다.
    *   ESLint, Prettier를 사용한 코딩 컨벤션을 준수합니다.
    *   Google GenAI SDK 사용 가이드라인을 철저히 준수합니다.
*   **문서화**: 개발 과정에서 API 명세서, 시스템 아키텍처, DB 스키마 등 주요 산출물에 대한 문서를 작성하고 현행화합니다.

## 5. 최종 산출물 (Deliverables)

1.  안정적으로 배포 및 운영되는 웹 애플리케이션
2.  전체 소스 코드 (Git Repository 접근 권한 포함)
3.  기술 문서 (시스템 아키텍처, API 명세서, ERD, 배포 가이드 등)
4.  CI/CD 파이프라인 구성 스크립트
5.  테스트 계획서 및 결과 보고서

## 6. 제안서 제출 안내

*   **제출 항목**:
    1.  회사 소개서 (유사 프로젝트 포트폴리오 포함)
    2.  상세 작업 계획 및 일정 (WBS 포함)
    3.  세부 항목별 견적서
    4.  투입 인력 프로필 및 역할
    5.  제안 기술 스택 및 시스템 아키텍처
*   **제출 기한**: YYYY년 MM월 DD일
*   **제출처 및 문의**: 담당자 OOO (contact@example.com)

## 7. 업체 선정 기준

*   기술 전문성 및 유사 프로젝트 수행 경험 (40%)
*   프로젝트 요구사항 이해도 및 제안의 구체성 (30%)
*   프로젝트 관리 및 커뮤니케이션 역량 (15%)
*   견적의 합리성 (15%)
`;

const RFP_GENERIC_MD = `
# 전남대학교 장학금 AI Assistant 고도화 프로젝트 제안 요청서 (RFP)

## 1. 프로젝트 개요

*   **프로젝트명**: 전남대학교 장학금 AI Assistant 고도화 및 상용화
*   **프로젝트 목표**: 현재 개발된 프로토타입을 기반으로, 실제 전남대학교 학생 및 관리자가 안정적으로 사용할 수 있는 고성능, 확장 가능한 정식 웹 애플리케이션으로 완성하는 것을 목표로 합니다.
*   **주요 기능**:
    *   **학생용**: 맞춤 장학금 자가진단, AI 챗봇을 통한 자연어 질의응답, 전체 장학금 정보 탐색, 온라인 지원 및 이력 관리, Q&A 게시판.
    *   **관리자용**: 대시보드, 장학금 정보 CRUD, 학생 지원서 관리, Q&A 답변 관리, RPA 기반 업무 자동화 도구, 학생 프로필 조회.
*   **현황**: React, TypeScript 기반의 프론트엔드 프로토타입이 구현되어 있으며, Google Gemini API를 활용한 핵심 기능이 동작하고 있습니다. 데이터는 현재 로컬 스토리지 및 상수 파일에 의존하고 있어 백엔드 시스템 구축이 시급합니다.

## 2. 작업 범위 (Statement of Work)

### A. 백엔드 시스템 신규 개발

*   **요구사항**: 현재 \`localStorage\` 기반의 데이터 처리 구조를 대체할 안정적이고 확장 가능한 서버 및 데이터베이스 시스템을 구축합니다.
*   **세부 과업**:
    1.  **데이터베이스 설계 및 구축**: 사용자, 장학금, 신청 내역, Q&A 등 모든 데이터를 관리할 수 있는 관계형 데이터베이스(예: PostgreSQL, MySQL) 스키마 설계 및 구축.
    2.  **API 서버 개발**: 프론트엔드와 데이터를 주고받을 수 있는 안전하고 효율적인 RESTful API 서버 구축. (예: Node.js/NestJS, Java/Spring 등 제안사의 주력 기술 스택 제안)
    3.  **사용자 인증/인가**: 학생/관리자 역할 기반의 안전한 로그인 및 접근 제어(RBAC) 기능 구현. (JWT 또는 OAuth 2.0 기반)
    4.  **파일 스토리지 연동**: 장학금 신청 시 제출하는 서류(PDF 등)를 안전하게 업로드하고 관리할 수 있는 오브젝트 스토리지(예: AWS S3, Azure Blob Storage, NCP Object Storage 등) 연동.

### B. AI 기능 고도화

*   **요구사항**: AI 챗봇의 정확성과 안정성을 높이고, API 키를 안전하게 관리합니다.
*   **세부 과업**:
    1.  **Gemini API 호출 백엔드 이전**: 현재 클라이언트 측에서 직접 호출하는 Gemini API를 백엔드 서버를 통해 호출하도록 변경하여 API 키를 보호하고 요청을 중앙에서 관리.
    2.  **RAG(검색 증강 생성) 시스템 강화**:
        *   장학금 관련 정보(공지, 상세 설명 등)를 벡터 임베딩으로 변환.
        *   Vector DB(예: Weaviate, Milvus, Pinecone 등)를 구축하여, 사용자 질문 의도에 가장 정확한 정보를 찾아 Gemini API에 컨텍스트로 제공함으로써 답변 정확도 극대화.
    3.  **채팅 이력 관리**: 사용자별 채팅 이력을 데이터베이스에 저장하여 이전 대화 내용을 기억하고 이어갈 수 있는 기능 구현.

### C. 프론트엔드 고도화

*   **요구사항**: 기존 프로토타입 코드의 품질을 높이고, UI/UX를 개선하여 사용자 경험을 극대화합니다.
*   **세부 과업**:
    1.  **코드 리팩토링 및 최적화**: 재사용성, 유지보수성, 성능을 고려하여 전체 코드베이스를 검토하고 개선.
    2.  **UI/UX 개선**: 전반적인 디자인 시스템을 정립하고, 사용자 동선을 최적화하며, 모든 디바이스에 대응하는 반응형 디자인 완성. 웹 접근성(A11y) 표준 준수.
    3.  **상태 관리 도입**: 복잡해질 애플리케이션 상태를 효율적으로 관리하기 위한 전역 상태 관리 라이브러리(예: Redux Toolkit, Zustand) 도입 및 적용.
    4.  **API 연동**: 신규 개발된 백엔드 API와 안정적으로 통신하도록 데이터 fetching 로직 전면 개편. (예: SWR, React Query 사용 권장)

### D. 인프라 구축 및 배포 자동화

*   **요구사항**: 안정적인 서비스 운영을 위한 클라우드 인프라 구축 및 CI/CD 파이프라인을 통한 배포 자동화를 구현합니다.
*   **세부 과업**:
        1.  **클라우드 인프라 설계 및 구축**: 서비스의 안정성, 확장성, 비용 효율성을 고려한 최적의 클라우드 인프라(예: AWS, Azure, NCP 등) 설계 및 구축 제안.
        2.  **CI/CD 파이프라인 구축**: GitHub Actions, Jenkins, GitLab CI 등 표준 도구를 활용하여 코드 변경 시 자동으로 테스트, 빌드, 배포가 이루어지는 파이프라인 구축.
        3.  **보안 및 모니터링**: SSL 적용, 방화벽 설정 등 기본적인 보안 조치를 수행하고, 서비스 상태를 모니터링할 수 있는 시스템 구축.

## 3. 기술 스택 (Technical Stack)

*   **현재 스택 (참고용)**
    *   **Frontend**: React 19, TypeScript, Tailwind CSS
    *   **AI**: \`@google/genai\` (Gemini API)
*   **권장 스택 (제안사에서 더 효율적인 스택을 자유롭게 제안 가능)**
    *   **Frontend**: **Next.js**, TypeScript, Tailwind CSS, SWR/React Query
    *   **Backend**: **Node.js (NestJS)** 또는 **Java (Spring Boot)**
    *   **Database**: **PostgreSQL** 또는 **MySQL**
    *   **Vector DB**: Weaviate, Milvus, ChromaDB 등
    *   **Infrastructure**: 주요 클라우드 서비스 제공자 (AWS, Azure, NCP 등)
    *   **CI/CD**: GitHub Actions, Jenkins, GitLab CI 등

## 4. 업무 지침 (Work Guidelines)

*   **프로젝트 관리**: 애자일(Scrum) 방법론을 기반으로 2주 단위 스프린트로 프로젝트를 진행합니다. Jira, Asana 등 협업 도구를 사용합니다.
*   **커뮤니케이션**: Slack 등 지정된 채널을 통해 상시 소통하며, 주 1회 정기적인 진행 상황 공유 회의를 진행합니다.
*   **코드 품질**:
    *   모든 코드는 Git(GitHub)을 통해 버전 관리되며, Pull Request 기반의 코드 리뷰를 의무화합니다.
    *   ESLint, Prettier를 사용한 코딩 컨벤션을 준수합니다.
    *   Google GenAI SDK 사용 가이드라인을 철저히 준수합니다.
*   **문서화**: 개발 과정에서 API 명세서(Swagger/OpenAPI), 시스템 아키텍처, DB 스키마(ERD) 등 주요 산출물에 대한 문서를 작성하고 현행화합니다.

## 5. 최종 산출물 (Deliverables)

1.  안정적으로 배포 및 운영되는 웹 애플리케이션
2.  전체 소스 코드 (Git Repository 접근 권한 포함)
3.  기술 문서 (시스템 아키텍처, API 명세서, ERD, 배포 가이드 등)
4.  CI/CD 파이프라인 구성 스크립트
5.  테스트 계획서 및 결과 보고서

## 6. 제안서 제출 안내

*   **제출 항목**:
    1.  회사 소개서 (유사 프로젝트 포트폴리오 포함)
    2.  상세 작업 계획 및 일정 (WBS 포함)
    3.  세부 항목별 견적서
    4.  투입 인력 프로필 및 역할
    5.  제안 기술 스택 및 시스템 아키텍처
*   **제출 기한**: YYYY년 MM월 DD일
*   **제출처 및 문의**: 담당자 OOO (contact@example.com)

## 7. 업체 선정 기준

*   기술 전문성 및 유사 프로젝트 수행 경험 (40%)
*   프로젝트 요구사항 이해도 및 제안의 구체성 (30%)
*   프로젝트 관리 및 커뮤니케이션 역량 (15%)
*   견적의 합리성 (15%)
`;


interface LoginScreenProps {
  onRoleSelect: (role: Role) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onRoleSelect }) => {
  const gcpRfpDataUri = `data:text/markdown;charset=utf-8,${encodeURIComponent(RFP_GCP_SPECIFIC_MD)}`;
  const genericRfpDataUri = `data:text/markdown;charset=utf-8,${encodeURIComponent(RFP_GENERIC_MD)}`;
  
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg text-center animate-fade-in-down">
        <div className="mb-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 19 7.5 19s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19s-3.332-.477-4.5-1.253" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">전남대학교 장학금 AI Assistant</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">역할을 선택하여 시작하세요.</p>
        <div className="space-y-4">
          <Button
            onClick={() => onRoleSelect('student')}
            variant="primary"
            className="w-full text-lg py-3"
          >
            학생으로 시작하기
          </Button>
          <Button
            onClick={() => onRoleSelect('admin')}
            variant="secondary"
            className="w-full text-lg py-3"
          >
            관리자로 시작하기
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
          본 서비스는 실제 포털과 연동되지 않은 데모 버전입니다.
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700/50 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">외주용역 입찰 제안요청서 (RFP) 샘플</h4>
            <div className="flex justify-center items-center space-x-6">
                <a
                  href={gcpRfpDataUri}
                  download="RFP_CNU_AI_Assistant_GCP.md"
                  className="flex items-center text-xs text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  GCP 기반 버전
                </a>
                <a
                  href={genericRfpDataUri}
                  download="RFP_CNU_AI_Assistant_Generic.md"
                  className="flex items-center text-xs text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  클라우드 범용 버전
                </a>
              </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginScreen;
