import React, { useEffect, useState } from "react";
import useFarmStore from "../../store/smartfarm-store";
import { CircleCheckBig } from 'lucide-react';
import { toast } from "react-toastify";

const Manage_production = () => {
  const SettingProduction = useFarmStore((state) => state.SettingProduction);
  const selectedFarmCode = useFarmStore((state) => state.selectedFarmCode);
  const selectedCropCode = useFarmStore((state) => state.selectedCropCode);

  const [farmProductions, setFarmProductions] = useState([]);
  const [activeCurrentProduction, setActiveCurrentProduction] = useState(false);
  const [activeHistoryProduction, setActiveHistoryProduction] = useState(null);
  const [editableData, setEditableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const activeProduction = farmProductions.find((p) => p.StatusCrop === 1);
  const productionHistory = farmProductions
    .filter((p) => p.StatusCrop !== 1)
    .sort((a, b) => new Date(b.StartCrop) - new Date(a.StartCrop));

  const handleEditChange = (index, field, value) => {
    const updated = [...editableData];
    updated[index] = { ...updated[index], [field]: value };
    setEditableData(updated);
  };

  const handleSave = () => {
    console.log("Saving to localStorage...", editableData);
    localStorage.setItem("editableProductionData", JSON.stringify(editableData));
    toast.success("Successfully saved to LocalStorage!", {
      position: "top-right",
      autoClose: 3000,
    });
  };
  useEffect(() => {
    if (!selectedCropCode || farmProductions.length === 0) return;
  
    const selectedProduction = farmProductions.find(p => p.CropCode === selectedCropCode);
    
    if (selectedProduction) {
      if (selectedProduction.StatusCrop === 1) {
        setActiveCurrentProduction(true);
        setActiveHistoryProduction(null);
      } else {
        setActiveCurrentProduction(false);
        setActiveHistoryProduction(selectedProduction.MainCrop);
      }
    }
  }, [selectedCropCode, farmProductions]);
  
  useEffect(() => {
    const savedData = localStorage.getItem("editableProductionData");
    if (savedData) {
      setEditableData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedFarmCode) {
        console.warn("🚨 No selectedFarmCode found.");
        return;
      }

      const result = await SettingProduction(selectedFarmCode);

      if (result.success) {
        setFarmProductions(result.data);

        const current = result.data.find((p) => p.StatusCrop === 1);
        if (current) {
          setActiveCurrentProduction(true);
          setActiveHistoryProduction(null);
          setEditableData(current.CropDetail);
        }
      } else {
        console.error("Failed to fetch:", result.message);
      }
    };

    fetchData();
  }, [SettingProduction, selectedFarmCode]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-md md:text-xl font-bold text-[#333] dark:text-white">
          Manage Production
        </h1>

        <div className="flex gap-2">
          <button className="bg-amber-200 px-3 py-1 rounded-md shadow cursor-pointer">Start</button>
          <button className="bg-red-200 px-3 py-1 rounded-md shadow cursor-pointer">Stop</button>
        </div>
      </div>

      {activeProduction && (
        <div className="mb-4">
          <button
            onClick={() => {
              setActiveCurrentProduction(!activeCurrentProduction);
              setActiveHistoryProduction(null);
            }}
            className={`flex justify-start gap-3 overflow-x-auto mb-6 pb-2 scroll-smooth px-4 py-2 rounded-full font-medium shadow-sm dark:shadow-xl transition-all cursor-pointer
              ${
                activeCurrentProduction
                  ? "bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              }`}
          >
            {activeCurrentProduction ? "🔽 Current Production" : "🚩 Current Production"}
          </button>

          {activeCurrentProduction && (
            <CropTable
              title={`Main Crop  : ${activeProduction.MainCrop}`}
              crop={activeProduction}
              isEditable={true}
              editableData={editableData}
              isEditing={isEditing}
              onEditChange={handleEditChange}
              onSave={() => {
                handleSave();
                setIsEditing(false);
              }}
              onToggleEdit={() => setIsEditing((prev) => !prev)}
            />
          )}
        </div>
      )}

      <div className="flex justify-start gap-3 overflow-x-auto mb-6 pb-2 scroll-smooth">
        {productionHistory.map((p) => (
          <button
            key={p.CropCode}
            onClick={() => {
              setActiveHistoryProduction(p.MainCrop);
              setActiveCurrentProduction(false);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-600 dark:shadow-xl shadow-sm whitespace-nowrap cursor-pointer
              ${
                activeHistoryProduction === p.MainCrop
                  ? "bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              }`}
          >
            Main Crop: {p.MainCrop}
          </button>
        ))}
      </div>

      {productionHistory.map(
        (p) =>
          activeHistoryProduction === p.MainCrop && (
            <CropTable
              key={p.CropCode}
              title={`Main Crop :  ${p.MainCrop}`}
              crop={p}
            />
          )
      )}
    </div>
  );
};

const CropTable = ({
  crop,
  title,
  editableData = [],
  isEditing = false,
  onEditChange,
  onSave,
  onToggleEdit,
}) => {
  const isEditable = crop.StatusCrop === 1;

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md text-left font-semibold dark:text-white">
          {title}
        </h2>

        <div>
          <button className="mr-4">
            {crop.StatusCrop === 1 ? (
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-400">
                🟢 In Process
              </span>
            ) : (
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-400">
                Completed
              </span>
            )}
          </button>

          {isEditable && (
            <button
              onClick={onToggleEdit}
              className={`px-3 py-1 rounded-md shadow text-sm cursor-pointer ${
                isEditing ? "bg-gray-400 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {isEditing ? "❌ Cancel" : "✏️ Edit"}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto rounded-xl">
        <table className="min-w-full text-sm md:text-base table-auto shadow-md">
          <thead>
            <tr className="bg-[#A1C8FE] dark:bg-gray-700 text-gray-800 dark:text-white">
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">House</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Flock</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Feed Planning</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Breed Standard</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Start Date</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Age Start</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Unit</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Slaughterhouse Wt.</th>
              <th className="border border-gray-200 dark:border-gray-500 text-xs px-3 py-2 text-left">Catching Date</th>
            </tr>
          </thead>
          <tbody>
            {(isEditing ? editableData : crop.CropDetail)?.map((detail, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.HouseName}
                      onChange={(e) => onEditChange(index, "HouseName", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.HouseName
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.FlockName}
                      onChange={(e) => onEditChange(index, "FlockName", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.FlockName
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.FeedPlanning}
                      onChange={(e) => onEditChange(index, "FeedPlanning", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.FeedPlanning
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.BreedStandard1}
                      onChange={(e) => onEditChange(index, "BreedStandard1", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.BreedStandard1
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.StartDate}
                      onChange={(e) => onEditChange(index, "StartDate", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.StartDate
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.Age}
                      onChange={(e) => onEditChange(index, "Age", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.Age
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.Number1}
                      onChange={(e) => onEditChange(index, "Number(unit)", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.Number1
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.SlaughterhouseWeight}
                      onChange={(e) => onEditChange(index, "SlaughterhouseWeight", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.SlaughterhouseWeight
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={detail.CatchingDate}
                      onChange={(e) => onEditChange(index, "CatchingDate", e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-500 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md"
                    />
                  ) : (
                    detail.CatchingDate || "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่ม Save เฉพาะตอนแก้ไข */}
      {isEditable && isEditing && (
        <div className="mt-4 text-right">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#A1C8FE] hover:bg-[#3A59D1] dark:bg-[#1DCD9F] text-white rounded shadow dark:hover:bg-[#169976] cursor-pointer"
          >
            💾 Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
export default Manage_production;

