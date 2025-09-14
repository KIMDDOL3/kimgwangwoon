import React from 'react';
import Card from '../../ui/Card';
import WorkStudyVerificationTool from './WorkStudyVerificationTool';
import ScholarshipStatusInquiryTool from './ScholarshipStatusInquiryTool';
// FIX: Corrected import path for rpaData
import { RPA_TASKS, STATUS_CONFIG } from '../rpaData';
import DataDisclosureTool from './DataDisclosureTool';
import DualCreditVerificationTool from './DualCreditVerificationTool';
import ExternalScholarshipMonitorTool from './ExternalScholarshipMonitorTool';
import StatusUpdateAutomationTool from './StatusUpdateAutomationTool'; // Import new component
import { ApplicationData, ApplicationStatus, AllScholarships } from '../../../types'; // Import types for props

// Add props interface
interface AutomationToolsProps {
    applicationData: ApplicationData[];
    onUpdateStatus: (userId: string, scholarshipId: string, submissionDate: string, newStatus: ApplicationStatus) => void;
    onAdd: (scholarship: AllScholarships) => void;
    onPushNotification: (scholarship: AllScholarships, message: string) => void;
}


const AutomationTools: React.FC<AutomationToolsProps> = ({ applicationData, onUpdateStatus, onAdd, onPushNotification }) => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <Card>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    <span className="text-gradient-aurora">업무 자동화 허브</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                    단순하고 반복적인 업무를 AI에게 맡기고 더 중요한 가치에 집중하세요. 
                    핵심 업무 자동화 기능을 통해 관리 효율성을 극대화하고 수작업으로 인한 오류를 줄입니다.
                </p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
               <WorkStudyVerificationTool />
               {/* Render new component and pass props */}
               <StatusUpdateAutomationTool applications={applicationData} onUpdateStatus={onUpdateStatus} />
               <ScholarshipStatusInquiryTool />
               <DataDisclosureTool />
               <DualCreditVerificationTool />
               <ExternalScholarshipMonitorTool onAdd={onAdd} onPushNotification={onPushNotification} />
            </div>
        </div>
    );
};

export default AutomationTools;