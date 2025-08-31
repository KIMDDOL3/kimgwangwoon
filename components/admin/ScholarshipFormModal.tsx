import React, { useState, useEffect } from 'react';
import { AllScholarships, ScholarshipCategory, ScholarshipSource } from '../../types';
import { SCHOLARSHIP_CATEGORIES } from '../../constants';
import Button from '../ui/Button';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scholarship: AllScholarships) => void;
  scholarship: AllScholarships | null;
}

const emptyScholarship: AllScholarships = {
    id: '',
    title: '',
    category: 'Other',
    source: 'Internal',
    provider: '전남대학교',
    summary: '',
    deadline: '',
    applicationUrl: '#',
    fullDescription: '',
    requirements: {},
};

const ScholarshipFormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSave, scholarship }) => {
  const [formData, setFormData] = useState<AllScholarships>(scholarship || emptyScholarship);

  useEffect(() => {
    setFormData(scholarship || emptyScholarship);
  }, [scholarship]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRequirementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert comma-separated string to array of numbers for allowedYears
    if (name === 'allowedYears') {
        const years = value.split(',').map(item => Number(item.trim())).filter(year => !isNaN(year) && year > 0);
        setFormData(prev => ({ ...prev, requirements: { ...prev.requirements, [name]: years } }));
        return;
    }
    
    // Convert comma-separated string to array of strings for allowedDepartments
    if (name === 'allowedDepartments') {
        const depts = value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, requirements: { ...prev.requirements, [name]: depts } }));
        return;
    }

    // Handle numeric inputs for GPA and incomeBracket
    const isNumeric = ['minGpa', 'incomeBracket'].includes(name);
    setFormData(prev => ({
        ...prev,
        requirements: {
            ...prev.requirements,
            [name]: isNumeric ? Number(value) : value,
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {scholarship ? '장학금 정보 수정' : '새 장학금 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">장학금명</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">카테고리</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        {Object.entries(SCHOLARSHIP_CATEGORIES).map(([key, {label}]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">구분</label>
                    <select name="source" value={formData.source} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <option value="Internal">교내</option>
                        <option value="External">교외</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">지급기관</label>
                    <input type="text" name="provider" value={formData.provider} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">한 줄 요약</label>
                <input type="text" name="summary" value={formData.summary} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">상세 설명</label>
                <textarea name="fullDescription" rows={4} value={formData.fullDescription} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">신청 마감일</label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">신청 URL</label>
                    <input type="text" name="applicationUrl" value={formData.applicationUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            {/* Requirements - Always visible, but with a title indicating context */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">상세 지원 자격 (선택)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">최소 GPA</label>
                        <input type="number" step="0.01" name="minGpa" value={formData.requirements?.minGpa || ''} onChange={handleRequirementChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">소득 분위 (이하)</label>
                        <input type="number" name="incomeBracket" value={formData.requirements?.incomeBracket || ''} onChange={handleRequirementChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">대상 학년 (쉼표로 구분)</label>
                        <input type="text" name="allowedYears" value={formData.requirements?.allowedYears?.join(', ') || ''} onChange={handleRequirementChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">대상 학과 (쉼표로 구분)</label>
                        <input type="text" name="allowedDepartments" value={formData.requirements?.allowedDepartments?.join(', ') || ''} onChange={handleRequirementChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" onClick={onClose} variant="secondary">취소</Button>
                <Button type="submit" variant="primary">저장하기</Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipFormModal;