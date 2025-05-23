import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import usePersistentTab from "../../context/usePersistentTab";
import { useTranslation } from "react-i18next";

const Notification = () => {
  // const [activeTab, setActiveTab] = useState("summary");
  const [selectedTab, setSelectedTab] = usePersistentTab(
    "notificationTab",
    "summary"
  );
  const { t } = useTranslation();
  const tabs = useMemo(
    () => [
      { key: "summary", label: t("setting.summaryReport") },
      { key: "alarm", label: t("setting.alarmWarning") },
      { key: "language", label: t("setting.messageLanguage") },
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
  //Notification Input-Message

  const inputs = [
    { label: "Whatsapp ID", icon: <IoSearchSharp size={16} /> },
    { label: "Telegram ID", icon: <IoSearchSharp size={16} /> },
    { label: "Viber Contact", icon: <IoIosSend size={16} />, badge: "Beta" },
    { label: "Line Contact", icon: <IoIosSend size={16} />, badge: "Beta" },
  ];

  //Toastify
  const handleSave = () => {
    toast.success(t("settingProduction.toast.saved"), {
      position: "top-right",
      autoClose: 3000, // 3 วินาที
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-10 transition hover:shadow-xl w-full max-w-[775px]">
          {/* tab */}
          <div className="">
            <div className="relative flex justify-center p-1 bg-gray-100 dark:bg-gray-600 rounded-full shadow-inner max-w-md md:max-w-lg mx-auto mb-4 overflow-hidden">
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
          {/* เนื้อหาแต่ละแท็บ */}
          <div className="overflow-x-auto">
            {selectedTab === "summary" && (
              <div className="space-y-1">
                <h3 className="font-semibold text-sm md:text-md dark:text-gray-300">
                  {t("setting.farmReort")}
                </h3>
                <table className="min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                  <thead className="bg-gray-400 dark:bg-[#374151] text-white ">
                    <tr>
                      <th className="text-center text-xs px-4 py-2 border-b border-white">
                        {t("setting.reportType")}
                      </th>
                      <th className="text-center text-xs px-4 py-3 border-b border-white">
                        {t("setting.time")}
                      </th>
                      <th className="text-center text-xs px-4 py-3 border-b border-white">
                        {t("setting.enable")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      [t("setting.farm_weight_report"), "06:00"],
                      [t("setting.house_weight_report"), "06:00"],
                      [t("setting.pen_weight_report"), "08:00"],
                      [t("setting.farm_weight_report_female_male"), "08:00"],
                      [t("setting.house_weight_report_female_male"), "08:00"],
                      [t("setting.pen_weight_report_female_male"), "08:00"],
                      [t("setting.farm_silo_report"), "06:00"],
                      [t("setting.Today's_farm_weight_report"), "06:00"],
                      [t("setting.Today's_house_weight_report"), "06:00"],
                      [t("setting.Today's_pen_weight_report"), "06:00"],
                    ].map(([type, time], index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 dark:hover:bg-gray-600 transition duration-200"
                      >
                        <td className="px-4 py-2 text-gray-700 text-xs dark:text-gray-200">
                          {type}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="time"
                            defaultValue={time}
                            className="border-none bg-blue-100 dark:bg-[#374151] text-gray-700 dark:text-white rounded-lg px-2 py-1 text-sm w-[100px]"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <label className="relative inline-block w-10 h-6">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="sr-only peer"
                            />
                            <div className="w-10 h-6 bg-gray-400 peer-checked:bg-[#1DCD9F] rounded-full peer-focus:ring-2 peer-focus:ring-white transition-colors duration-300"></div>
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-4"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === "alarm" && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm md:text-md dark:text-gray-300">
                  {t("setting.alarmWarning")}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                    <thead className="bg-gray-400 dark:bg-[#374151] text-white">
                      <tr>
                        <th className="text-left text-xs px-4 py-2 border-b border-white">
                          {t("setting.warning_message")}
                        </th>
                        <th className="text-center text-xs px-4 py-3 border-b border-white">
                          {t("setting.enable")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        [t("setting.warning_when_start_crop")],
                        [t("setting.warning_when_calibrate_device")],
                        [t("setting.warning_when_underweight")],
                        [
                          t(
                            "setting.warning_when_it's_time_to_adjust_the_height_of_the_scale"
                          ),
                        ],
                        [t("setting.warning_when_the_slio_is_refilled")],
                        [t("setting.warning_when_the_slio_is_usage")],
                        [t("setting.warning_when_the_slio_low_level")],
                        [t("setting.warning_when_the_slio_low_level_repeat")],
                      ].map(([type], index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-50 text-xs dark:hover:bg-gray-800 transition duration-200"
                        >
                          <td className="text-left px-4 py-2 text-gray-700 dark:text-gray-200">
                            {type}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <label className="relative inline-block w-10 h-6">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="sr-only peer"
                              />
                              <div className="w-10 h-6 bg-gray-400 peer-checked:bg-[#1DCD9F] rounded-full peer-focus:ring-2 peer-focus:ring-white transition-colors duration-300"></div>
                              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-4"></div>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto">
                  <table className=" min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                    <thead className="bg-gray-400 dark:bg-[#374151] text-white">
                      <tr>
                        <th className="text-left text-xs px-4 py-2 border-b border-white">
                          {t("setting.type")}
                        </th>
                        <th className="text-center text-xs px-4 py-3 border-b border-white">
                          {t("setting.delay_time_min")}
                        </th>
                        <th className="text-center text-xs px-4 py-3 border-b border-white">
                          {t("setting.enable")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        ["CKALE (Online/Offline)", "20"],
                        ["SiLOG (Online/Offline)", "20"],
                      ].map(([type, delay], index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-50 text-xs dark:hover:bg-gray-800 transition duration-200"
                        >
                          <td className="text-left px-4 py-2 text-gray-700 text-xs dark:text-gray-200">
                            {type}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="number"
                              defaultValue={delay}
                              className="border-none bg-blue-100 dark:bg-[#374151] text-gray-700 dark:text-white rounded-lg px-2 py-1 text-center text-sm w-[70px]"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <label className="relative inline-block w-10 h-6">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="sr-only peer"
                              />
                              <div className="w-10 h-6 bg-gray-400 peer-checked:bg-[#1DCD9F] rounded-full peer-focus:ring-2 peer-focus:ring-white transition-colors duration-300"></div>
                              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-4"></div>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === "language" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm md:text-md dark:text-gray-300">
                  {t("setting.messageLanguage")}
                </h3>
                <table className=" min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                  <thead className="bg-gray-400 dark:bg-[#374151] text-white">
                    <tr>
                      <th className="text-left text-xs px-4 py-2 border-b border-white">
                        {t("setting.language")}{" "}
                      </th>
                      <th className="text-center text-xs px-4 py-3 border-b border-white">
                        {t("setting.enable")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      ["English"],
                      ["ภาษาไทย"],
                      ["Español"],
                      ["Chinese"],
                      ["Russian"],
                      ["Vietnamese"],
                    ].map(([type], index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 dark:hover:bg-gray-800 text-xs transition duration-200"
                      >
                        <td className="text-left px-4 py-2 text-gray-700 text-xs dark:text-gray-200">
                          {type}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <label className="relative inline-block w-10 h-6">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="sr-only peer"
                            />
                            <div className="w-10 h-6 bg-gray-400 peer-checked:bg-[#1DCD9F] rounded-full peer-focus:ring-2 peer-focus:ring-white transition-colors duration-300"></div>
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-4"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm md:text-md dark:text-gray-200 border-b border-gray-300 pb-1">
                    {t("setting.notification")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inputs.map(({ label, icon, badge }, idx) => (
                      <div key={idx} className="flex flex-col space-y-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                          {label}
                          {badge && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                              {badge}
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full border rounded-md py-2 pl-3 pr-10 text-xs dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300"
                            placeholder={`Enter ${label}`}
                          />
                          <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 dark:bg-[#1DCD9F] dark:hover:bg-green-400 text-white p-1 rounded-md">
                            {icon}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* You can add more inputs as needed */}
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              onClick={handleSave}
              className=" bg-blue-600 dark:bg-[#1DCD9F] text-white px-6 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-[#1dcd9ece]"
            >
              <span className="flex items-center text-sm">
                <FaSave className="mr-2" />
                {t("profile.saveChanges")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
