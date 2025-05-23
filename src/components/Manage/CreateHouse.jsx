import React, { useState } from "react";
import HouseInfoForm from "./HouseInfoForm";
import { RiAddFill } from "react-icons/ri";

const CreateHouse = () => {
  const [farmData, setFarmData] = useState({
    name: "",
    species: "",
    address: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    timezone: "",
    daylightSaving: "",
    feedDensity: "",
    slaughterhouse: "",
    houses: [],
  });

  const [penData, setPenData] = useState([]);
  const [siloData, setSiloData] = useState([]);
  const [scaleData, setScaleData] = useState([]);

  const setHouses = (houses) => {
    setFarmData((prev) => ({ ...prev, houses }));
    houses.forEach((house, index) =>
      updateHouseNameInAllTables(index, house.name)
    );
  };

  const updateHouseNameInAllTables = (index, name) => {
    setPenData((prev) =>
      prev.map((p) => (p.houseIndex === index ? { ...p, houseName: name } : p))
    );
    setSiloData((prev) =>
      prev.map((s) => (s.houseIndex === index ? { ...s, houseName: name } : s))
    );
    setScaleData((prev) =>
      prev.map((s) => (s.houseIndex === index ? { ...s, houseName: name } : s))
    );
  };
  const renderTable = (title, data, columns, addAction, onDelete) => (
    <div>
      <div className="flex justify-between items-center px-3  bg-gray-200 dark:bg-gray-700 rounded-t-lg">
        <h3 className="text-md font-semibold px-4 py-2 dark:text-white">
          {title}
        </h3>
        <button
          onClick={addAction}
          className="bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white hover:bg-blue-500 dark:hover:bg-[#17A783] p-2 rounded-lg"
        >
          <RiAddFill />

        </button>
      </div>
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-b-lg space-y-6 p-4 transition-all w-full overflow-x-auto">
      
      <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-400">
        <table className="table-auto w-full text-xs">
          <thead className="bg-gray-200 dark:bg-gray-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="border border-gray-300 dark:border-gray-400 px-3 py-1 text-center whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
              <th className="border border-gray-300 dark:border-gray-400 px-2 py-1 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="bg-white dark:bg-gray-300 hover:bg-gray-50 dark:hover:bg-gray-200 text-center whitespace-nowrap">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="border border-gray-300 dark:border-gray-400 px-2 py-1"
                  >
                    {row[col.key] || ""}
                  </td>
                ))}
                <td className="border border-gray-300 dark:border-gray-400 px-2 py-1">
                  <button
                    onClick={() => onDelete(row.id)}
                    className="text-red-600 hover:underline text-sm"
                  ></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
  return (
    <div className="flex gap-5">
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 ">
        <HouseInfoForm
          houses={farmData.houses}
          setHouses={setHouses}
          onToggleEdit={(index) => {
            const updated = [...farmData.houses];
            updated[index].isEditing = !updated[index].isEditing;
            setHouses(updated);
          }}
          onRemove={(index) =>
            setHouses(farmData.houses.filter((_, i) => i !== index))
          }
          onAddHouse={() =>
            setHouses([
              ...farmData.houses,
              {
                name: "", // saved name
                tempName: "", // input ที่พิมพ์อยู่
                isEditing: true,
                isNew: true, // ใช้สำหรับแยกว่าควรแสดงปุ่ม Save
              },
            ])
          }
          onSave={() => console.log("Saving Houses", farmData.houses)}
        />

        {renderTable(
          "Pen",
          penData,
          [
            { key: "houseName", header: "House" },
            { key: "penIndex", header: "Index" },
            { key: "penName", header: "Name" },
            { key: "penSex", header: "Sex" },
            { key: "ratio", header: "Ratio" },
          ],
          () =>
            setPenData([
              ...penData,
              {
                id: Date.now(),
                houseIndex: 0,
                houseName: farmData.houses[0]?.isEditing
                  ? ""
                  : farmData.houses[0]?.name || "", // ใช้ name เฉพาะที่ save แล้ว

                penIndex: penData.length + 1,
                penName: "",
                penSex: "",
                ratio: "",
              },
            ]),
          (id) => setPenData(penData.filter((row) => row.id !== id))
        )}

        {renderTable(
          "Silo",
          siloData,
          [
            { key: "houseName", header: "House" },
            { key: "siloIndex", header: "Index Silo" },
            { key: "siloName", header: "Silo Name" },
            { key: "device", header: "Connect Device" },
          ],
          () =>
            setSiloData([
              ...siloData,
              {
                id: Date.now(),
                houseIndex: 0,
                houseName: farmData.houses[0]?.name || "",
                siloIndex: siloData.length + 1,
                siloName: "",
                device: "",
              },
            ]),
          (id) => setSiloData(siloData.filter((row) => row.id !== id))
        )}

        {renderTable(
          "Scale",
          scaleData,
          [
            { key: "houseName", header: "House" },
            { key: "scaleIndex", header: "Index Scale" },
            { key: "scaleName", header: "Scale Name" },
            { key: "device", header: "Connect Device" },
            { key: "pen", header: "Pen" },
            { key: "deleteRaw", header: "Delete Raw" },
          ],
          () =>
            setScaleData([
              ...scaleData,
              {
                id: Date.now(),
                houseIndex: 0,
                houseName: farmData.houses[0]?.name || "",
                scaleIndex: scaleData.length + 1,
                scaleName: "",
                device: "",
                pen: "",
                deleteRaw: "",
              },
            ]),
          (id) => setScaleData(scaleData.filter((row) => row.id !== id))
        )}
      </div>
    </div>
  );
};

export default CreateHouse;
