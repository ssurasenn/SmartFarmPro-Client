import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import { useDarkMode } from "../context/DarkModeContext";

const BellCurveChart = () => {
  const [data, setData] = useState([]);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/weight/bell-curve");
        console.log("Bell curve data:", res.data.data); // 🐛 DEBUG LOG
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching bell curve data", err);
      }
    };
    fetchData();
  }, []);

  const option = {
    backgroundColor: isDarkMode ? "#364153" : "#ffffff",
    title: {
      left: "center",
      textStyle: {
        fontSize: 10,
      },
    },

    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const { value } = params[0];
        return `Weight: ${value[0]} grams<br />Percentage: ${(
          value[1] * 100
        ).toFixed(2)}%`;
      },
    },
    xAxis: {
      type: "value",
      name: "grams",
      axisLabel: {
        color: isDarkMode ? "#f9fafb" : "#333",
        fontSize: 10,
      },
      nameTextStyle: {
        color: isDarkMode ? "#f9fafb" : "#333",
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      name: "Percentage of total birds.",
      axisLabel: {
        formatter: (val) => `${val.toFixed(2)}%`,
        color: isDarkMode ? "#f9fafb" : "#333",
        fontSize: 10,
      },
      nameTextStyle: {
        color: isDarkMode ? "#f9fafb" : "#333",
        fontSize: 10,
        fontWeight: 500,
      },
    },
    series: [
      {
        name: "House1",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: isDarkMode ? "#1DCD9F" : "#4F81ED",
        },
        data: data.map((d) => [d.weight, d.percentage]),
      },
    ],
  };

  return (
    <div className="mt-2 bg-white dark:bg-gray-800 p-2 rounded-xl ">
      <h3 className="text-left text-sm md:text-md font-semibold text-gray-700 dark:text-white mb-2">
        📈 Bell Curve Distribution
      </h3>
      <ReactECharts
        option={option}
        style={{ height: "300px", width: "100%" }}
      />
    </div>
  );
};

export default BellCurveChart;
