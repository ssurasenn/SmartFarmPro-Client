import React, { useState, useRef, useEffect } from "react";
import usePersistentTab from "../context/usePersistentTab"; // ปรับ path ตามที่คุณมี
import { IoNotifications } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const NotificationBtn = () => {
  const { t } = useTranslation();

  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  // ตัวอย่าง mock data สำหรับแจ้งเตือน
  // ✅ แจ้งเตือนเก็บใน state
  const [notifications, setNotifications] = useState([
    { id: 1, message: "มีการเพิ่มรายการใหม่", read: false },
    { id: 2, message: "ระบบจะปิดปรับปรุงคืนนี้เวลา 22:00", read: false },
    { id: 3, message: "คุณมีการแจ้งเตือนที่ยังไม่ได้อ่าน", read: false },
  ]);

  // ✅ count เฉพาะที่ยังไม่อ่าน
  const count = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // ✅ mark ว่าอ่านแล้ว
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  return (
    <div className="relative inline-block group" ref={dropdownRef}>
      <IoNotifications
        size={29}
        onClick={() => setOpen(!open)}
        className="text-gray-700 transition-transform duration-300 group-hover:animate-wiggle group-hover:scale-110 cursor-pointer"
      />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
      {open && (
        <div className="absolute md:right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 z-20">
          
          <ul className="py-2 max-h-64 overflow-y-auto">
            {notifications.filter((n) => !n.read).length > 0 ? (
              notifications
                .filter((n) => !n.read)
                .map((note) => (
                  <li
                    key={note.id}
                    onClick={() => markAsRead(note.id)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-400 dark:hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    {note.message}
                  </li>
                ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                {t("No notifications")}
              </li>
            )}
          </ul>
          <button
            onClick={() =>
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
              )
            }
            className="w-full text-xs text-right px-4 py-2 text-blue-500 dark:text-[#1DCD9F] hover:underline"
          >
            {t("Mark all as read")}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBtn;
