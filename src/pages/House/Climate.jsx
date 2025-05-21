import React, { useState } from 'react'
import ClimateHeader from '../../components/house/ClimateHeader'

const Climate = () => {
  const [selectedHouse, setSelectedHouse] = useState('House 1'); // ค่า default
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">      
      <ClimateHeader selectedHouse={selectedHouse} onHouseChange={setSelectedHouse}/>
    </div>
  )
}

export default Climate