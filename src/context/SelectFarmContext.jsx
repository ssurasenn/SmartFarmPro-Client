import React, { createContext, useContext, useState } from "react";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  return (
    <SelectionContext.Provider value={{ selectedFarm, setSelectedFarm, selectedCrop, setSelectedCrop }}>
      {children}
    </SelectionContext.Provider>
  );
};

// Hook เอาไว้เรียกใช้ context
export const useSelection = () => useContext(SelectionContext);
