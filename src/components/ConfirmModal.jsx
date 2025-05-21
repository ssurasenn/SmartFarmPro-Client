import React, { useRef, useEffect } from "react";
import { CiWarning } from "react-icons/ci";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  action,
  title,
  description,
  confirmText,
  cancelText,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 text-center"
      >
        {/* ICON */}
        <div className="flex justify-center mb-3">
          <CiWarning className="text-5xl sm:text-6xl text-yellow-400" />
        </div>

        {/* TITLE */}
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {title}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300">{description}</p>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-end gap-2">
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 py-2 rounded font-semibold text-white ${
              action === "pause"
                ? "bg-[#A1C8FE] dark:bg-[#1DCD9F] hover:bg-[#82A9F4] dark:hover:bg-[#17B78C]"
                : "bg-red-400 dark:bg-red-600 hover:bg-red-500 dark:hover:bg-red-500"
            }`}
          >
            {confirmText || "ยืนยัน"}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {cancelText || "ยกเลิก"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
