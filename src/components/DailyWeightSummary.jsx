import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";

const DailyWeightSummary = () => {
  const [data, setData] = useState([]);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchDailyWeightSummary = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/weight/summary-usage");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching DailyWeightSummary data:", error);
      }
    };
    fetchDailyWeightSummary();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-xl ">
        <h2 className="text-left text-sm md:text-md font-semibold text-gray-700 dark:text-white mb-2">
        📈 Daily Weight Summary
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            style={{
                backgroundColor: isDarkMode ? "#364153" : "#f9fafb", // เปลี่ยนสีพื้นหลังตรงนี้
                padding: "1rem"
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ccc"} />
            <XAxis
              dataKey="name"
              stroke={isDarkMode ? "#fff" : "#333"}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke={isDarkMode ? "#fff" : "#333"}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
              itemStyle={{
                color: isDarkMode ? "#ffffff" : "#333333",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: isDarkMode ? "#ffffff" : "#333333",
              }}
            />
            <Bar dataKey="Standard" fill="#4F6BED" />
            <Bar dataKey="Estimate" fill="#90CD8A" />
            <Bar dataKey="Actual" fill="#FBC240" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyWeightSummary;
