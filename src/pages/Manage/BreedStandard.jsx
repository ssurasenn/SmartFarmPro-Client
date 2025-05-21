import React, { useEffect } from "react";
import useFarmStore from "../../store/smartfarm-store";
import usePersistentTab from "../../context/usePersistentTab";
import { useTranslation } from "react-i18next";
import { HiFolderDownload } from "react-icons/hi";
import { RiFolderUploadFill } from "react-icons/ri";

const BreedStandard = () => {
  const farmCode = localStorage.getItem("selectedFarmCode");
  const { t } = useTranslation();

  const { selectBreedStandard, getBreedStandardDetail, breedStandardDetails } =
    useFarmStore();

  const [selectedBreed, setSelectedBreed] = usePersistentTab(
    "selectBreedOption",
    ""
  );

  useEffect(() => {
    const fetchBreedStandardDetail = async () => {
      if (selectedBreed && farmCode) {
        console.log(
          "🚀 Fetching BreedStandardDetails:",
          selectedBreed,
          farmCode
        );
        await getBreedStandardDetail(farmCode, selectedBreed);
      }
    };
    fetchBreedStandardDetail();
  }, [selectedBreed, farmCode]);

  return (
    <div className="w-full text-left bg-white dark:bg-gray-800 px-2 lg:px-10 lg:py-4 rounded-2xl shadow ">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 w-full md:w-auto">
          {t("breed.title")}
        </h1>
        <div className="flex flex-wrap items-center gap-4  w-full md:w-auto">
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="border border-gray-400 focus:ring-offset-blue-300 px-3 py-2 text-xs md:text-sm rounded-lg w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">{t("breed.selectBreed")}</option>
            {selectBreedStandard.map((item, index) => (
              <option key={index} value={item.BreedStandard}>
                {item.BreedStandard}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="inline-flex text-xs md:text-sm items-center justify-center px-3 py-2 bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white hover:bg-[#82A9F4] dark:hover:bg-[#17B78C] rounded-lg cursor-pointer transition w-auto gap-2">
              <RiFolderUploadFill size={20}/>
              {t("menu.upload")}
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={() => {}}
                className="hidden"
              />
            </label>
            <button className="inline-flex text-xs md:text-sm items-center justify-center px-3 py-2 bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white hover:bg-[#82A9F4] dark:hover:bg-[#17B78C] rounded-lg cursor-pointer transition w-auto gap-2">
              <HiFolderDownload size={22} className=" "/>
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
              <th className="px-4 py-4 text-center">{t("breed.table.day")}</th>
              <th className="px-4 py-4 text-center">
                {t("breed.table.percentLive")}
              </th>
              <th className="px-4 py-4 text-center">
                {t("breed.table.dailyIntake")}
              </th>
              <th className="px-4 py-4 text-center">
                {t("breed.table.cumIntake")}
              </th>
              <th className="px-4 py-4 text-center">
                {t("breed.table.bodyWeight")}
              </th>
              <th className="px-4 py-4 text-center">
                {t("breed.table.dailyGain")}
              </th>
              <th className="px-4 py-4 text-center">{t("breed.table.fcr")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200  dark:divide-gray-600">
            {breedStandardDetails.length > 0 ? (
              breedStandardDetails.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 "
                >
                  <td className="px-4 py-4 text-center font-medium text-gray-900 dark:text-gray-100 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.Day}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.PercentLive}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.DailyIntake}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.CumIntake}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.BodyWeight}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.DailyGain}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-800 dark:text-gray-200 text-xs hover:text-blue-600 dark:hover:text-[#1DCD9F]">
                    {item.FCR}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  {t("breed.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BreedStandard;
