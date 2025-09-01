import React from 'react';
import Card from '../ui/Card'; // Use the consistent Card component

const ContactAdminCard: React.FC = () => {
  const adminPhoneNumber = '062-530-1234';
  const adminEmail = 'scholarships@jnu.ac.kr';
  const officeHours = '평일 09:00 - 18:00';

  const contactInfo = [
      {
          icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
          ),
          value: adminPhoneNumber,
          href: `tel:${adminPhoneNumber.replace(/-/g, '')}`,
          label: '전화번호'
      },
      {
          icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
          ),
          value: adminEmail,
          href: `mailto:${adminEmail}`,
          label: '이메일'
      },
      {
          icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
          ),
          value: officeHours,
          label: '운영시간'
      }
  ]

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">장학팀 문의</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        장학금 관련 문의사항은 아래 연락처로 문의바랍니다.
      </p>
      <div className="space-y-3">
        {contactInfo.map(info => (
            <div key={info.label} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                    {info.icon}
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{info.label}</p>
                    {info.href ? (
                         <a href={info.href} className="text-gray-800 dark:text-gray-200 font-semibold hover:underline">
                            {info.value}
                        </a>
                    ) : (
                        <p className="text-gray-800 dark:text-gray-200 font-semibold">{info.value}</p>
                    )}
                </div>
            </div>
        ))}
      </div>
    </Card>
  );
};

export default ContactAdminCard;
