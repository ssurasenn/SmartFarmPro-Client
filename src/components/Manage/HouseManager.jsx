import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import HouseInfoForm from "./HouseInfoForm";

export default function HouseManager() {
  const [houses, setHouses] = useState([{ name: "", isEditing: true }]);
  const [penData, setPenData] = useState([]);
  const [siloData, setSiloData] = useState([]);
  const [scaleData, setScaleData] = useState([]);

  const updateHouseNameInTables = (index, newName) => {
    setPenData((prev) =>
      prev.map((item) =>
        item.houseIndex === index ? { ...item, houseName: newName } : item
      )
    );
    setSiloData((prev) =>
      prev.map((item) =>
        item.houseIndex === index ? { ...item, houseName: newName } : item
      )
    );
    setScaleData((prev) =>
      prev.map((item) =>
        item.houseIndex === index ? { ...item, houseName: newName } : item
      )
    );
  };

  const handleSetHouses = (updatedHouses) => {
    setHouses(updatedHouses);
    updatedHouses.forEach((house, index) => {
      updateHouseNameInTables(index, house.name);
    });
  };

  const onAddHouse = () => {
    setHouses([...houses, { name: "", isEditing: true }]);
  };

  const onToggleEdit = (index) => {
    const updated = [...houses];
    updated[index].isEditing = !updated[index].isEditing;
    setHouses(updated);
  };

  const onRemove = (index) => {
    setHouses(houses.filter((_, i) => i !== index));
  };

  const columnsPen = [
    { field: "houseName", headerName: "House", width: 150 },
    { field: "penIndex", headerName: "Index Pen", width: 120 },
    { field: "penName", headerName: "Pen Name", width: 150 },
    { field: "penSex", headerName: "Pen Sex", width: 120 },
    { field: "ratio", headerName: "Ratio", width: 100 },
  ];

  const columnsSilo = [
    { field: "houseName", headerName: "House", width: 150 },
    { field: "siloIndex", headerName: "Index Silo", width: 120 },
    { field: "siloName", headerName: "Silo Name", width: 150 },
    { field: "device", headerName: "Connect Device", width: 150 },
  ];

  const columnsScale = [
    { field: "houseName", headerName: "House", width: 150 },
    { field: "scaleIndex", headerName: "Index Scale", width: 120 },
    { field: "scaleName", headerName: "Scale Name", width: 150 },
    { field: "device", headerName: "Connect Device", width: 150 },
    { field: "pen", headerName: "Pen", width: 100 },
    { field: "deleteRaw", headerName: "Delete Raw Data", width: 150 },
  ];

  return (
    <div className="p-4 space-y-6">
      <HouseInfoForm
        houses={houses}
        setHouses={handleSetHouses}
        onAddHouse={onAddHouse}
        onToggleEdit={onToggleEdit}
        onRemove={onRemove}
      />

      <div>
        <h3 className="text-xl font-semibold mb-2">🐖 Pen Table</h3>
        <DataGrid
          rows={penData}
          columns={columnsPen}
          getRowId={(row) => row.id}
          autoHeight
          pageSize={5}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">🌾 Silo Table</h3>
        <DataGrid
          rows={siloData}
          columns={columnsSilo}
          getRowId={(row) => row.id}
          autoHeight
          pageSize={5}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">⚖️ Scale Table</h3>
        <DataGrid
          rows={scaleData}
          columns={columnsScale}
          getRowId={(row) => row.id}
          autoHeight
          pageSize={5}
        />
      </div>
    </div>
  );
}
