import React, { useState } from 'react';
import { AllScholarships } from '../../types';
import { SCHOLARSHIP_CATEGORIES } from '../../constants';
import ScholarshipFormModal from './ScholarshipFormModal';
import Button from '../ui/Button';

interface ManagementTableProps {
  scholarships: AllScholarships[];
  onAdd: (scholarship: AllScholarships) => void;
  onUpdate: (scholarship: AllScholarships) => void;
  onDelete: (scholarshipId: string) => void;
  onPushNotification: (scholarship: AllScholarships) => void;
}

const ScholarshipManagementTable: React.FC<ManagementTableProps> = ({ scholarships, onAdd, onUpdate, onDelete, onPushNotification }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState<AllScholarships | null>(null);

    const handleOpenAddModal = () => {
        setEditingScholarship(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (scholarship: AllScholarships) => {
        setEditingScholarship(scholarship);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingScholarship(null);
    };

    const handleSave = (scholarship: AllScholarships) => {
        if (editingScholarship) {
            onUpdate(scholarship);
        } else {
            onAdd(scholarship);
            alert('새로운 장학금이 추가되었습니다.');
        }
        handleCloseModal();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">장학금 관리</h2>
                <Button
                    onClick={handleOpenAddModal}
                    variant="primary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    새 장학금 추가
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">장학금명</th>
                            <th scope="col" className="px-6 py-3">유형</th>
                            <th scope="col" className="px-6 py-3">마감일</th>
                            <th scope="col" className="px-6 py-3">관리</th>
                            <th scope="col" className="px-6 py-3">알림</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scholarships.map(s => (
                            <tr key={s.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{s.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: `${SCHOLARSHIP_CATEGORIES[s.category].color}20`, color: SCHOLARSHIP_CATEGORIES[s.category].color }}>
                                        {SCHOLARSHIP_CATEGORIES[s.category].label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono">{s.deadline}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Button onClick={() => handleOpenEditModal(s)} variant="secondary">수정</Button>
                                    <Button onClick={() => onDelete(s.id)} variant="secondary">삭제</Button>
                                </td>
                                <td className="px-6 py-4">
                                    <Button onClick={() => onPushNotification(s)} variant="primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                        Push
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {scholarships.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">등록된 장학금이 없습니다.</p>}
            </div>
            {isModalOpen && (
                <ScholarshipFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    scholarship={editingScholarship}
                />
            )}
        </>
    );
};

export default ScholarshipManagementTable;