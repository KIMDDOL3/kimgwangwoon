import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white/50 dark:bg-gray-900/50 
      backdrop-blur-xl 
      rounded-2xl 
      shadow-lg 
      p-6 
      border border-white/20
      transition-all duration-300 
      hover:shadow-2xl hover:border-white/40
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;