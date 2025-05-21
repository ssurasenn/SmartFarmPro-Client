import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

const FarmWeight = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/weight/dataweight-table");
        setTableData(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
    };

    fetchWeightData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-left text-xs md:text-sm font-semibold mb-4 dark:text-white">
        📃 Weight Data Table
        </h2>
        <div className="flex justify-end mb-2">
          <button className="bg-blue-600 dark:bg-teal-500 dark:hover:bg-teal-600 hover:bg-blue-700 text-white px-2 py-1 md:px-3 md:py-2 lg:px-3 lg:py-2 rounded">
            <FaDownload />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-[900px] w-full table-auto text-xs md:text-sm">
          <thead>
            <tr className="bg-blue-600 dark:bg-gray-700 text-white text-left ">
              <th className="px-4 py-2 whitespace-nowrap">House</th>
              <th className="px-4 py-2 whitespace-nowrap">Age</th>
              <th className="px-4 py-2 whitespace-nowrap">Standard</th>
              <th className="px-4 py-2 whitespace-nowrap">Estimate</th>
              <th className="px-4 py-2 whitespace-nowrap">Actual</th>
              <th className="px-4 py-2 whitespace-nowrap">Sampling</th>
              <th className="px-4 py-2 whitespace-nowrap">ACH</th>
              <th className="px-4 py-2 whitespace-nowrap">SD</th>
              <th className="px-4 py-2 whitespace-nowrap">CV</th>
              <th className="px-4 py-2 whitespace-nowrap">Uniformity</th>
              <th className="px-4 py-2 whitespace-nowrap">ADG</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className="border-t dark:border-white dark:text-white dark:bg-gray-700 text-xs md:text-sm">
                <td className="px-4 py-2">{item.house}</td>
                <td className="px-4 py-2">{item.age}</td>
                <td className="px-4 py-2">{item.standard}</td>
                <td className="px-4 py-2">{item.estimate}</td>
                <td className="px-4 py-2">{item.actual}</td>
                <td className="px-4 py-2">{item.sampling}</td>
                <td className="px-4 py-2">{item.ach}</td>
                <td className="px-4 py-2">{item.sd}</td>
                <td className="px-4 py-2">{item.cv}</td>
                <td className="px-4 py-2">{item.uniformity}</td>
                <td className="px-4 py-2">{item.adg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default FarmWeight;
