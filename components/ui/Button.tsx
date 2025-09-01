import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "font-bold py-2.5 px-5 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-300 dark:focus:ring-emerald-800",
    secondary: "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 focus:ring-gray-300 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 dark:text-gray-100 dark:focus:ring-gray-600",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-center justify-center">
        {children}
      </div>
    </button>
  );
};

export default Button;