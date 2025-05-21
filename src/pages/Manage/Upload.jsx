import React from "react";
import usePersistentTab from "../../context/usePersistentTab";
import BreedStandard from "./BreedStandard";
import FeedPlanning from "./FeedPlanning";
import { useTranslation } from "react-i18next";

const Upload = () => {
  const { t } =useTranslation();
  
  const [selectedTab, setSelectedTab] = usePersistentTab(
    "uploadTab",
    "Breed Standard"
  );
  return (
    <div className="p-4 space-y-3">
      {/* <h1 className="text-md md:text-xl lg:tex-2xl font-bold text-gray-700 dark:text-white">
        {t("upload.title")}
      </h1> */}
      <div className="flex items-center justify-center gap-6">
        <h1
          className={`cursor-pointer pb-1 border-b-2 ${
            selectedTab === "upload-breedstandard"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("upload-breedstandard")}
        >
          {t("upload.tabBreed")}
        </h1>
        <h1
          className={`cursor-pointer pb-1 border-b-2 ${
            selectedTab === "upload-feedplanning"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("upload-feedplanning")}
        >
          {t("upload.tabFeed")}
        </h1>
      </div>

      {selectedTab === "upload-breedstandard" && (
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <BreedStandard />
          </div>
        </div>
      )}

      {selectedTab === "upload-feedplanning" && (
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <FeedPlanning />
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
