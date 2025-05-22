import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";

import { MdSunny } from "react-icons/md";

import LogoSmartFarm from "../assets/Logo-SmartFarmPro.png";
import { Link } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import ProfileBtn from "./ProfileBtn";
import BtnChangeLanguage from "./BtnChangeLanguage";
import NotificationBtn from "./NotificationBtn";

const Navbar = ({ toggleSidebar, openMenu, setOpenMenu }) => {
  const [openRightMenu, setOpenRightMenu] = useState(false);
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const leftMenuRef = useRef(null);    // 👉 ฝั่งซ้าย
  const rightMenuRef = useRef(null);   // 👉 ฝั่งขวา

  const handleToggleDarkmode = () => {
    setIsDarkMode(!isDarkMode);
    // toggleNavbar();
  };
  const handleToggleMenu = () => {
    setOpenMenu(!openMenu);
    toggleSidebar(); // เรียกใช้
  };
  const hdlToggleRightMenu = () => {
    setOpenRightMenu(!openRightMenu);
  };

  // ✅ Close both menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        leftMenuRef.current &&
        !leftMenuRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }

      if (
        rightMenuRef.current &&
        !rightMenuRef.current.contains(event.target)
      ) {
        setOpenRightMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenMenu]);
  return (
    <div className="flex justify-between items-center p-4 bg-white  dark:bg-[#222222] dark:text-white">
    {/* <div className="hidden  justify-between items-center p-4 bg-white  dark:bg-[#222222] dark:text-white"> */}
      <div className="flex items-center gap-4">

        {/* <<<<---- Hamburger Btn Mobile Screen --->>>> */}
        <button className="md:hidden text-2xl" onClick={handleToggleMenu}>
          {!openMenu ? (
            <FaBars className="rounded-md hover:bg-[#D2E6FF]  dark:hover:bg-[#1DCD9F] cursor-pointer" />
          ) : (
            <IoClose
              size={30}
              className="rounded-md hover:bg-[#D2E6FF]  dark:hover:bg-[#1DCD9F] cursor-pointer"
            />
          )}
        </button>

        <Link to="/overview/house">
          <img
            src={LogoSmartFarm}
            alt="Logosmartfarmpro"
            className=" w-[250px] lg:w-[390px] object-cover"
          />
        </Link>
      </div>

      {/* <<<<---- Section RightBtn Screen--->>>> */}
      <div className="hidden md:flex  items-center gap-4 mr-4">
        <NotificationBtn />
        <div
          onClick={handleToggleDarkmode}
          className={`w-10 h-6 cursor-pointer rounded-full flex items-center px-1 transition-all duration-300 ${
            isDarkMode ? "bg-[#1DCD9F] justify-end" : "bg-gray-700 justify-start"
          }`}
        >
          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md">
            {isDarkMode ? (
              <MdSunny size={15} className="text-[#1DCD9F]" />
            ) : (
              <FaMoon size={15} className="text-gray-700" />
            )}
          </div>
        </div>
        <BtnChangeLanguage />
        <ProfileBtn />
      </div>

      {/* <<------------ Right Menu Btn Mobile Screen------------------->> */}
      <div className="md:hidden relative" ref={rightMenuRef}>
        <button onClick={hdlToggleRightMenu} className="p-2">
          {openRightMenu ? (
            <RiCloseLine size={30} className="rounded-md hover:bg-[#D2E6FF] dark:hover:bg-[#1DCD9F] cursor-pointer" />
          ) : (
            <BsThreeDotsVertical size={24} className="rounded-md hover:bg-[#D2E6FF] dark:hover:bg-[#1DCD9F] cursor-pointer" />
          )}
        </button>

        {openRightMenu && (
          <div className="absolute flex flex-row items-center justify-between right-0 mt-1 bg-gray-100 dark:bg-[#111111] shadow-md z-50 rounded-md w-screen px-15 py-3 gap-5 duration-200">
            <div className="flex items-center gap-3">
              <NotificationBtn />
              <div
                onClick={handleToggleDarkmode}
                className={`w-10 h-6 cursor-pointer rounded-full flex items-center px-1 transition-all duration-300 ${
                  isDarkMode ? "bg-[#1DCD9F] justify-end" : "bg-gray-700 justify-start"
                }`}
              >
                <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
                  {isDarkMode ? (
                    <MdSunny size={15} className="text-[#1DCD9F] " />
                  ) : (
                    <FaMoon size={15} className="text-gray-700" />
                  )}
                </div>
              </div>

            <BtnChangeLanguage />
            </div>
            <ProfileBtn />
          </div>
        )}
      </div>

      {/* <<---- Example Mobile Sidebar (จำลองไว้ใน Navbar เพื่อเดโม) ---->> 
      {openMenu && (
        <div
          ref={leftMenuRef}
          className="absolute top-16 left-0 w-[250px] h-[calc(100vh-4rem)] bg-white dark:bg-[#222] z-50 shadow-md p-4 lg:hidden"
        >
          <p className="text-sm text-gray-800 dark:text-white">เมนูซ้าย (Hamburger Sidebar)</p>
          {/* Add real sidebar content here
        </div>
      )}
      */}
      
      
    </div>
  );
};

export default Navbar;
