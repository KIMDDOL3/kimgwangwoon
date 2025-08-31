import React from 'react';

const ContactAdminCard: React.FC = () => {
  const adminPhoneNumber = '062-530-1234';

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">장학팀 문의</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        장학금 관련 문의사항은 아래 연락처로 문의바랍니다.
      </p>
      <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="text-gray-800 dark:text-gray-200 text-lg font-semibold">{adminPhoneNumber}</span>
      </div>
    </div>
  );
};

export default ContactAdminCard;