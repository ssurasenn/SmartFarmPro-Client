import React from "react";

export default function FarmInfoForm({ farmData, setFarmData, onSave }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmData((prev) => ({ ...prev, [name]: value }));
  };

  const InputField = ({ name, label }) => (
    <div className="flex flex-col">
      <label className="text-xs text-gray-600 dark:text-gray-300 font-medium mb-1 capitalize">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={farmData[name] || ""}
        onChange={handleChange}
        className="w-full px-2 py-1.5 text-sm sm:px-3 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-400 shadow focus:outline-none 
  focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-300 focus:border-transparent"
        placeholder={`Enter ${label}`}
      />
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-md p-4 sm:p-6 space-y-4 transition-all w-1/2 ">
      <h2 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        Farm Information
      </h2>

      {/* Section: General Info */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField name="name" label="Farm Name" />
          <InputField name="species" label="Species" />
          <InputField name="email" label="Email" />
          <InputField name="phone" label="Phone" />
          <InputField name="address" label="Address" />
        </div>
      </div>

      {/* Section: Location */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField name="latitude" label="Latitude" />
          <InputField name="longitude" label="Longitude" />
          <InputField name="timezone" label="Timezone" />
        </div>
      </div>

      {/* Section: Settings */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField name="daylightSaving" label="Daylight Saving" />
          <InputField name="feedDensity" label="Default Feed Density (kg/m³)" />
          <InputField name="slaughterhouse" label="SlaughterHouse" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-[#1dcd9b] dark:hover:bg-[#169976] text-white px-5 py-2 rounded-lg shadow transition duration-300"
        >
          📂 Save Farm Info
        </button>
      </div>
    </div>
  );
}
