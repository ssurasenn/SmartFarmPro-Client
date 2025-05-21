import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Dialog({ open, onClose, children }) {
  const dialogRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg shadow-gray-600 max-w-md w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-3xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
