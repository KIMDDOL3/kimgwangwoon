import React from 'react';
import { Role } from '../types';

interface LoginScreenProps {
  onRoleSelect: (role: Role) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onRoleSelect }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-auto text-blue-700 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">CNU 장학 AI 도우미</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">역할을 선택하여 시작하세요.</p>
        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect('student')}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            학생으로 시작하기
          </button>
          <button
            onClick={() => onRoleSelect('admin')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-800"
          >
            관리자로 시작하기
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          본 서비스는 실제 포털과 연동되지 않은 데모 버전입니다.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;