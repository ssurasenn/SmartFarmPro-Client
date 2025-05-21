import React from "react";

export default function HouseInfoForm({
  houses,
  setHouses,
}) {
  const onAddHouse = () => {
    setHouses([
      ...houses,
      { name: "", isEditing: true, isNew: true },
    ]);
  };

  const onToggleEdit = (index) => {
    const updated = [...houses];
    updated[index].isEditing = true;
    setHouses(updated);
  };

  const onRemove = (index) => {
    const updated = [...houses];
    updated.splice(index, 1);
    setHouses(updated);
  };

  const handleInputChange = (index, value) => {
    const updated = [...houses];
    updated[index].name = value;
    setHouses(updated);
  };

  const handleSave = (index) => {
    const updated = [...houses];
    updated[index].isEditing = false;
    updated[index].isNew = false;
    setHouses(updated);
  };

  const handleUpdate = (index) => {
    const updated = [...houses];
    updated[index].isEditing = false;
    setHouses(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md space-y-6 transition-all">
      <div className="bg-gray-200 rounded-t-md">
        <h2 className="text-md font-bold text-gray-800 dark:text-white px-4 py-2 ">Manage Houses</h2>
      </div>
      {houses.length > 0 && (
        <div className="space-y-3">
          {houses.map((house, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-100 rounded-lg p-2"
            >
              {house.isEditing ? (
                <>
                  <input
                    value={house.tempName}
                    onChange={(e) => {
                      const updated = [...houses];
                      updated[index].tempName = e.target.value;
                      setHouses(updated);
                    }}
                    className="flex-1 border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {house.isNew ? (
                    <button
                    onClick={() => {
                      const updated = [...houses];
                      updated[index].name = updated[index].tempName; // เซฟค่า
                      updated[index].isEditing = false;
                      updated[index].isNew = false;
                      setHouses(updated);
                    }}
                  >
                    💾
                  </button>
                  
                  ) : (
                    <button
                      onClick={() => handleUpdate(index)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      title="Update"
                    >
                      🔄 Update
                    </button>
                  )}
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Delete"
                  >
                    🗑
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-gray-700 font-medium">
                    {house.name}
                  </span>
                  <button
                    onClick={() => onToggleEdit(index)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Delete"
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end p-3">
        <button
          onClick={onAddHouse}
          className="flex items-center gap-1 text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow"
        >
          ➕ Add House
        </button>
      </div>
    </div>
  );
}
