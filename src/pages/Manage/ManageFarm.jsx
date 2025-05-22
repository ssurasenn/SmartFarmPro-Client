import React from "react";
import CreateFarm from "../../components/Manage/CreateFarm";
import usePersistentTab from "../../context/usePersistentTab";
import Manage_productVersionThree from "./Manage_productVersionThree";
import { useTranslation } from "react-i18next";
import CreateHouse from "../../components/Manage/CreateHouse";

const ManageFarm = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = usePersistentTab("manageFarmTab", "manage-farm");

  return (
    <div className="md:p-4 space-y-2">
      
      {/* <div className="hidden items-center justify-center gap-3 md:gap-6">
        <h1
          className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
            selectedTab === "manage-farm"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("manage-farm")}
        >
          {t("management.manageFarm")}
        </h1>
        <h1
          className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
            selectedTab === "manage-house"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("manage-house")}
        >
          {t("management.manageHouse")}
        </h1>
        <h1
          className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
            selectedTab === "setting-production"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("setting-production")}
        >
          {t("management.tabSettingProduction")}
        </h1>
      </div> */}
      <div className="flex items-center justify-center gap-3 md:gap-6">
        <h1
          className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
            selectedTab === "manage-farm"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-600 dark:text-gray-200"
          }`}
          onClick={() => setSelectedTab("manage-farm")}
        >
          {t("management.manageFarm")}
        </h1>
        <h1
          className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
            selectedTab === "manage-house"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-600 dark:text-gray-200"
          }`}
          onClick={() => setSelectedTab("manage-house")}
        >
          {t("management.manageHouse")}
        </h1>
        <h1
          className={`cursor-pointer pb-1 border-b-2 text-xs md:text-md lg:text-base ${
            selectedTab === "setting-production"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-600 dark:text-gray-200"
          }`}
          onClick={() => setSelectedTab("setting-production")}
        >
          {t("management.tabSettingProduction")}
        </h1>
      </div>

      {selectedTab === "manage-farm" && (
        <>
          <CreateFarm />

        </>
      )}
       {selectedTab === "manage-house" && (
        <>
          <CreateHouse />

        </>
      )}

      {selectedTab === "setting-production" && (
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            
            <Manage_productVersionThree />
            
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
              <BellCurveChart />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
              <DailyWeightSummary />
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ManageFarm;
