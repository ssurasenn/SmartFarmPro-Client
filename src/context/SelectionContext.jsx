// context/SelectionContext.tsx
import React, { createContext, useState, useContext } from "react";

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

export const useSelection = () => useContext(SelectionContext);
