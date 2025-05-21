import React from 'react';

export default function Button({ children, onClick, className = '', variant = 'default', type = 'button' }) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'p-2 bg-[#A1C8FE] text-white dark:bg-[#1DCD9F] hover:bg-[#578FCA] dark:hover:bg-[#1dcd9ece] focus:ring-blue-500',
    outline: 'border border-gray-100 text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-[#BF3131] focus:ring-red-500',
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
