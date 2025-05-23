import React, { useEffect, useState } from "react";
import Select from "react-select";
import farmData from "../../data/farmData";
import { useDarkMode } from "../../context/DarkModeContext";
import { toast } from "react-toastify";
import useFarmStore from "../../store/smartfarm-store";
import RegisterForm from "../../components/house/RegisterFrom";
import { useTranslation } from "react-i18next";


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
    backgroundColor: state.isSelected ? "#4F81ED" : state.isFocused ? "#E5EFFF" : "#ffffff",
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
    backgroundColor: state.isSelected ? "#4F81ED" : state.isFocused ? "#1E3A8A" : "#111827",
    color: state.isSelected ? "#ffffff" : "#f9fafb",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#FFFFFF" }),
  placeholder: (base) => ({ ...base, color: "#FFFFFF" }),
  input: (base) => ({ ...base, color: "#FFFFFF" }),
};

// Options


const defaultForm = {
  
  mode: "",
  device_id: "",
  mfg_date: "",
  exp_date: "",
  last_connect: "",
  device_ref: "",
  view_indicator: "",
  status: true,
};

const ManageDevice = () => {
  const [form, setForm] = useState(defaultForm);
  const [devices, setDevices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const { isDarkMode } = useDarkMode();

  const farms = useFarmStore((state) => state.farms);
  const farmOptions = farms.map((farm) => ({
  value: farm.FarmCode,
  label: farm.FarmName,
}));

  const { t } = useTranslation();
  // console.log("selectedFarm---->>>",selectedFarm)
  const handleAddOrUpdate = () => {
    if (!form.mode || !form.role || !form.device_id) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (editIndex !== null) {
      const updated = [...devices];
      updated[editIndex] = form;
      setDevices(updated);
      toast.success("Updated successfully!");
    } else {
      setDevices([...devices, form]);
      toast.success("Added successfully!");
    }
    
    setForm(defaultForm);
    setEditIndex(null);
  };
  
  const handleEdit = (index) => {
    setForm(devices[index]);
    setEditIndex(index);
  };
  
  const handleDelete = (index) => {
    const updated = [...devices];
    updated.splice(index, 1);
    setDevices(updated);
    toast.error("Deleted successfully!");
  };
  
  const handleToggleStatus = (index) => {
    const updated = [...devices];
    updated[index].status = !updated[index].status;
    setDevices(updated);
  };
  
  // Load from localStorage
  useEffect(() => {
    const savedDevices = localStorage.getItem("device-table");
    if (savedDevices) {
      try {
        setDevices(JSON.parse(savedDevices));
      } catch (error) {
        console.error("Error parsing devices from localStorage", error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("device-table", JSON.stringify(devices));
  }, [devices]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-6">
        <h1 className="text-md font-bold text-gray-700 dark:text-white">{t("manage_device.title")}</h1>
        <button className="bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white dark:hover:bg-[#17B78C] hover:bg-blue-400 px-3 py-1 rounded-lg shadow-md cursor-pointer">+</button>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 border border-gray-200 dark:border-gray-700">
        {/* <RegisterForm /> */}

          {/* <Select
            options={farmOptions}
            styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
            placeholder="Select farm..."
            value={farmOptions.find((opt) => opt.value === form.farm) || null}
            onChange={(selected) => setForm({ ...form, farm: selected.value })}
          /> */}
          
         
      </div>

      {/* Devices Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse shadow-md rounded-xl overflow-hidden">
          <thead className="bg-[#A1C8FE] dark:bg-gray-700 text-white">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3 text-center ">{t("manage_device.Mode")}</th>
              <th className="px-4 py-3 text-center ">{t("manage_device.Device_ID")}</th>
              <th className="px-4 py-3 text-center ">{t("manage_device.Mfg_Date")}</th>
              <th className="px-4 py-3 text-center ">{t("manage_device.Exp_Date")}</th>
              <th className="px-4 py-3 text-center ">{t("manage_device.Last_Connect")}</th>
              <th className="px-4 py-3 text-center ">{t("manage_device.Device_Ref")}</th>
              <th className="px-4 py-3 text-center ">{t("manage_device.View_Indicator")}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
            {devices.map((user, index) => (
              <tr key={index} className="hover:bg-[#F3F7FE] dark:hover:bg-gray-800 transition duration-200">
                <td className="px-4 py-2">{user.mode}</td>
                <td className="px-4 py-2">{user.device_id}</td>
                <td className="px-4 py-2">{user.mfg_date}</td>
                <td className="px-4 py-2">{user.exp_date}</td>
                <td className="px-4 py-2">{user.last_connect}</td>
                <td className="px-4 py-2">{user.device_ref}</td>
                <td className="px-4 py-2">{user.view_indicator}</td>
                {/* <td className="px-4 py-2">
                  <label className="relative inline-block w-10 h-6">
                    <input
                      type="checkbox"
                      checked={user.status}
                      onChange={() => handleToggleStatus(index)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-300 peer-checked:bg-[#1DCD9F] rounded-full transition-colors duration-300"></div>
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-4"></div>
                  </label>
                </td> */}
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(index)} className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-400 dark:text-gray-500 italic">
                  {t("manage_device.noDevices_added_yet")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDevice;
