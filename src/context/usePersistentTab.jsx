// hooks/usePersistentTab.js
import { useState, useEffect } from "react";

const usePersistentTab = (key, defaultTab) => {
  const [tab, setTab] = useState(() => localStorage.getItem(key) || defaultTab);

  useEffect(() => {
    if (tab) localStorage.setItem(key, tab);
  }, [key, tab]);

  return [tab, setTab];
};

export default usePersistentTab;
