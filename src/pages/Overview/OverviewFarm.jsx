import React, { useEffect, useMemo, useRef, useState } from "react";

import Feeds from "../../data/Overview_farm";
import ProductionFarm from "../../components/ProductionFarm";
import FarmWeight from "../../components/FarmWeight";
import BellCurveChart from "../../components/BellCurveChartOverview";
import DailyWeightSummary from "../../components/DailyWeightSummary";
import usePersistentTab from "../../context/usePersistentTab";
import { useTranslation } from "react-i18next";

const OverviewFarm = () => {
  const [selectedTab, setSelectedTab] = usePersistentTab("production", "production");
  const { t } =useTranslation();
  const tabs = useMemo(
        () => [
          { key: "production", label: t("overview.production") },
          { key: "Farm Weight", label: t("overview.farmWeight") },
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
    <div className="space-y-4">
      <h1 className="text-md font-bold text-gray-700 dark:text-white">
         {t("overview.overviewFarm")}
      </h1>
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

      {selectedTab === "production" && (
        <>
          {/* Feed Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Feeds.map((feed, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition hover:shadow-xl"
              >
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
                  📦 Feed Number:{" "}
                  <span className="text-blue-500 dark:text-[#1DCD9F]">
                    {feed.feedName}
                  </span>
                </h2>
                <div className="flex items-start justify-between">
                  <div className="text-sm md:text-md font-semibold text-blue-600 dark:text-[#1DCD9F]">
                    Remaining: {feed.remain}
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs md:text-md text-gray-500 dark:text-gray-300">
                      Usage: <span className="font-medium">{feed.usage}</span>
                    </p>
                    <p className="text-xs md:text-md text-gray-500 dark:text-gray-300">
                      Refill (Today):{" "}
                      <span className="font-medium">{feed.refillToday}</span>
                    </p>
                    <p className="text-xs md:text-md text-gray-500 dark:text-gray-300">
                      Refill (Yesterday):{" "}
                      <span className="font-medium">
                        {feed.refillYesterday}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700">
              📊 Daily Feed Usage
            </h2>
            <ProductionFarm />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700">
              📊 Summary Usage2
            </h2>
            <ProductionFarm />
          </div>
        </>
      )}

      {selectedTab === "Farm Weight" && (
        <div className="grid grid-cols-1 gap-5 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <FarmWeight />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
              <BellCurveChart />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
              <DailyWeightSummary />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewFarm;
