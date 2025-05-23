import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); 
  const [showFooter, setShowFooter] = useState(false);
  const sentinelRef = useRef(null); //  element ดัก scroll

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFooter(entry.isIntersecting); // 👈 ถ้าเลื่อนถึงแล้ว ให้แสดง footer
      },
      {
        root: null,
        threshold: 1.0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#222222] overflow-hidden">
      {/* Navbar */}
      <Navbar
        toggleSidebar={() => {
          setSidebarOpen(!sidebarOpen);
          setOpenMenu(!openMenu); // 👈 อัปเดตด้วย
          
        }}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />

      <div className="flex flex-1 overflow-y-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 absolute left-0 bg-[#222222] h-full lg:top-[-30px] ">
        {/* <div className="hidden  w-64 absolute left-0 bg-[#222222] h-full lg:top-[-30px] "> */}
          <Sidebar 
            sidebarOpen={true}
            toggleSidebar={() => {}} // ส่งฟังก์ชันเปล่าเพื่อป้องกัน error
            setOpenMenu={() => {}} // ส่งฟังก์ชันเปล่าเพื่อป้องกัน error
            />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden absolute left-0 w-full bg-gray-200 max-h-screen overflow-y-auto z-20">
            <Sidebar
              sidebarOpen={sidebarOpen}
              toggleSidebar={setSidebarOpen}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu} // 👈 ส่งเข้าไป
            />
          </div>
        )}

        {/* Main Content */}
    <div className="flex flex-col flex-1 ml-0 md:ml-64 overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 lg:px-8 lg:py-4 bg-gradient-to-b from-[#c5ddfe] to-white dark:from-gray-700 dark:to-gray-300 rounded-t-2xl">
        {/* <main
          className="bg-[#E6ECFF] flex-1 ml-0  overflow-y-auto p-5 lg:px-10 lg:py-5 transition-all duration-300 rounded-2xl
        dark:bg-[#4A4947]"
        > */}
          <Outlet />
          <div ref={sentinelRef} className="h-1" /> {/*  ตัวตรวจจับ scroll */}
        </main>
        {/* Footer ถูก render เสมอ แต่แค่ซ่อนไว้ */}
          <div
    className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-500 pointer-events-none ${
      showFooter ? "opacity-100" : "opacity-0"
    }`}
  >
    <Footer />
  </div>
      </div>
      </div>
    </div>
  );
};


export default MainLayout;
