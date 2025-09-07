
import React from 'react';
import Card from '../../ui/Card';
import AdmissionCertificateTool from './AdmissionCertificateTool';

const InternationalAffairsDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <Card>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    <span className="text-gradient-aurora">국제협력과 업무 자동화</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                    외국인 유학생 관련 반복적인 행정 업무를 자동화하여 처리 효율성을 높이고, 
                    학생 지원 및 국제 교류와 같은 고부가가치 업무에 집중할 수 있도록 지원합니다.
                </p>
            </Card>

            <AdmissionCertificateTool />
        </div>
    );
};

export default InternationalAffairsDashboard;