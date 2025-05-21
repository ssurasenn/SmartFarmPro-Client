import React, { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // อ่านค่าจาก localStorage ตอนเริ่มต้น
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("dark-mode");
    return storedMode === "true"; // default เป็น false ถ้าไม่มีค่า
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // บันทึกค่าไว้ใน localStorage
    localStorage.setItem("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
