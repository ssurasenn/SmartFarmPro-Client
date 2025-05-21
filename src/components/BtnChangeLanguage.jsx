import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePersistentTab from "../context/usePersistentTab"; // ปรับ path ตามที่คุณมี

const BtnChangeLanguage = () => {
  const { i18n } = useTranslation();
  const dropdownRef = useRef(null);

  const [language, setLanguage] = usePersistentTab("language", "en");
  const [open, setOpen] = useState(false);

  const flagSrc = {
    en: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
    th: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg",
    es: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg",
    cn: "https://flagicons.lipis.dev/flags/4x3/cn.svg",
    ru: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg",
    vi: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
  };

  const languageNames = {
    en: "English",
    th: "ภาษาไทย",
    es: "Español",
    cn: "Chinese",     // 中文
    ru: "Russian",  // Russian
    vi: "Vietnamese"
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setOpen(false);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={flagSrc[language]}
          alt={languageNames[language]}
          className="w-6 h-4 object-cover rounded-sm"
        />
        <span className="text-sm text-black dark:text-white">
          {languageNames[language] || language}
        </span>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 z-20">
          <ul className="py-1">
            {["en", "th", "es", "cn", "ru", "vi"].map((lang) => (
              <li key={lang}>
                <button
                  onClick={() => handleSelectLanguage(lang)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-black dark:text-white flex items-center"
                >
                  <img
                    src={flagSrc[lang]}
                    alt={languageNames[lang]}
                    className="w-5 h-3 object-cover rounded-sm"
                  />
                  <span className="ml-2">{languageNames[lang]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BtnChangeLanguage;
