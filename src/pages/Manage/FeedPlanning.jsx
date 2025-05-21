import React, { useEffect, useState } from "react";
import useFarmStore from "../../store/smartfarm-store";
import usePersistentTab from "../../context/usePersistentTab";
import { useTranslation } from "react-i18next";
import { RiFolderUploadFill } from "react-icons/ri";
import { HiFolderDownload } from "react-icons/hi";

const FeedPlanning = () => {
  const farmCode = localStorage.getItem("selectedFarmCode");
  const { t } = useTranslation();

  const { selectPlanningList, getFeedPlanningDetail, feedPlanningDetails } =
    useFarmStore();

  const [selectedFeedPlan, setSelectedFeedPlan] = usePersistentTab(
    "selectFeedplanOption",
    ""
  );

  useEffect(() => {
    const fetchBreedStandardDetail = async () => {
      if (selectedFeedPlan && farmCode) {
        console.log(
          "🚀 Fetching Feed Planning Details:",
          selectedFeedPlan,
          farmCode
        );
        await getFeedPlanningDetail(farmCode, selectedFeedPlan);
      }
    };
    fetchBreedStandardDetail();
  }, [selectedFeedPlan, farmCode]);

  return (
    <div className="w-full text-left bg-white dark:bg-gray-800 px-4 lg:px-10 lg:py-4 rounded-2xl shadow-md ">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 w-full md:w-auto">
          {t("feedPlan.title")}
        </h1>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <select
            value={selectedFeedPlan}
            onChange={(e) => setSelectedFeedPlan(e.target.value)}
            className="border border-gray-400 focus:ring-offset-blue-300 px-3 py-2 text-xs md:text-sm rounded-lg w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">{t("feedPlan.selectBreed")}</option>
            {selectPlanningList.map((item, index) => (
              <option key={index} value={item.FeedPlanning}>
                {item.FeedPlanning}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="flex text-xs md:text-sm items-center justify-center px-3 py-2 bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white hover:bg-[#82A9F4] dark:hover:bg-[#17B78C] rounded-lg cursor-pointer transition w-auto gap-2">
              <RiFolderUploadFill size={20} />
              {t("menu.upload")}
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={() => {}}
                className="hidden"
              />
            </label>
            <button className="flex text-xs md:text-sm items-center justify-center px-3 py-2 bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white hover:bg-[#82A9F4] dark:hover:bg-[#17B78C] rounded-lg cursor-pointer transition w-auto gap-2">
              <HiFolderDownload size={22} />
              {t("menu.download")}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[480px] lg:max-h-[650px] overflow-y-scroll rounded-t-md w-full">
        <table className="min-w-full text-sm text-left">
          <thead className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 uppercase text-xs whitespace-nowrap">
            <tr>
              <th className="px-6 py-4">{t("feedPlan.table.day")}</th>
              <th className="px-6 py-4">{t("feedPlan.table.formular1")}</th>
              <th className="px-6 py-4">{t("feedPlan.table.formular2")}</th>
              <th className="px-6 py-4">{t("feedPlan.table.density")}</th>
              <th className="px-6 py-4">{t("feedPlan.table.percentbag")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {feedPlanningDetails.length > 0 ? (
              feedPlanningDetails.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.Day}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.FormulaSilo1}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.FormulaSilo2}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.Dansity}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.PercentBags}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  {t("feedPlan.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedPlanning;
