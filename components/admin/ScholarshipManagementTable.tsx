import React, { useState, useRef, useEffect } from 'react';
// FIX: Corrected import paths
import { AllScholarships, CollaborationChannel } from '../../types';
import { SCHOLARSHIP_CATEGORIES } from '../../constants';
import ScholarshipFormModal from './ScholarshipFormModal';
import PushNotificationModal from './PushNotificationModal'; // New import
import Button from '../ui/Button';

interface ManagementTableProps {
  scholarships: AllScholarships[];
  onAdd: (scholarship: AllScholarships) => void;
  onUpdate: (scholarship: AllScholarships) => void;
  onDelete: (scholarshipId: string) => void;
  onPushNotification: (scholarship: AllScholarships, message: string) => void; // Updated signature
  isLoading: boolean;
  channels: CollaborationChannel[];
  onCreateChannel: (scholarshipId: string, scholarshipTitle:string) => CollaborationChannel | undefined;
  onNavigateToChannel: (channelId: string) => void;
}

const SkeletonRow: React.FC = () => (
    <tr className="bg-white/50 dark:bg-gray-800/50 border-b dark:border-gray-700/50">
        <td className="px-4 py-4"><div className="h-5 w-5 rounded skeleton-loader"></div></td>
        <td className="px-6 py-4"><div className="h-5 w-40 rounded skeleton-loader"></div></td>
        <td className="px-6 py-4"><div className="h-6 w-20 rounded-full skeleton-loader"></div></td>
        <td className="px-6 py-4"><div className="h-4 w-24 rounded skeleton-loader"></div></td>
        <td className="px-6 py-4 flex items-center gap-2">
            <div className="h-8 w-16 rounded-lg skeleton-loader"></div>
            <div className="h-8 w-16 rounded-lg skeleton-loader"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-8 w-20 rounded-lg skeleton-loader"></div>
        </td>
    </tr>
);

const ScholarshipManagementTable: React.FC<ManagementTableProps> = ({ scholarships, onAdd, onUpdate, onDelete, onPushNotification, isLoading, channels, onCreateChannel, onNavigateToChannel }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState<AllScholarships | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    const [isPushModalOpen, setIsPushModalOpen] = useState(false);
    const [scholarshipForPush, setScholarshipForPush] = useState<AllScholarships | null>(null);

    // FIX: Set indeterminate state on checkbox using a ref, as it's not a standard prop in React.
    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            selectAllCheckboxRef.current.indeterminate =
                selectedIds.size > 0 && selectedIds.size < scholarships.length;
        }
    }, [selectedIds, scholarships.length]);

    const handleOpenAddModal = () => {
        setEditingScholarship(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (scholarship: AllScholarships) => {
        setEditingScholarship(scholarship);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingScholarship(null);
    };

    const handleSave = (scholarship: AllScholarships) => {
        if (editingScholarship) {
            onUpdate(scholarship);
        } else {
            onAdd(scholarship);
            alert('새로운 장학금이 추가되었습니다.');
        }
        handleCloseFormModal();
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(scholarships.map(s => s.id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
        } else {
            newSelectedIds.add(id);
        }
        setSelectedIds(newSelectedIds);
    };
    
     const handleDeleteSelected = () => {
        if (window.confirm(`선택한 ${selectedIds.size}개의 장학금 정보를 정말로 삭제하시겠습니까?`)) {
            selectedIds.forEach(id => {
                onDelete(id);
            });
            setSelectedIds(new Set());
        }
    };


    const handleOpenPushModal = (scholarship: AllScholarships) => {
        setScholarshipForPush(scholarship);
        setIsPushModalOpen(true);
    };

    const handleClosePushModal = () => {
        setIsPushModalOpen(false);
        setScholarshipForPush(null);
    };

    const handleSendPushNotification = (message: string) => {
        if (scholarshipForPush) {
            onPushNotification(scholarshipForPush, message);
        }
        handleClosePushModal();
    };
    
    const handleChannelAction = (scholarship: AllScholarships) => {
        let channel = channels.find(c => c.scholarshipId === scholarship.id);
        if (!channel) {
            channel = onCreateChannel(scholarship.id, scholarship.title);
        }
        if (channel) {
            onNavigateToChannel(channel.id);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    <span className="text-gradient-aurora">장학금 관리</span>
                </h2>
                <div className="flex items-center gap-2">
                     {selectedIds.size > 0 && (
                        <Button
                            onClick={handleDeleteSelected}
                            variant="secondary"
                            disabled={isLoading}
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            선택 삭제 ({selectedIds.size})
                        </Button>
                    )}
                    <Button
                        onClick={handleOpenAddModal}
                        variant="primary"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        새 장학금 추가
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-300">
                        <tr>
                             <th scope="col" className="p-4">
                                <input
                                    type="checkbox"
                                    ref={selectAllCheckboxRef}
                                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    onChange={handleSelectAll}
                                    checked={scholarships.length > 0 && selectedIds.size === scholarships.length}
                                />
                            </th>
                            <th scope="col" className="px-6 py-3">장학금명</th>
                            <th scope="col" className="px-6 py-3">유형</th>
                            <th scope="col" className="px-6 py-3">마감일</th>
                            <th scope="col" className="px-6 py-3">관리</th>
                            <th scope="col" className="px-6 py-3">알림</th>
                            <th scope="col" className="px-6 py-3">업무 채널</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
                        ) : (
                            scholarships.map(s => (
                                <tr key={s.id} className="bg-white/50 dark:bg-gray-800/50 border-b dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-900/40">
                                     <td className="w-4 p-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={selectedIds.has(s.id)}
                                            onChange={() => handleSelectOne(s.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-lg text-gray-900 dark:text-white">{s.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${SCHOLARSHIP_CATEGORIES[s.category].className}`}>
                                            {SCHOLARSHIP_CATEGORIES[s.category].label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{s.deadline}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <Button onClick={() => handleOpenEditModal(s)} variant="secondary">수정</Button>
                                        <Button onClick={() => onDelete(s.id)} variant="secondary">삭제</Button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button onClick={() => handleOpenPushModal(s)} variant="primary" title={`'${s.title}' 알림 보내기`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                            Push
                                        </Button>
                                    </td>
                                     <td className="px-6 py-4">
                                        <Button
                                            onClick={() => handleChannelAction(s)}
                                            variant="secondary"
                                            className="text-xs py-1.5 px-3"
                                        >
                                            {channels.some(c => c.scholarshipId === s.id) ? '채널 보기' : '채널 생성'}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                 {!isLoading && scholarships.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">등록된 장학금이 없습니다.</p>}
            </div>
            {isFormModalOpen && (
                <ScholarshipFormModal
                    isOpen={isFormModalOpen}
                    onClose={handleCloseFormModal}
                    onSave={handleSave}
                    scholarship={editingScholarship}
                />
            )}
            {isPushModalOpen && scholarshipForPush && (
                <PushNotificationModal
                    isOpen={isPushModalOpen}
                    onClose={handleClosePushModal}
                    onSend={handleSendPushNotification}
                    scholarship={scholarshipForPush}
                />
            )}
        </>
    );
};

export default ScholarshipManagementTable;