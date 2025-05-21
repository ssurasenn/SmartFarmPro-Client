import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const HouseDetailPage = () => {
  const { houseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const production = state?.production;

  if (!production) {
    return (
      <div className="p-6 text-red-500">
        ⚠️ No production data found. Please go back and select a house again.
      </div>
    );
  }

  const rows = [production]; // ถ้ามีหลาย production ในอนาคตก็แค่เพิ่มลง array นี้

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        🔙 Back
      </button>
      <div className="flex items-center justify-between">
        <h2 className="text-md font-sesmibold text-gray-700 mb-6">
          Detail for: {production.HouseName}
        </h2>
        <button 
        onClick={''}
        className="bg-amber-200 px-2 py-1 rounded-2xl">start crop</button>
      </div>
      
      {/* form input is here */}
      

      <div className="overflow-x-auto shadow rounded-xl">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">House</th>
              <th className="px-4 py-2 border-b">Crop</th>
              <th className="px-4 py-2 border-b">Flock</th>
              <th className="px-4 py-2 border-b">Feed Plan</th>
              <th className="px-4 py-2 border-b">Breed Std</th>
              <th className="px-4 py-2 border-b">Number(unit)</th>
              <th className="px-4 py-2 border-b">Start Date</th>
              <th className="px-4 py-2 border-b">Weight</th>
              <th className="px-4 py-2 border-b">Catching Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.HouseCode} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{row.HouseName}</td>
                <td className="px-4 py-2 border-b">{row.crop}</td>
                <td className="px-4 py-2 border-b">{row.flock}</td>
                <td className="px-4 py-2 border-b">{row.feedPlanning}</td>
                <td className="px-4 py-2 border-b">{row.breedStandard}</td>
                <td className="px-4 py-2 border-b">{row.number}</td>
                <td className="px-4 py-2 border-b">{row.startDate}</td>
                <td className="px-4 py-2 border-b">{row.slaughterhouseWeight}</td>
                <td className="px-4 py-2 border-b">{row.catchingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HouseDetailPage;
