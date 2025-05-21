import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { login } from "../api/Auth";
import { getBreedStandardDetails, getBreedStandardList, getCropList, getDataFarm, getFeedPlanningDetails, getfeedPlanningList, getProduction,getSettingProduction, startCrop} from '../api/FarmData'
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const SmartFarmStore = (set) => ({
  token: null,
  user: null, // 👉 เพิ่ม user object
  isAuthenticated: false,
isHydrated: false,

  farms: [],
  houseCodes: [],
  croplist: [],
  productionList: [],
  settingProduction: [],
  selectBreedStandard:[],
  selectPlanningList:[],
  breedStandardDetails:[],
  feedPlanningDetails:[],
  profileImage: null,
  
  selectedFarmCode: Number(localStorage.getItem("selectedFarmCode")) || null,
  setSelectedFarmCode: (farmCode) => {
    const numFarmCode = Number(farmCode); // ✅ บังคับเป็น number
    console.log("selectedFarmCode---->>>", numFarmCode);

    if (!numFarmCode) {
      console.warn(" Invalid farmCode received:", farmCode);
      return;
    }

    localStorage.setItem("selectedFarmCode", numFarmCode);
    set({ selectedFarmCode: numFarmCode });
  
    const setHouseCodes = useFarmStore.getState().setHouseCodes;
    setHouseCodes(farmCode); // 🆕 อัปเดต houseCodes ทันทีเมื่อเปลี่ยนฟาร์ม
  },
  selectedCropCode: null,
    setSelectedCropCode: (cropCode) => {
    const numCropCode  = Number(cropCode); // ✅ บังคับเป็น number
    console.log("CropCode จ้า---->>>>:", numCropCode );
    localStorage.setItem("selectedCropCode", numCropCode ); // optional
    set({ selectedCropCode: numCropCode });
  },
  FarmList: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
  
      const farms = await getDataFarm();
      set({ farms });
      console.log("farms--->",farms);

      const setHouseCodes = useFarmStore.getState().setHouseCodes;
      const selectedFarmCode = useFarmStore.getState().selectedFarmCode;
      set({ farms });
      if (selectedFarmCode) {
        setHouseCodes(selectedFarmCode);
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to fetch farms:", err);
      return { success: false, message: "Failed to fetch farms." };
    }
  },
  cropList: async (farmCode) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
  
      const response = await getCropList(farmCode); // ✅ ส่ง farmCode ไปยัง API function
      set({ croplist: response.data || [] });
  
      console.log("cropList--->", response.data);
      // console.log("cropCode--->", response.data?.);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to fetch cropList:", err);
      return { success: false, message: "Failed to fetch cropList." };
    }
  },
  setHouseCodes: (farmCode) => {
  const farms = useFarmStore.getState().farms;
  const selectedFarm = farms.find(farm => farm.FarmCode === farmCode);

  const houseCodes = selectedFarm?.House?.map(h => h.HouseCode) || [];
  set({ houseCodes });
},

    setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
  setProfileImage : (imgBase64) => {
    set({ profileImage: imgBase64});

  },

  loginUser: async (credentials) => {
    try {
      const response = await login(credentials); // ส่งทั้ง response object
      const { access_token, ...userData } = response;

      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      localStorage.setItem("token", access_token);

      set({ token: access_token, user: userData, isAuthenticated: true  }); // ✅ เก็บ user data ด้วย
      return { success: true };
    } catch (err) {
      console.log(err)
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  },
  logoutUser: () => {
    set({
      token: null,
      user: null,
    });
    localStorage.removeItem("token"); // ถ้าใช้ persist และเก็บ token/user
  },
  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({ token, isAuthenticated: true, isHydrated: true });
    } else {
      set({ token: null, isAuthenticated: false, isHydrated: true });
    }
  },
  
  // getProduction: async (farmCode, cropCode) => {
      //   try {
      //     const token = localStorage.getItem("token");
      //     if (!token) throw new Error("No token available");
      
      //     const response = await getProduction(farmCode, cropCode);
      
      //     if (response?.data && Array.isArray(response.data)) {
      //       set({ productionList: response.data });
      //       return { success: true, data: response.data };
      //     } else {
      //       set({ productionList: [] }); // 🧹 fallback ถ้าไม่มีข้อมูล
      //       console.warn("⚠️ No production data found for this farmCode + cropCode.");
      //       return { success: false, message: "No production data found." };
      //     }
      //   } catch (err) {
      //     console.error("❌ Failed to fetch productionList:", err);
      //     set({ productionList: [] }); // reset state in error case
      //     return { success: false, message: err.message || "Failed to fetch productionList." };
      //   }
      // },
  
  SettingProduction: async (farmCode) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      
      console.log("🚨 Calling getSettingProduction with farmCode:", farmCode);

      const response = await getSettingProduction(farmCode);
      set({ settingProduction: response.data || [] });
  
      // console.log("getProduction--->", response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to fetch settingProduction:", err);
      return { success: false, message: "Failed to fetch settingProduction." };
    }
  },
  getBreedStandardList: async (farmCode) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      
      console.log("🚨 Calling List Breed Standard with farmCode:", farmCode);
      const res = await getBreedStandardList(farmCode);
      console.log("🚨 Calling List Breed Standard with response:--->>>>>>", res);
      set ({ selectBreedStandard : res.data || [] });

      return { success: true, data: res.data}
    } catch (err) {
      console.error("Error Fail ti feth ListBreed Standard:", err, "farmcode------>>>",farmCode);
    return { success: false, message: err.message };
    }
  },
  getFeedPlanningList: async (farmCode) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      
      console.log("🚨 Calling List Feed Planning with farmCode:", farmCode);
      const res = await getfeedPlanningList(farmCode);
      set ({ selectPlanningList : res.data || [] });

      return { success: true, data: res.data}
    } catch (err) {
      console.error("Error Fail ti feth ListBreed Standard:", err, "farmcode------>>>",farmCode);
    return { success: false, message: err.message };
    }
  },
  getBreedStandardDetail: async (farmCode, breedStandard) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
  
      const res = await getBreedStandardDetails(farmCode, breedStandard);
      console.log("✅ BreedStandardDetails response:", res.data);
  
      set({ breedStandardDetails: res.data || [] });
  
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Error fetching breedStandardDetails:", err);
      return { success: false, message: err.message };
    }
  },
  getFeedPlanningDetail: async (farmCode, feedPlanning) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      
      console.log("🚨 Calling  FeedPlanning Details with farmCode:", farmCode);
      const res = await getFeedPlanningDetails(farmCode, feedPlanning);
      set ({ feedPlanningDetails : res.data || [] });

      return { success: true, data: res.data}
    } catch (err) {
      console.error("Error Fail feth FeedPlanningDetails:", err, ", FeedPlanningDetails------>>>", feedPlanning);
    return { success: false, message: err.message };
    }
  },
  startNewCrop: async (dateStartCrop) => {
    try {
      const { selectedFarmCode, cropList } = useFarmStore.getState();
      if (!selectedFarmCode) throw new Error("No selectedFarmCode");
  
      // ใช้ Day.js ในการจัดรูปแบบวันที่
      const formattedDate = dayjs(dateStartCrop).format("YYYY-MM-DD HH:mm:ss");
  
      const res = await startCrop(selectedFarmCode, formattedDate);
  
      if (res?.status === "400" && res?.message === "data not found !!") {
        return { success: true, data: [] };
      }
  
      await cropList(selectedFarmCode); // 🔄 โหลด crop list ใหม่
  
      return { success: true, data: res.data || [] };
    } catch (err) {
      console.error("Start crop failed:", err.response.data.message);
      const message =
      err?.response?.data?.message || err.message || "Unknown error";
    return { success: false, message };
    }
  },
  
  
  
  
});

const usePersist = {
  name: "smartfarm-store",
  storage: createJSONStorage(() => localStorage),
};

const useFarmStore = create(persist(SmartFarmStore, usePersist));

export default useFarmStore;

      