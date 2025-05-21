import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";

import Select from "react-select";
import feedSeries from "../data/feedSeries";
import fcrSeries from "../data/fcrSeries";
import bodyweightSeries from "../data/bodyweightSeries";
import selectOptions from "../data/selectOptions";

import { useDarkMode } from "../context/DarkModeContext";
import { FaCloudDownloadAlt } from "react-icons/fa";


const baseSelectWidth = "100%"; 

const lightSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f3f4f6",
    borderColor: state.isFocused ? "#4F81ED" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #4F81ED" : "none",
    "&:hover": {
      borderColor: "#4F81ED",
    },
    fontSize: "12px",
    width: baseSelectWidth,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#E5EFFF"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1f2937",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
};

const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#667085" : "#374151",
    boxShadow: state.isFocused ? "0 0 0 1px #667085" : "none",
    color: "#ffffff",
    "&:hover": {
      borderColor: "#667085",
    },
    fontSize: "12px",
    width: baseSelectWidth,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111827",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#1E3A8A"
      : "#111827",
    color: state.isSelected ? "#ffffff" : "#f9fafb",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#ffffff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#ffffff",
  }),
  input: (base) => ({
    ...base,
    color: "#ffffff",
  }),
};

const ProductionFarm = () => {
  const [selected, setSelected] = useState({ label: "All", value: "All" });
  const { isDarkMode } = useDarkMode();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        // const response = await axios.get("http://localhost:3001/api/daily-feed");
        // setChartData(response.data.data);
        // console.log(response.data.data)
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
    };

    fetchFeedData();
  }, []);

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300">
        Loading chart data...
      </div>
    );
  }

  const allSeriesMap = {
    feed: feedSeries,
    fcr: fcrSeries,
    bodyweight: bodyweightSeries,
  };

  const farmOptions = [{ label: "All", value: "All" }, ...selectOptions];

  const series =
    selected.value === "All"
      ? [...feedSeries]
      : allSeriesMap[selected.value] || [];

  const option = {
    backgroundColor: isDarkMode ? "#364153" : "#ffffff",
  
    title: {
      left: "center",
    },
    tooltip: { trigger: "axis" },
    legend: {
      orient: "vertical",
      right: 5,
      top: "middle",
      itemWidth: 12,
      itemHeight: 10,
      textStyle: {
        fontSize: 10,
        color: isDarkMode ? "#f9fafb" : "#333",
      },
    },
    xAxis: {
      type: "category",
      name: "Day",
      axisLabel: {
        color: isDarkMode ? "#f9fafb" : "#333",
        fontSize: 10,
      },
      nameTextStyle: {
        color: isDarkMode ? "#f9fafb" : "#333",
      },
    },
    yAxis: {
      name: "gram",
      axisLabel: {
        color: isDarkMode ? "#f9fafb" : "#333",
      },
      nameTextStyle: {
        color: isDarkMode ? "#f9fafb" : "#333",
      },
    },
    dataset: { source: chartData },
    series,
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl ">
      <div className="flex flex-wrap items-center justify-between gap-5 mb-2">
        <div className="w-full sm:w-[260px]">
          <label className="text-sm text-gray-700 dark:text-white mb-1 block">
            Select Line:
          </label>
          <Select
            options={farmOptions}
            styles={{
              ...(isDarkMode ? darkSelectStyles : lightSelectStyles),
              container: (base) => ({
                ...base,
                width: "100%",
              }),
            }}
            onChange={(option) => setSelected(option)}
            placeholder="Daily Feed Consumption per Birds"
            isSearchable
          />
        </div>

        <div className="w-full flex flex-wrap items-center gap-2 sm:w-[260px]">
          <label className="text-sm text-gray-700 dark:text-white  block">
            Breed Standard :
          </label>
          <div className="flex items-center gap-5">          
          <Select
            options={farmOptions}
            styles={{
              ...(isDarkMode ? darkSelectStyles : lightSelectStyles),
              container: (base) => ({
                ...base,                
                width: "100%",
              }),
            }}
            onChange={(option) => setSelected(option)}
            placeholder="Crop Female"
            isSearchable
          />
        <button className="bg-[#A1C8FE] dark:bg-[#1DCD9F]  rounded-md p-2 cursor-pointer text-white hover:bg-[#8192ef] dark:hover:bg-green-400"><FaCloudDownloadAlt/></button>
        </div>
        </div>
      </div>

      <div className="w-full">
        <ReactECharts
          option={option}
          style={{ height: 300, width: "100%", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
};

export default ProductionFarm;
