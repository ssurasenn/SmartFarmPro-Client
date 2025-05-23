import React, { useMemo, useRef, useEffect, useState } from "react";
import CreateFarm from "../../components/Manage/CreateFarm";
import usePersistentTab from "../../context/usePersistentTab";
import Manage_productVersionThree from "./Manage_productVersionThree";
import { useTranslation } from "react-i18next";
import CreateHouse from "../../components/Manage/CreateHouse";

const ManageFarm = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = usePersistentTab(
    "manageFarmTab",
    "manage-farm"
  );

  const tabs = useMemo(
    () => [
      { key: "manage-farm", label: t("management.manageFarm") },
      { key: "manage-house", label: t("management.manageHouse") },
      { key: "manage-production", label: t("management.manageProduction") },
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
        <div className="relative flex justify-center p-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner max-w-sm sm:max-w-md md:max-w-lg mx-auto mb-4 overflow-hidden">
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

      {selectedTab === "manage-farm" && <CreateFarm />}
      {selectedTab === "manage-house" && <CreateHouse />}
      {selectedTab === "manage-production" && (
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 text-center">
            <Manage_productVersionThree />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFarm;

// <div className="md:p-4 space-y-2">

//   {/* <div className="hidden items-center justify-center gap-3 md:gap-6">
//     <h1
//       className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
//         selectedTab === "manage-farm"
//           ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
//           : "border-transparent text-gray-500"
//       }`}
//       onClick={() => setSelectedTab("manage-farm")}
//     >
//       {t("management.manageFarm")}
//     </h1>
//     <h1
//       className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
//         selectedTab === "manage-house"
//           ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
//           : "border-transparent text-gray-500"
//       }`}
//       onClick={() => setSelectedTab("manage-house")}
//     >
//       {t("management.manageHouse")}
//     </h1>
//     <h1
//       className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
//         selectedTab === "setting-production"
//           ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
//           : "border-transparent text-gray-500"
//       }`}
//       onClick={() => setSelectedTab("setting-production")}
//     >
//       {t("management.manageProduction")}
//     </h1>
//   </div> */}
//   <div className="flex items-center justify-center gap-3 md:gap-6">
//     <h1
//       className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
//         selectedTab === "manage-farm"
//           ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
//           : "border-transparent text-gray-600 dark:text-gray-200"
//       }`}
//       onClick={() => setSelectedTab("manage-farm")}
//     >
//       {t("management.manageFarm")}
//     </h1>
//     <h1
//       className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
//         selectedTab === "manage-house"
//           ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
//           : "border-transparent text-gray-600 dark:text-gray-200"
//       }`}
//       onClick={() => setSelectedTab("manage-house")}
//     >
//       {t("management.manageHouse")}
//     </h1>
//     <h1
//       className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
//         selectedTab === "manage-production"
//           ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
//           : "border-transparent text-gray-600 dark:text-gray-200"
//       }`}
//       onClick={() => setSelectedTab("manage-production")}
//     >
//       {t("management.manageProduction")}
//     </h1>
//   </div>

//   {selectedTab === "manage-farm" && (
//     <>
//       <CreateFarm />

//     </>
//   )}
//    {selectedTab === "manage-house" && (
//     <>
//       <CreateHouse />

//     </>
//   )}

//   {selectedTab === "manage-production" && (
//     <div className="grid grid-cols-1 gap-5 w-full">
//       <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 text-center">

//         <Manage_productVersionThree />

//       </div>
//       {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
//           <BellCurveChart />
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
//           <DailyWeightSummary />
//         </div>
//       </div> */}
//     </div>
//   )}
// </div>
