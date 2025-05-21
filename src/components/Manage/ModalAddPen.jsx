import React, { useState } from "react";

export default function ModalAddPen({ open, onClose, onAdd, houseOptions }) {
  const [pen, setPen] = useState({
    houseIndex: 0,
    penIndex: 1,
    penName: "",
    penSex: "",
    ratio: "",
  });

  const handleChange = (e) => {
    setPen({ ...pen, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    onAdd(pen);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <h3 className="text-xl font-bold mb-4">➕ Add New Pen</h3>

        <label className="block mb-2">
          House:
          <select
            name="houseIndex"
            className="w-full border rounded p-2"
            value={pen.houseIndex}
            onChange={handleChange}
          >
            {houseOptions.map((house, i) => (
              <option value={i} key={i}>
                {house.name || `House ${i + 1}`}
              </option>
            ))}
          </select>
        </label>

        <input
          name="penName"
          placeholder="Pen Name"
          className="w-full border rounded p-2 mb-2"
          value={pen.penName}
          onChange={handleChange}
        />
        <input
          name="penSex"
          placeholder="Pen Sex"
          className="w-full border rounded p-2 mb-2"
          value={pen.penSex}
          onChange={handleChange}
        />
        <input
          name="ratio"
          placeholder="Ratio"
          className="w-full border rounded p-2 mb-4"
          value={pen.ratio}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
