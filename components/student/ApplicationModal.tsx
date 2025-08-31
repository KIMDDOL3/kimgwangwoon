import React, { useState } from 'react';
import { Scholarship, User } from '../../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (statement: string) => void;
  scholarship: Scholarship;
  user: User;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, onSubmit, scholarship, user }) => {
  const [statement, setStatement] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(statement);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">온라인 지원서</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">장학금명</label>
              <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">{scholarship.title}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이름</label>
                <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">학번</label>
                <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">{user.universityId}</p>
              </div>
            </div>
            <div>
              <label htmlFor="statement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">자기소개 및 지원동기</label>
              <textarea
                id="statement"
                rows={5}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="장학금이 필요한 이유와 학업 계획 등을 자유롭게 작성해주세요."
                required
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;