import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); // 👈 เพิ่มตรงนี้

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
        <main
          className="bg-[#E6ECFF] flex-1 ml-0 md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto p-5 lg:px-10 lg:py-5 transition-all duration-300 rounded-2xl
        dark:bg-[#4A4947]"
        >
        {/* <main
          className="bg-[#E6ECFF] flex-1 ml-0  overflow-y-auto p-5 lg:px-10 lg:py-5 transition-all duration-300 rounded-2xl
        dark:bg-[#4A4947]"
        > */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default MainLayout;
