import React, { useState } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import useFarmStore from "../../store/smartfarm-store";
import Select from "react-select";

// Select styles
const lightSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f3f4f6",
    borderColor: state.isFocused ? "#4F81ED" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #4F81ED" : "none",
    "&:hover": { borderColor: "#4F81ED" },
    fontSize: "12px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#E5EFFF"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1f2937",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
};

const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#667085" : "#374151",
    boxShadow: state.isFocused ? "0 0 0 1px #667085" : "none",
    color: "#ffffff",
    "&:hover": { borderColor: "#667085" },
    fontSize: "12px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111827",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#1E3A8A"
      : "#111827",
    color: state.isSelected ? "#ffffff" : "#f9fafb",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#FFFFFF" }),
  placeholder: (base) => ({ ...base, color: "#FFFFFF" }),
  input: (base) => ({ ...base, color: "#FFFFFF" }),
};
const RegisterForm = () => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    group: "*",
    farm: "YsFarm(test)^",
    device: "C1QL137J8VHTT1",
    house: "House C4_2",
    pen: "",
    indexScale: "1",
    name: "",
  });
  const farms = useFarmStore((state) => state.farms);
  const farmOptions = Array.isArray(farms)
    ? farms
        .slice()
        .sort((a, b) => {
          const aIsEn = /^[A-Za-z]/.test(a.FarmName);
          const bIsEn = /^[A-Za-z]/.test(b.FarmName);
          if (aIsEn && !bIsEn) return -1;
          if (!aIsEn && bIsEn) return 1;
          return a.FarmName.localeCompare(b.FarmName, "en");
        })
        .map((farm) => ({
          label: farm.FarmName,
          value: farm.FarmCode,
        }))
    : [];

  const selectedFarm = farms.find((f) => f.FarmCode === formData.farm);
  const houseOptions = selectedFarm
    ? selectedFarm.House.map((house) => ({
        value: house.HouseName, // หรือจะใช้ HouseCode ก็ได้ตามที่คุณต้องการเก็บ
        label: house.HouseName,
      }))
    : [];
  //   console.log("houseOption---->>>",houseOption)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering with:", formData);
    // API submission logic here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-3"
    >
      <h2 className="text-xl font-semibold">Register</h2>

      {/* Group */}
      <div className="flex">
        <div className="w-1/3 bg-gray-400 text-white text-center flex items-center justify-center font-medium rounded-l">
          Group
        </div>
        <select
          name="group"
          value={formData.group}
          onChange={handleChange}
          className="w-2/3 p-2 border-t border-b border-r rounded-r"
        >
          <option value="*">*</option>
        </select>
        <button
          type="button"
          className="ml-2 bg-cyan-500 text-white px-3 py-1 rounded"
        >
          +
        </button>
      </div>

      {/* Farm */}
      <div className="flex">
        <div className="w-1/3 bg-gray-400 text-white text-center flex items-center justify-center font-medium rounded-l">
          Farm
        </div>
        <div className="w-2/3">
          <Select
            name="farm"
            options={farmOptions}
            styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
            placeholder="Select farm..."
            value={
              farmOptions.find((opt) => opt.value === formData.farm) || null
            }
            onChange={(selected) =>
              setFormData({ ...formData, farm: selected ? selected.value : "" })
            }
          />
        </div>
        <button
          type="button"
          className="ml-2 bg-cyan-500 text-white px-3 py-1 rounded"
        >
          +
        </button>
      </div>

      <div className="border border-gray-300 p-4 rounded-md space-y-2">
        {/* Device */}
        <div>
          <label className="block text-md font-semibold">Device</label>
          <input
            type="text"
            name="device"
            value={formData.device}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* House */}
        <div className="flex">
          <div className="w-1/3 bg-gray-500 text-white text-center flex items-center justify-center font-medium rounded-l">
            House
          </div>
          <div className="w-2/3">
            <Select
              name="house"
              options={houseOptions}
              styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
              placeholder="Select house..."
              value={
                houseOptions.find((opt) => opt.value === formData.house) || null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  house: selected ? selected.value : "",
                })
              }
            />
          </div>
          <button
            type="button"
            className="ml-2 bg-cyan-500 text-white px-3 py-1 rounded"
          >
            +
          </button>
        </div>

        {/* Pen */}
        <div className="flex">
          <div className="w-1/3 bg-gray-500 text-white text-center flex items-center justify-center font-medium rounded-l">
            Pen
          </div>
          <div className="w-2/3">
            <Select
              name="pen"
              options={farmOptions}
              styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
              placeholder=""
              value={
                farmOptions.find((opt) => opt.value === formData.pen) || null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  farm: selected ? selected.value : "",
                })
              }
            />
          </div>
          <button
            type="button"
            className="ml-2 bg-emerald-500 text-white px-3 py-1 rounded"
          >
            +
          </button>
        </div>

        {/* Index Scale */}
        <div>
          <label className="block text-sm font-medium">Index scale</label>
          <select
            name="indexScale"
            value={formData.indexScale}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="1">1</option>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="01 หน้าเล้า"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-teal-500 text-white py-2 rounded"
      >
        Register Now
      </button>
    </form>
  );
};

export default RegisterForm;
