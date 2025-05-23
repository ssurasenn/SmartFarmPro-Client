import React, { useEffect, useState } from "react";
import Select from "react-select";
import farmData from "../../data/farmData";
import { useDarkMode } from "../../context/DarkModeContext";
import { toast } from "react-toastify";

const lightSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f3f4f6", // พื้นหลังของ select
    borderColor: state.isFocused ? "#4F81ED" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #4F81ED" : "none",
    "&:hover": {
      borderColor: "#4F81ED",
    },
    fontSize: "12px", // text-sm
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff", // พื้นหลัง dropdown
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#E5EFFF"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1f2937", // text-gray-800
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
};

//   <<---------------------Select Dark Theme ------------------->>>>>
const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f2937", // bg-gray-800
    borderColor: state.isFocused ? "#667085" : "#374151", // focus: blue-500 / default: gray-700
    boxShadow: state.isFocused ? "0 0 0 1px #667085" : "none",
    color: "#ffffff", // text-gray-100
    "&:hover": {
      borderColor: "#667085",
    },
    fontSize: "12px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111827", // dropdown: bg-gray-900
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4F81ED"
      : state.isFocused
      ? "#1E3A8A" // blue-900
      : "#111827",
    color: state.isSelected ? "#ffffff" : "#f9fafb",
    fontSize: "12px",
    padding: "10px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF", // selected text color
  }),
  placeholder: (base) => ({
    ...base,
    color: "#FFFFFF", // placeholder: text-gray-400
  }),
  input: (base) => ({
    ...base,
    color: "#FFFFFF", // text ขาวตอนพิมพ์
  }),
};

// <<---------------Set Options ---------------->>
const farmOptions = farmData.farms.map((farm) => ({
  label: farm,
  value: farm,
}));

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Worker", label: "Worker" },
];

const Member = () => {
  const [form, setForm] = useState({ email: "", role: "", farm: "", status: true });
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const savedUsers = localStorage.getItem("user-table");
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error("Error parsing users from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user-table", JSON.stringify(users));
  }, [users]);

  const handleAddOrUpdate = () => {
    if (!form.email || !form.role) return;

    if (editIndex !== null) {
      const updated = [...users];
      updated[editIndex] = form;
      setUsers(updated);
      setEditIndex(null);

      toast.success("Updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setUsers([...users, form]);

      toast.success("Added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setForm({ email: "", role: "", status: true });
  };

  const handleEdit = (index) => {
    setForm(users[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);

    toast.error("Deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleToggleStatus = (index) => {
    const updated = [...users];
    updated[index].status = !updated[index].status;
    setUsers(updated);
  };

  
  return (
    <div className="p-6 space-y-6">
    {/* Header */}
    <h1 className="text-xl font-bold text-gray-700 dark:text-white">
      🤵 Create Member
    </h1>

    {/* Input Section */}
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            placeholder="Enter email"
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-400 text-gray-700 dark:text-white focus:ring-2 focus:ring-[#A1C8FE] dark:focus:ring-[#1DCD9F] focus:outline-none transition"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm">
            📧
          </span>
        </div>

        {/* Role */}
        <div className="relative">
          <Select
            options={roleOptions}
            styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
            placeholder="Select role..."
            isSearchable
            className="text-sm "
            value={roleOptions.find((opt) => opt.value === form.role) || null}
            onChange={(selected) => setForm({ ...form, role: selected.value })}
          />
          {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 text-sm">
            🧩
          </span> */}
        </div>

        {/* Group / Farm Select */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <Select
            options={farmOptions}
            styles={isDarkMode ? darkSelectStyles : lightSelectStyles}
            placeholder="Group / Farm Name..."
            isSearchable
            className="text-sm"
            value={farmOptions.find((opt) => opt.value === form.farm) || null}
            onChange={(selected) => setForm({ ...form, farm: selected.value })}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleAddOrUpdate}
            className="w-full bg-[#A1C8FE] dark:bg-[#1DCD9F] hover:bg-blue-500 dark:hover:bg-[#1dcd9ece] text-white py-2 px-4 rounded-lg text-sm font-medium transition-all"
          >
            {editIndex !== null ? "Update" : "Invite"}
          </button>
        </div>
      </div>
    </div>

    {/* Table Section */}
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse shadow-md rounded-xl overflow-hidden">
        <thead className="bg-[#A1C8FE] dark:bg-[#374151] text-white">
          <tr>
            <th className="px-4 py-3 text-center">Email</th>
            <th className="px-4 py-3 text-center">Role</th>
            <th className="px-4 py-3 text-center">Group / Farm</th> 
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user, index) => (
            <tr
              key={index}
              className="hover:bg-[#F3F7FE] dark:hover:bg-gray-800 transition duration-200"
            >
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.farm}</td>
              <td className="px-4 py-2 text-center">
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
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-600 hover:text-blue-800 transition font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 transition font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-400 dark:text-gray-500 italic">
                No members yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
</div>

  );
};

export default Member;
