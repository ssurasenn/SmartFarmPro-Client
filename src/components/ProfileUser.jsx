import React from "react";
import profil1 from "../assets/img/profile1.jpg";

const ProfileUser = () => {
  return (
    <div className="p-4 ">
      <div className="border-t border-gray-300 ">
        <div className="flex items-center pl-6 py-1 my-4 gap-2 rounded-lg duration-300 dark:hover:bg-[#667085] dark:hover:text-gray-200 ">
          <img
            src={profil1}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover shadow cursor-pointer"
          />
          <h1 className="text-gray-600 font-semibold dark:text-white cursor-pointer">FirstName </h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
