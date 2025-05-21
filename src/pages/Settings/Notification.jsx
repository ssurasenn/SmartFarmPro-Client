import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import usePersistentTab from "../../context/usePersistentTab";

const Notification = () => {
  // const [activeTab, setActiveTab] = useState("summary");
  const [activeTab, setActiveTab] = usePersistentTab(
    "notificationTab",
    "summary"
  );

  const tabs = [
    { id: "summary", label: "Summary Report" },
    { id: "alarm", label: "Alarm & Warning" },
    { id: "language", label: "Message Language" },
  ];

  //Notification Input-Message

  const inputs = [
    { label: "Whatsapp ID", icon: <IoSearchSharp size={16} /> },
    { label: "Telegram ID", icon: <IoSearchSharp size={16} /> },
    { label: "Viber Contact", icon: <IoIosSend size={16} />, badge: "Beta" },
    { label: "Line Contact", icon: <IoIosSend size={16} />, badge: "Beta" },
  ];

  //Toastify
  const handleSave = () => {
    toast.success(" Saved successfully!", {
      position: "top-right",
      autoClose: 3000, // 3 วินาที
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-md md:text-xl lg:tex-2xl lg:pl-20 font-bold text-gray-700 dark:text-white mb-6">
        Setting Farm
      </h1>
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 transition hover:shadow-xl w-full max-w-[775px]">
          <div className="flex justify-center mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm md:text-md font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:cursor-pointer"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "summary" && (
            <div className="space-y-1">
              <h3 className="font-semibold text-sm md:text-md dark:text-gray-300">
                Farm Report
              </h3>
              <table className="min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                <thead className="bg-gray-400 dark:bg-[#374151] text-white ">
                  <tr>
                    <th className="text-center text-xs px-4 py-2 border-b border-white">
                      Report Type
                    </th>
                    <th className="text-center text-xs px-4 py-3 border-b border-white">
                      Time
                    </th>
                    <th className="text-center text-xs px-4 py-3 border-b border-white">
                      Enable
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ["Farm weight report", "06:00"],
                    ["House weight report", "06:00"],
                    ["Pen weight report", "08:00"],
                    ["Farm weight report (female,male)", "08:00"],
                    ["Farm weight report (female,male)", "08:00"],
                    ["Pen weight report (female,male)", "08:00"],
                    ["Farm silo report", "06:00"],
                    ["Today's farm weight report", "06:00"],
                    ["Today's house weight report", "06:00"],
                    ["Today's pen weight report", "06:00"],
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

          {activeTab === "alarm" && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm md:text-md dark:text-gray-300">
                Alarm & Warning
              </h3>
              <table className="min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                <thead className="bg-gray-400 dark:bg-[#374151] text-white">
                  <tr>
                    <th className="text-left text-xs px-4 py-2 border-b border-white">
                      Warning Message
                    </th>
                    <th className="text-center text-xs px-4 py-3 border-b border-white">
                      Enable
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ["Warning when start crop."],
                    ["Warning when calibrate device"],
                    ["Warning when underweight"],
                    [
                      "Warning when it's time to adjust the height of the scale",
                    ],
                    ["Warning when the slio is refilled"],
                    ["Warning when the slio is usage"],
                    ["Warning when the slio low level"],
                    ["Warning when the slio low level (repeat)"],
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

              <table className=" min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                <thead className="bg-gray-400 dark:bg-[#374151] text-white">
                  <tr>
                    <th className="text-left text-xs px-4 py-2 border-b border-white">
                      Type
                    </th>
                    <th className="text-center text-xs px-4 py-3 border-b border-white">
                      Delay Time (min)
                    </th>
                    <th className="text-center text-xs px-4 py-3 border-b border-white">
                      Enable
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
          )}

          {activeTab === "language" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm md:text-md dark:text-gray-300">
                Message Language
              </h3>
              <table className=" min-w-full text-sm md:text-md border-collapse rounded-xl overflow-hidden mt-3">
                <thead className="bg-gray-400 dark:bg-[#374151] text-white">
                  <tr>
                    <th className="text-left text-xs px-4 py-2 border-b border-white">
                      Language{" "}
                    </th>
                    <th className="text-center text-xs px-4 py-3 border-b border-white">
                      Enable
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
                  Notification
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

          <div className="text-center mt-6">
            <button
              type="submit"
              onClick={handleSave}
              className=" bg-blue-600 dark:bg-[#1DCD9F] text-white px-6 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-[#1dcd9ece]"
            >
              <span className="flex items-center text-sm">
                <FaSave className="mr-2" />
                Save Changes
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
