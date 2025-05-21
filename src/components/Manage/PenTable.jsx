import React, { useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Box, Checkbox, IconButton, Typography } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

const PenTable = () => {
    const [useRatio, setUseRatio] = useState(true);
  const [rows, setRows] = useState([
    {
      id: 1,
      house: "My House",
      index: 1,
      name: "Pen 1",
      sex: "Male",
      ratio: 1.0,
    },
    {
      id: 2,
      house: "My House",
      index: 2,
      name: "Pen 2",
      sex: "Female",
      ratio: 1.0,
    },
  ]);

  const handleRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows([
      ...rows,
      {
        id: nextId,
        house: "",
        index: rows.length + 1,
        name: "",
        sex: "",
        ratio: 1.0,
      },
    ]);
  };

  const columns = [
    { field: "house", headerName: "House", flex: 1, editable: true },
    { field: "index", headerName: "Index Pen", type: "number", flex: 1, editable: true },
    { field: "name", headerName: "Pen Name", flex: 1.5, editable: true },
    { field: "sex", headerName: "Pen Sex", flex: 1, editable: true },
    {
      field: "ratio",
      headerName: "Ratio",
      type: "number",
      flex: 1,
      editable: true,
      valueFormatter: ({ value }) =>  typeof value === "number" ? value.toFixed(2) : "",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <IconButton onClick={handleAddRow} color="primary">
        <Add />
      </IconButton>
    </GridToolbarContainer>
  );
  return (
    <Box className="bg-green-50 p-4 rounded-xl space-y-4">
    <Typography variant="h6">🟢 Pen</Typography>

    <Box display="flex" alignItems="center" gap={1}>
      <Checkbox
        checked={useRatio}
        onChange={(e) => setUseRatio(e.target.checked)}
      />
      <Typography>Use ratio in calculate</Typography>
    </Box>

    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={handleRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: CustomToolbar }}
      />
    </div>
  </Box>
  )
}

export default PenTable