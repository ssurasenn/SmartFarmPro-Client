import React from 'react';

const DarkMode = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center rounded-2xl shadow mx-auto bg-white text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold">Hello Test DarkMode!</h1>
      <button
        onClick={toggleDarkMode}
        className="mt-4 px-6 py-2 bg-gray-300 text-black dark:bg-gray-700 dark:text-white dark:hover:text-amber-200 rounded"
      >
        Test Toggle DarkMode
      </button>
    </div>
  );
};

export default DarkMode;
