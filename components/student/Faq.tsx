import React, { useState } from 'react';
import { FAQ_DATA } from '../../constants';

const FaqItem: React.FC<{ item: { question: string; answer: string }; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={onClick}
        className={`w-full flex justify-between items-center text-left py-4 px-1 transition-colors ${isOpen ? 'text-blue-700 dark:text-blue-300' : ''}`}
      >
        <span className="font-semibold text-gray-800 dark:text-gray-200">{item.question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-l-2 border-blue-600 ml-1 pl-5">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
};


const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문 (FAQ)</h3>
      <div className="mt-4">
        {FAQ_DATA.map((item, index) => (
          <FaqItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;