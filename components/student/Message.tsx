import React from 'react';
// FIX: Import AllScholarships type to handle unified scholarship objects.
import { ChatMessage, Scholarship, ExternalScholarship, User, AllScholarships } from '../../types';
import ScholarshipList from './ScholarshipList';

interface MessageProps {
  message: ChatMessage;
  user: User;
}

const BotAvatar: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        AI
    </div>
);

const TypingIndicator: React.FC<{text: string}> = ({text}) => (
    <div className="flex items-center space-x-2 p-3">
        <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
    </div>
);

// FIX: Updated the type guard to handle both AllScholarships and raw ExternalScholarship objects.
// This allows for correctly identifying any external scholarship source.
const isExternalScholarship = (source: AllScholarships | ExternalScholarship): source is (AllScholarships & { source: 'External' }) | ExternalScholarship => {
  return ('source' in source && source.source === 'External') || 'foundation' in source;
};


const Message: React.FC<MessageProps> = ({ message, user }) => {
  const isBot = message.sender === 'bot';

  if (message.isLoading) {
    return (
      <div className="flex items-start space-x-3">
        <BotAvatar />
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <TypingIndicator text={message.text || '답변을 생성 중입니다...'} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 ${!isBot && 'justify-end'}`}>
      {isBot && <BotAvatar />}
      <div className={`max-w-md`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isBot
              ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
              : 'bg-blue-700 text-white rounded-br-none'
          }`}
        >
          {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
        </div>

        {isBot && message.sources && message.sources.length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <h5 className="font-semibold text-xs mb-2 text-gray-600 dark:text-gray-300">답변에 사용된 정보</h5>
              <div className="flex flex-col space-y-2">
                  {message.sources.map(source => (
                      <div key={source.id} className="text-sm text-gray-800 dark:text-gray-200">
                         <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <span>{source.title}</span>
                         </div>
                         {/* FIX: Updated logic to correctly display provider/foundation for both AllScholarships and ExternalScholarship types. */}
                         {isExternalScholarship(source) && (
                            <div className="ml-6 text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full">교외</span> {'provider' in source ? source.provider : source.foundation}
                            </div>
                         )}
                      </div>
                  ))}
              </div>
          </div>
        )}
        
        {message.recommendations && message.recommendations.length > 0 && (
          <div className="mt-3">
            <ScholarshipList scholarships={message.recommendations} user={user} />
          </div>
        )}

        {message.actions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.handler}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold py-2 px-4 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;