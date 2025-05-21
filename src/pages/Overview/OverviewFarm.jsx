import React, { useState } from "react";
import Feeds from "../../data/Overview_farm";
import ProductionFarm from "../../components/ProductionFarm";
import FarmWeight from "../../components/FarmWeight";
import BellCurveChart from "../../components/BellCurveChartOverview";
import DailyWeightSummary from "../../components/DailyWeightSummary";
import usePersistentTab from "../../context/usePersistentTab";

const OverviewFarm = () => {
  const [selectedTab, setSelectedTab] = usePersistentTab("overviewTab", "production");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-md md:text-xl lg:tex-2xl font-bold text-gray-700 dark:text-white">
         Overview Farm
      </h1>
      <div className="flex items-center justify-center gap-6">
        <h1
          className={`cursor-pointer pb-1 border-b-2 ${
            selectedTab === "production"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("production")}
        >
          Production
        </h1>
        <h1
          className={`cursor-pointer pb-1 border-b-2 ${
            selectedTab === "Farm Weight"
              ? "border-blue-500 text-blue-600 dark:border-[#1DCD9F] dark:text-[#1DCD9F] font-bold"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("Farm Weight")}
        >
          Farm Weight
        </h1>
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
