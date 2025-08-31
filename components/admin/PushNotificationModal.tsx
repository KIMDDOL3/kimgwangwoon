
import React, { useState } from 'react';
import { AllScholarships } from '../../types';
import Button from '../ui/Button';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  scholarship: AllScholarships;
}

const PushNotificationModal: React.FC<PushNotificationModalProps> = ({ isOpen, onClose, onSend, scholarship }) => {
  const [message, setMessage] = useState(`새로운 장학금 '${scholarship.title}' 정보가 업데이트되었습니다. 지금 확인해보세요!`);

  if (!isOpen) return null;

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
    } else {
      alert("알림 메시지를 입력해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
        <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            푸시 알림 보내기
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">&times;</button>
        </div>
        <div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">대상 장학금</label>
                <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 font-semibold">{scholarship.title}</p>
            </div>
            <div>
                <label htmlFor="pushMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">알림 메시지</label>
                <textarea
                    id="pushMessage"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="학생들에게 보낼 메시지를 입력하세요."
                    required
                />
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" onClick={onClose} variant="secondary">취소</Button>
            <Button type="button" onClick={handleSend} variant="primary">알림 전송</Button>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationModal;
