import React, { useEffect, useMemo, useRef, useState } from "react";
import usePersistentTab from "../../context/usePersistentTab";
import BreedStandard from "./BreedStandard";
import FeedPlanning from "./FeedPlanning";
import { useTranslation } from "react-i18next";

const Upload = () => {
  const { t } =useTranslation();
  
  const [selectedTab, setSelectedTab] = usePersistentTab(
    "Breed Standard",
    "upload-breedstandard"
  );
  const tabs = useMemo(
      () => [
        { key: "upload-breedstandard", label: t("upload.tabBreed") },
        { key: "upload-feedplanning", label: t("upload.tabFeed") },
      ],
      [t]
    );
  
    const tabRefs = useRef([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
    useEffect(() => {
      const currentIndex = tabs.findIndex((tab) => tab.key === selectedTab);
      const currentTab = tabRefs.current[currentIndex];
      if (currentTab) {
        const rect = currentTab.getBoundingClientRect();
        const parentRect = currentTab.parentElement.getBoundingClientRect();
        setIndicatorStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }, [selectedTab, tabs]);
  return (
    <div className="">
      <div className="px-6">
        <div className="relative flex justify-center p-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner max-w-sm sm:max-w-md md:max-w-md mx-auto mb-4 overflow-hidden">
          {/* Animated indicator */}
          <span
            className="absolute top-1 bottom-1 rounded-full bg-[#A1C8FE] dark:bg-[#1DCD9F] transition-all duration-400 ease-in-out"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />

          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => setSelectedTab(tab.key)}
              className={`relative z-10 flex-1 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full transition-colors duration-300 ${
                selectedTab === tab.key
                  ? "text-white hover:bg-blue-500 dark:hover:bg-[#17A783]"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      
      {selectedTab === "upload-breedstandard" && (
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 text-center">
            <BreedStandard />
          </div>
        </div>
      )}
      {selectedTab === "upload-feedplanning" && (
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 text-center">
            <FeedPlanning />
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
