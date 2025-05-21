import React from 'react';
import useFarmStore from '../../store/smartfarm-store';

const ClimateHeader = ({ selectedHouse, onHouseChange }) => {
  const farms = useFarmStore((state) => state.farms);
  const selectedFarmCode = useFarmStore((state) => state.selectedFarmCode);

  const selectedFarm = farms.find(f => f.FarmCode === selectedFarmCode);
  const houseList = selectedFarm?.House || [];

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-green-700">สภาพแวดล้อมปัจจุบัน</h1>
        <p className="text-sm text-gray-500">รหัสบอร์ด : H000000000091</p>
      </div>

    <div>
      <p>กรุณาเลือกโรงเรือน</p>
      <select
        className="border border-gray-300 rounded px-3 py-1 text-xs"
        value={selectedHouse}
        onChange={(e) => onHouseChange(e.target.value)}
      >
        {houseList.map((house) => (
          <option key={house.HouseCode} value={house.HouseName}>
            {house.HouseName}
          </option>
        ))}
      </select>
    </div>
      
    </div>
  );
};

export default ClimateHeader;
