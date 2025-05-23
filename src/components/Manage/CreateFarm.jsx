import React, { useState } from "react";
import FarmInfoForm from "./FarmInfoForm";
import HouseInfoForm from "./HouseInfoForm";

export default function CreateFarmForm() {
 
  const [farmData, setFarmData] = useState({
    name: "",
    species: "",
    address: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    timezone: "",
    daylightSaving: "",
    feedDensity: "",
    slaughterhouse: "",
    houses: [],
  });
  

  return (
    <div className="flex p-4 md:p-5  bg-gray-100 dark:bg-gray-900 rounded-lg gap-5">
      <FarmInfoForm farmData={farmData} setFarmData={setFarmData} onSave={() => console.log("Saving Farm Info", farmData)} />

      
    </div>
  );
}
