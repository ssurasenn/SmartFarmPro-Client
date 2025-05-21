import React from 'react';

export default function Input({ type = 'text', value, onChange, name, placeholder = 'Enter Event...', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full text-sm px-3 py-2 border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-600 
        placeholder-gray-400 dark:placeholder-gray-300
        ${className}`}
    />
  );
}
