import React, { useState } from 'react';
import { AllScholarships, User } from '../../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (statement: string, file?: File) => void;
  scholarship: AllScholarships;
  user: User;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, onSubmit, scholarship, user }) => {
  const [statement, setStatement] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(statement, selectedFile || undefined);
  };
  
  const handleAiReview = async () => {
    setIsReviewing(true);
    setReviewFeedback(null);
    const { getStatementReview } = await import('../../services/geminiService');
    const feedback = await getStatementReview(statement);
    setReviewFeedback(feedback);
    setIsReviewing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type === 'application/pdf') {
        setSelectedFile(e.target.files[0]);
      } else {
        alert('PDF 파일만 업로드할 수 있습니다.');
        e.target.value = ''; 
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 transform transition-all duration-300 scale-95 animate-fade-in-up max-h-[90vh] overflow-y-auto">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="장학금이 필요한 이유와 학업 계획 등을 자유롭게 작성해주세요."
                required
              ></textarea>
            </div>
            
            <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    증빙서류 첨부 (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>파일 업로드</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                            </label>
                            <p className="pl-1">또는 파일을 끌어다 놓으세요</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PDF 파일만 가능, 10MB 이하</p>
                    </div>
                </div>
                 {selectedFile && (
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                        <span>
                            <strong className="font-semibold">선택된 파일:</strong> {selectedFile.name}
                        </span>
                        <button type="button" onClick={() => setSelectedFile(null)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-bold">&times;</button>
                    </div>
                )}
            </div>

            {isReviewing && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">AI가 자기소개서를 검토하고 있습니다...</p>
                </div>
            )}
            {reviewFeedback && (
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/50 border-l-4 border-indigo-500 rounded-r-lg">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">AI 검토 의견</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{reviewFeedback}</p>
                </div>
            )}
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
              type="button"
              onClick={handleAiReview}
              disabled={isReviewing || !statement.trim()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-green-400 dark:disabled:bg-green-800 disabled:cursor-not-allowed"
            >
              AI 검토받기
            </button>
            <button
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
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