import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { IoPersonCircle } from "react-icons/io5";
import defaultImage from "../assets/images_avatar.jpeg"
import useFarmStore from "../store/smartfarm-store";

const ProfileBtn = () => {
  const [open, setOpen] = useState(false);
  const user = useFarmStore((state) => state.user);
  const profileImage = useFarmStore((state) => state.profileImage)
  const logoutUser = useFarmStore((state) => state.logoutUser);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  // console.log("this response from user---> ", user)
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // console.log("profileImage--->", profileImage)
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={profileImage || defaultImage }
          alt="profile"
          className="w-8 h-8 rounded-full object-cover shadow-gray-400 shadow dark:shadow-md dark:shadow-gray-400 hover:shadow-lg"
        />
        
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border-gray-300 dark:border-gray-700  z-20">
          <div className="px-4 py-3">
            <p className="text-sm text-gray-900 dark:text-white font-semibold">My Profile</p>
            <p className="text-xs text-gray-500 dark:text-gray-200">{user?.['.name'] || "Guest"}</p>
            {/* <p className=""></p> */}
          </div>
          <hr className="text-gray-300 dark:text-gray-600 mx-2"/>
          <button 
            onClick={() => navigate("/profile-setting")}
            className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300 transition-all duration-300">Setting profile</button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300 rounded-b-lg transition-all duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileBtn;
