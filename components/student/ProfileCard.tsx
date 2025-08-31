import React from 'react';
import { User } from '../../types';

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border-t-4 border-blue-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">안녕하세요, {user.name}님!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">맞춤형 장학금 정보를 확인하고 AI 도우미와 상담해보세요.</p>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-500 dark:text-gray-400">학번:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{user.universityId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-500 dark:text-gray-400">소속:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{user.department}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-500 dark:text-gray-400">학년:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{user.year}학년</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;