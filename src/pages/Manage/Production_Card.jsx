import React, { useEffect, useState } from "react";
import { useSelection } from "../../context/SelectionContext";
import { useNavigate } from "react-router-dom";
import useFarmStore from "../../store/smartfarm-store";
import { ArrowUpRight } from "lucide-react";

const Production_Card = () => {
  const { selectedFarm } = useSelection();
  const { farms, productionList, getProduction, croplist, cropList } =
    useFarmStore();
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const navigate = useNavigate();

  const selectedFarmData = farms.find((farm) => farm.FarmCode === selectedFarm);
  const farmName = selectedFarmData?.FarmName || "Farm";

  useEffect(() => {
    if (farms.length === 0) {
      FarmList();
      console.log("✅ houses", houses);
    }
  }, [houses]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!selectedFarm) return;
      setHouses([]); // ← เคลียร์ของเดิมก่อนโหลดใหม่
      const farmData = farms.find((farm) => farm.FarmCode === selectedFarm);
      if (!farmData) return;

      let cropData = croplist;
      if (croplist.length === 0) {
        const cropRes = await cropList(selectedFarm);
        if (!cropRes.success) return;
        cropData = cropRes.data;
      }
      console.log("🧠 cropData", cropData);

      const firstCropCode = cropData[0]?.CropCode;
      if (!firstCropCode) return;

      const prodRes = await getProduction(selectedFarm, firstCropCode);
      if (!prodRes.success) return;

      const prodList = prodRes.data;
      console.log("prodList---->>>", prodList);

      const houseList = (farmData?.House || []).map((house) => {
        const prod = prodList.find((p) => p.HouseCode === house.HouseCode);

        const matchedCrop = cropData.find(
          (crop) =>
            prod &&
            new Date(prod.StartDate) >= new Date(crop.StartCrop) &&
            new Date(prod.StartDate) <= new Date(crop.EndCrop)
        );

        return {
          ...house,
          ...(prod || {}), // ถ้ามี production ค่อย merge ลงไป
          crop: matchedCrop?.CropCode || "-",
          statusCrop: matchedCrop?.StatusCrop ?? undefined,
        };
      });

      //        // กรอง null ออก
      console.log("🏠 house list", farmData?.House);
      
      setHouses(houseList);
    };
    
    fetchAllData();
  }, [selectedFarm, farms, croplist]);
  
  //       console.log("✅ farms", farms);
  //       console.log("✅ croplist", croplist);
  //       console.log("✅ selectedFarm", selectedFarm);
  // console.log("📦 productionList", prodList);
  if (!selectedFarm) {
    return <p className="p-6 text-gray-600">⚠️ Please select a farm</p>;
  }
  const getStatusBadge = (rawStatus) => {
    const s = parseInt(rawStatus); // ใช้ parseInt กันเหนียว

    if (isNaN(s)) {
      return (
        <span className="inline-block bg-gray-400 text-white text-xs px-2 py-1 rounded-full shadow-sm">
          Unknown
        </span>
      );
    }

    if (s === 1) {
      return (
        <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
          In Progress
        </span>
      );
    }

    if (s === 0) {
      return (
        <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
          Completed
        </span>
      );
    }

    return (
      <span className="inline-block bg-gray-400 text-white text-xs px-2 py-1 rounded-full shadow-sm">
        Unknown
      </span>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-left text-xl font-bold text-gray-800 dark:text-white mb-6">
        Houses Overview in{" "}
        <span className="text-blue-400 dark:text-[#1DCD9F]">{farmName}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => {
          // สร้าง count ของ production ที่ตรงกับ house นี้
        const cropCount = productionList.filter((prod) => prod.HouseCode === house.HouseCode).length;
        
        // หาค่า BreedStandard1 ตัวล่าสุดของ house นี้จาก productionList
        const houseProductions = productionList.filter(
          (prod) => prod.HouseCode === house.HouseCode
        );
        const latestProduction = houseProductions[0]; // สมมุติว่ารายการแรกคือล่าสุด (หรือจะ sort ก่อนก็ได้)
        const breedStandard = latestProduction?.BreedStandard1 || "N/A";
          return (
          <div
            key={house.HouseCode}
            onClick={() => setSelectedHouse(house)}
            className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col gap-2">
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {house.HouseName}
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <span className="text-xs">Latest:</span> 
                  {breedStandard}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <span className="font-medium">Crop Count:</span> {cropCount}
                </div>
                <div>
                  {console.log(
                    "🏷 Rendering badge for statusCrop:",
                    house.statusCrop
                  )}
                  <span className="mr-2">Status :</span>{getStatusBadge(house.statusCrop)}
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowUpRight className="text-blue-600 dark:text-[#1DCD9F] w-5 h-5" />
            </div>
          </div>
          )
        })}
      </div>

      {/* {selectedHouse && (
        <div className="mt-8">
          <HouseDetailPage productionData={selectedHouse} />
        </div>
      )} */}
    </div>
  );
};

export default Production_Card;
