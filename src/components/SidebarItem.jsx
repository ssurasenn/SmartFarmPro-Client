import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useLocation } from "react-router-dom";

const SidebarItem = ({ icon, title, children, links = [] }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hoverTimeout = useRef(null); //  ใช้ useRef เพื่อเก็บ timeout


  const hasActiveChild = links.some(link => location.pathname.startsWith(link.to));

    useEffect(() => {
    if (hasActiveChild) {
      setOpen(true);
    }
  }, [hasActiveChild]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 👈 เปลี่ยนตาม breakpoint ที่ใช้
    };

    handleResize(); // เรียกตอน mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      hoverTimeout.current = setTimeout(() => setOpen(true), 300);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeout.current);
      if (!hasActiveChild) setOpen(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setOpen(prev => !prev);
    }
  };

  return (
    <div
      className="mb-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick} 
    >
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-md
          font-semibold text-sm cursor-pointer duration-100 hover:shadow-lg
          ${hasActiveChild || open
            ? "bg-[#A1C8FE] text-white dark:bg-[#1DCD9F] dark:text-white"
            : "text-gray-600 hover:bg-[#A1C8FE] hover:text-white dark:text-white dark:hover:bg-[#1DCD9F]"}`
        }
      >
        {icon}
        <span>{title}</span>
        {children && (
          <IoIosArrowDown
            className={`ml-auto transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          />
        )}
      </div>

      {open && children && (
        <div className="px-4 text-xs">
          {children}
        </div>
      )}
    </div>
  );
};


export default SidebarItem;
