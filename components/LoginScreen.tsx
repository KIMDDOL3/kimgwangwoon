


import React from 'react';
// FIX: Corrected import path
import { Role } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface LoginScreenProps {
  onRoleSelect: (role: Role) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onRoleSelect }) => {
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
      </Card>
    </div>
  );
};

export default LoginScreen;