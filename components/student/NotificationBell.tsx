
import React, { useState, useRef, useEffect } from 'react';
// FIX: Corrected import path
import { AppNotification, AllScholarships } from '../../types';


interface NotificationBellProps {
    notifications: AppNotification[];
    onDismiss: (id: string) => void;
    onDismissAll: () => void;
    onAskAi: (scholarshipTitle: string) => void;
    allScholarships: AllScholarships[];
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onDismiss, onDismissAll, onAskAi, allScholarships }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleNotificationClick = (notification: AppNotification) => {
        const scholarship = allScholarships.find(s => s.id === notification.scholarshipId);
        if (scholarship) {
            onAskAi(scholarship.title);
        }
        onDismiss(notification.id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="relative text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">알림</h3>
                        {unreadCount > 0 && (
                             <button onClick={onDismissAll} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">모두 지우기</button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {unreadCount > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div className="flex justify-between items-start">
                                        <div onClick={() => handleNotificationClick(n)} className="flex-1 cursor-pointer">
                                            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{n.title}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{n.message}</p>
                                        </div>
                                        <button onClick={() => onDismiss(n.id)} className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">&times;</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">새로운 알림이 없습니다.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;