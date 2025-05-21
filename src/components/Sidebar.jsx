import React, { useEffect, useRef, useState } from "react";
import {
  FaChartBar,
  FaCrown,
  FaHome,
  FaShoppingCart,
  FaSlidersH,
} from "react-icons/fa";
import { IoCalendar, IoSettings } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";

import menuData from "../data/sidebar-menu";
import SidebarItem from "./SidebarItem";

import { useDarkMode } from "../context/DarkModeContext";
import useFarmStore from "../store/smartfarm-store";
import { useTranslation } from "react-i18next";
import usePersistentTab from "../context/usePersistentTab"; // ปรับ path ตามจริง

// Light Theme Styles
const lightSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f3f4f6",
    borderColor: state.isFocused ? "#4F81ED" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #4F81ED" : "none",
    "&:hover": { borderColor: "#4F81ED" },
    fontSize: "12px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#E5EFFF"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1f2937",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
};

// Dark Theme Styles
const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#667085" : "#374151",
    boxShadow: state.isFocused ? "0 0 0 1px #667085" : "none",
    color: "#ffffff",
    "&:hover": { borderColor: "#667085" },
    fontSize: "12px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111827",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#1E3A8A"
      : "#111827",
    color: state.isSelected ? "#ffffff" : "#f9fafb",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#FFFFFF" }),
  placeholder: (base) => ({ ...base, color: "#FFFFFF" }),
  input: (base) => ({ ...base, color: "#FFFFFF" }),
};

const iconMap = {
  FaHome: <FaHome />,
  FaCrown: <FaCrown />,
  FaShoppingCart: <FaShoppingCart />,
  FaSlidersH: <FaSlidersH />,
  IoSettings: <IoSettings />,
  FaChartBar: <FaChartBar />,
  IoCalendar: <IoCalendar />,
};

