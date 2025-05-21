import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelection } from "../../context/SelectionContext";
import houseData from "../../data/houseData"; // ✅ นำเข้าชุด houseData

const ProductionPage = () => {
  const { selectedFarm } = useSelection(); // ✅ ดึงค่าฟาร์มที่เลือก
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (selectedFarm && houseData[selectedFarm]) {
      setRows(houseData[selectedFarm]); // ✅ โหลดข้อมูล house ของฟาร์มที่เลือก
    } else {
      setRows([]);
    }
  }, [selectedFarm]);

  const handleRowUpdate = (newRow) => {
    const updated = rows.map((r) => (r.id === newRow.id ? newRow : r));
    setRows(updated);
    return newRow;
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 50 },
    { field: "house", headerName: "House", width: 100 },
    { field: "crop", headerName: "Crop", width: 100, editable: true },
    { field: "flock", headerName: "Flock", width: 100, editable: true },
    { field: "feedPlanning", headerName: "Feed Plan", width: 120, editable: true },
    { field: "breedStandard", headerName: "Breed Std", width: 120, editable: true },
    { field: "number", headerName: "Number(unit)", width: 100, editable: true },
    { field: "startDate", headerName: "Start Date", width: 120, editable: true },
    { field: "catchingDate", headerName: "Catching Date", width: 130, editable: true },
  ];
// 
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">
        🏠 Houses of {selectedFarm || "Please select a farm"}
      </h2>
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          fontSize: "0.75rem",         // ขนาดตัวอักษรเล็ก
          "& .MuiDataGrid-cell": {
            padding: "4px",
          },
          "& .MuiDataGrid-row": {
            px: 1,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f3f4f6", // light gray
            fontWeight: "bold",
          },
        }}
        rowHeight={36}    
        autoHeight
        getRowId={(row) => row.id}
        processRowUpdate={handleRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};

export default ProductionPage;
