import React from "react";
import RenderCell from "./RenderCell";

const CropTable = ({ editableData = [], isEditing, handleEditChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">House Name</th>
            <th className="px-4 py-2 border">Flock Name</th>
            <th className="px-4 py-2 border">Date Start</th>
            <th className="px-4 py-2 border">Date End</th>
            <th className="px-4 py-2 border">Age Of Start</th>
            <th className="px-4 py-2 border">Feed Planning</th>
            <th className="px-4 py-2 border">Focus Catch</th>
            <th className="px-4 py-2 border">Breed Standard 1</th>
            <th className="px-4 py-2 border">Number 1</th>
            <th className="px-4 py-2 border">Date Catch</th>
            <th className="px-4 py-2 border">Slaughterhouse Weight</th>
          </tr>
        </thead>
        <tbody>
          {editableData.map((row, index) => (
            <tr key={index} className="bg-white even:bg-gray-50">
              <RenderCell
                row={row}
                index={index}
                isEditing={isEditing}
                handleEditChange={handleEditChange}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CropTable;