const SidebarContent = () => {
  const { t } = useTranslation();
  const [cropOptions, setCropOptions] = useState([]);
  const [hasLoadedCrop, setHasLoadedCrop] = useState(false);

  const { isDarkMode } = useDarkMode();
  const location = useLocation();
  const currentPath = location.pathname;

  // useEffect(() => {
  //   setActiveTab(currentPath);
  // }, [currentPath]);

  // ✅ ดึงจาก Zustand store ทั้งหมด
  const {
    farms,
    FarmList,
    cropList,
    selectedFarmCode,
    selectedCropCode,
    setSelectedFarmCode,
    setSelectedCropCode,
  } = useFarmStore();

  useEffect(() => {
    FarmList(); // โหลดรายการฟาร์ม
  }, [FarmList]);

  // ✅ โหลด crop list เมื่อ selectedFarmCode เปลี่ยน
  useEffect(() => {
    if (selectedFarmCode && !hasLoadedCrop) {
      handleFarmClick(selectedFarmCode);
    }
  }, [selectedFarmCode, hasLoadedCrop]);
  const handleFarmClick = async (farmCode) => {
    setSelectedFarmCode(farmCode);
    const result = await cropList(farmCode);

    if (result.success && Array.isArray(result.data)) {
      const formatted = resultFormat(result.data);
      setCropOptions(formatted);

      const isSelectedValid = formatted.some(
        (crop) => crop.value === selectedCropCode
      );
      if (!isSelectedValid) {
        const currentCrop = formatted.find((crop) => crop.isCurrent);
        if (currentCrop) {
          setSelectedCropCode(currentCrop.value);
        } else if (formatted.length > 0) {
          setSelectedCropCode(formatted[0].value);
        } else {
          setSelectedCropCode(null);
        }
      }

      setHasLoadedCrop(true);
    } else {
      setCropOptions([]);
      setSelectedCropCode(null);
      setHasLoadedCrop(true);
    }
  };
  const farmOptions = Array.isArray(farms)
    ? farms
        .slice()
        .sort((a, b) => {
          const aIsEn = /^[A-Za-z]/.test(a.FarmName);
          const bIsEn = /^[A-Za-z]/.test(b.FarmName);
          if (aIsEn && !bIsEn) return -1;
          if (!aIsEn && bIsEn) return 1;
          return a.FarmName.localeCompare(b.FarmName, "en");
        })
        .map((farm) => ({
          label: farm.FarmName,
          value: farm.FarmCode,
        }))
    : [];

  const resultFormat = (crops) => {
    return crops
      .map((crop) => {
        const start = new Date(crop.StartCrop).toLocaleDateString("en-GB");
        const end = new Date(crop.EndCrop).toLocaleDateString("en-GB");
        return {
          label:
            `Main Crop: ${crop.MainCrop} (${start} To ${end})` +
            (crop.StatusCrop === 1
              ? " [Active]"
              : crop.StatusCrop === 2
              ? " [Paused]"
              : ""),
          value: crop.CropCode,
          isCurrent: [1, 2].includes(crop.StatusCrop),
          StatusCrop: crop.StatusCrop, // เพิ่มไว้ให้ใช้ใน sort ด้านล่าง
          MainCrop: crop.MainCrop, // ⬅️ เพิ่มเก็บไว้ใช้ sort
        };
      })
      .sort((a, b) => {
        const statusRank = (s) =>
          s.StatusCrop === 1 ? 2 : s.StatusCrop === 2 ? 1 : 0;
        const rankDiff = statusRank(b) - statusRank(a);
        if (rankDiff !== 0) return rankDiff;

        // ถ้า status เดียวกัน ให้เรียง MainCrop ใหม่ไปเก่า
        return new Date(b.MainCrop) - new Date(a.MainCrop);
      });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-2 md:p-4 lg:p-6 flex-shrink-0">
        <div className="px-4 pb-2 text-xs text-gray-500 mt-4 mb-1 dark:text-gray-400 border-b border-gray-300">
          {t("sidebar.selectFarmAndCrop")}
        </div>
        <Select
          options={farmOptions}
          value={farmOptions.find((opt) => opt.value === selectedFarmCode)}
          onChange={(option) => {
            console.log("Selected farm ---->:", option);
            if (option?.value) {
              setHasLoadedCrop(false); // ✅ ทำให้โหลด crop ใหม่เมื่อ user เปลี่ยน farm
              handleFarmClick(option.value);
            }
          }}
          styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
          placeholder="Select Farm..."
          isSearchable
          className="w-full mb-2"
        />
        <Select
          options={cropOptions}
          value={cropOptions.find((opt) => opt.value === selectedCropCode)}
          onChange={(option) => {
            console.log("Selected Crop ---->:", option);
            setSelectedCropCode(option?.value); // 👈 ส่งออกไปเก็บไว้ใน store (หรือ state)
          }}
          styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
          placeholder="Select Crop..."
          isSearchable
          className="w-full"
        />
      </div>
      {/* 
ค่าที่ถูก "ส่งออก" คือ option.value
โดย option มาจาก cropOptions ซึ่งมาจาก resultFormat

และใน resultFormat นั้นมีการ map แบบนี้:
return {
  label: `Main Crop: ${crop.MainCrop} (${start} To ${end})${crop.StatusCrop === 1 ? " Current" : ""}`,
  value: crop.CropCode, //  CropCode ที่จะถูกส่งออกตอนเลือก
  isCurrent: crop.StatusCrop === 1,
  cropID: crop.CropCode,
};

เมื่อเราเลือก crop → option.value คือ crop.CropCode
ซึ่งจะถูกเซตไปที่ selectedCrop ผ่าน setSelectedCrop().

ให้ลองใส่ console.log(option) ใน onChange แล้วลองเลือกดูจะเห็นเลยว่า value = CropCode มั้ย
*/}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="px-2 md:px-4 md:pb-2 text-xs text-gray-500 dark:text-gray-400">
          {t("sidebar.menu")}
        </div>
        {menuData.map((menu, idx) => (
          <SidebarItem
            key={idx}
            icon={iconMap[menu.icon]}
            title={t(menu.title)}
            links={menu.links} // ✅ ส่งลิงก์ให้ SidebarItem เช็คเอง
          >
            <div>
              {menu.links.map((link, index) => {
                const isActive = currentPath.startsWith(link.to); // ✅ เช็กตาม URL จริง

                return (
                  <Link key={index} to={link.to}>
                    <div
                      className={`
      flex items-center justify-start pl-6 py-2 my-1 rounded-lg transition-colors
      text-xs font-medium cursor-pointer
      ${
        isActive
          ? "bg-white border-2 border-blue-200 text-blue-400 dark:border-[#1DCD9F] dark:bg-[#111111] dark:text-white"
          : "bg-white text-gray-700 dark:bg-[#222222] dark:text-gray-300"
      }
       hover:text-white hover:bg-[#A1C8FE] hover:border-white 
       dark:hover:text-[#1DCD9F] dark:hover:bg-white dark:hover:border-white
    `}
                    >
                      {t(link.label)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </SidebarItem>
        ))}
      </div>
    </div>
  );
};

const Sidebar = ({ sidebarOpen, toggleSidebar, setOpenMenu }) => {
  const sidebarRef = useRef(null);
  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (sidebarOpen) {
          toggleSidebar(false);
          setOpenMenu(false);
        }
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, toggleSidebar, setOpenMenu]);

  return (
    <div>
      <div
        ref={sidebarRef}
        className={`md:hidden transition-all duration-300 ease-in-out overflow-y-auto bg-white dark:bg-[#111111] dark:text-white ${
          sidebarOpen ? "max-h-[350px]" : "max-h-0"
        }`}
      >
        <div className="max-h-screen overflow-y-auto">
          <SidebarContent />
        </div>
      </div>
      <div className="hidden md:flex flex-col w-full min-h-screen bg-white text-gray-700 dark:bg-[#222222] dark:text-white">
        <SidebarContent />
      </div>
    </div>
  );
};

export default Sidebar;
