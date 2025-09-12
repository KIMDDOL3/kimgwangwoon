import React from 'react';
// FIX: Corrected import path
import { User } from '../../types';

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border-t-4 border-green-600">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12">
            <img src="/test.png" alt={user.name} className="w-full h-full rounded-full object-cover" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">안녕하세요, {user.name}님!</h2>
            <p className="text-gray-600 dark:text-gray-300">맞춤형 장학금 정보를 확인해보세요.</p>
        </div>
      </div>
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