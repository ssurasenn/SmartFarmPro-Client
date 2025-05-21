import React, { useState } from "react";
import useFarmStore from "../store/smartfarm-store";
import defaultImage from "../assets/images_avatar.jpeg"

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SettingProfile = () => {
  const setProfileImage = useFarmStore((state) => state.setProfileImage);
  const [previewImage, setPreviewImage] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");


  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreviewImage(base64);
        setProfileImage(base64); // ✅ ส่งให้ Zustand
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleSave = () => {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // TODO: Implement real upload + password change logic here
    toast.success("Profile updated successfully! (mock)");

    // Reset state
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
    <div>
      <button 
        onClick={() => navigate("/overview/house")}
        className="bg-gray-300 hover:bg-gray-400 hover:translate-x-8 cursor-pointer text-sm px-3 py-2 rounded-xl shadow transition-all duration-500">Back</button>
    </div>
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">Profile Settings</h2>

      {/* Profile Image Upload */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={previewImage || defaultImage}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 dark:text-white mb-1">
            Upload new photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-500 dark:text-gray-500 bg-gray-200 rounded-md px-2 cursor-pointer w-[190px] "
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
          Current Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
          New Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 text-center text-sm text-blue-600">{message}</div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white hover:bg-[#82A9F4] dark:hover:bg-[#17B78C] font-semibold py-2 rounded-lg transition-all duration-200"
      >
        Save Changes
      </button>
    </div>
    </>
  );
};

export default SettingProfile;
