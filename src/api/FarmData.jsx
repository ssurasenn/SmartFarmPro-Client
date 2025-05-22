import axios from "axios";
import { BASE_URL } from "../utils/ApiConfig";
import dayjs from "dayjs";

export const getDataFarm = async () => {
  try {
    const token = localStorage.getItem("token"); // ดึง token ที่เก็บไว้ใน localStorage

    const response = await axios.get(
      // "https://smartfarmpro.com/v4/api/private/farmlist",
      `${BASE_URL}/api/private/farmlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("getDataFarm API Response:---->", response.data.data);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error in getDataFarm:", error);
    throw error;
  }
};
export const getCropList = async (farmCode) => {
  if (!farmCode) {
    console.warn("❌ farmCode is missing");
    return { success: true, data: [] };
  }

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/farmcroplist",
      `${BASE_URL}/api/private/farmcroplist`,
      { FarmCode: farmCode },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const cropData = response.data?.data;
    return {
      success: true,
      data: Array.isArray(cropData) ? cropData : [],
    };
  } catch (error) {
    console.warn("⚠️ getCropList Error:", error);

    if (
      error.response?.status === 400 &&
      error.response?.data?.message === "data not found !!"
    ) {
      return { success: true, data: [] }; // ✅ ส่ง array ว่างแทน
    }

    return {
      success: false,
      message: error.message,
    };
  }
};

export const getProduction = async (farmCode, cropCode) => {
  if (!farmCode) {
    throw new Error("FarmCode is required for getProduction");
  }

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/farmcropdetail",
      `${BASE_URL}/api/private/farmcropdetail`,
      {
        FarmCode: farmCode,
        CropCode: cropCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    console.error(" Error in getProduction:", error);
    return { success: false, message: error.message };
  }
};

export const getSettingProduction = async (farmCode) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/farmcrop",
      `${BASE_URL}/api/private/farmcrop`,
      {
        FarmCode: farmCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("🚨 Calling getSettingProduction with farmCode:", farmCode);

    // ถ้า API ตอบกลับมาว่าไม่พบข้อมูล
    if (
      res.data?.status === "400" &&
      res.data?.message === "data not found !!"
    ) {
      return { success: true, data: [] }; // ✅ คืนค่าข้อมูลว่าง
    }

    return { success: true, data: res.data?.data || [] };
  } catch (error) {
    console.error("POST ERROR:", error.response?.data || error.message);

    return { success: false, message: error.message };
  }
};

export const getBreedStandardList = async (farmCode) => {
  try {
    const token = localStorage.getItem("token"); // ดึง token ที่เก็บไว้ใน localStorage

    const res = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/farmbreedstandardlist",
      `${BASE_URL}/api/private/farmbreedstandardlist`,
      {
        FarmCode: farmCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("res  List BreedStandard ---->>>>" , res)
    // return  { success: true, data: res.data?.data || [] };
    return { success: true, data: res.data?.data || [] };
  } catch (error) {
    console.error(
      "Error in getBreedStandardList:",
      error,
      "farmcode------>>>",
      farmCode
    );
    return { success: false, message: error.message };
  }
};

export const getBreedStandardDetails = async (farmCode, breedStandard) => {
  try {
    const token = localStorage.getItem("token"); // ดึง token ที่เก็บไว้ใน localStorage

    const res = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/farmbreedstandarddetail",
      `${BASE_URL}/api/private/farmbreedstandarddetail`,
      {
        FarmCode: farmCode,
        BreedStandard: breedStandard,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("res  BreedStandardDetails ---->>>>", res);
    // return  { success: true, data: res.data?.data || [] };
    return { success: true, data: res.data?.data || [] };
  } catch (error) {
    console.error(
      "Error in BreedStandardDetails:",
      error,
      "BreedStandard------>>>",
      breedStandard
    );
    return { success: false, message: error.message };
  }
};

export const getfeedPlanningList = async (farmCode) => {
  try {
    const token = localStorage.getItem("token"); // ดึง token ที่เก็บไว้ใน localStorage

    const res = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/farmfeedplanninglist",
      `${BASE_URL}/api/private/farmfeedplanninglist`,
      {
        FarmCode: farmCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("res List FeedPlanning  ---->>>>", res);
    // return  { success: true, data: res.data?.data || [] };
    return { success: true, data: res.data?.data || [] };
  } catch (error) {
    // console.error("Error in settingProduction:", error, "farmcode------>>>",farmCode);
    return { success: false, message: error.message };
  }
};
export const getFeedPlanningDetails = async (farmCode, feedPlanning) => {
  try {
    const token = localStorage.getItem("token"); // ดึง token ที่เก็บไว้ใน localStorage

    const res = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/farmfeedplanningdetail",
      `${BASE_URL}/api/private/farmfeedplanningdetail`,
      {
        FarmCode: farmCode,
        FeedPlanning: feedPlanning,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("res  FeedPlanningDetails ---->>>>", res);
    // return  { success: true, data: res.data?.data || [] };
    return { success: true, data: res.data?.data || [] };
  } catch (error) {
    console.error(
      "Error in FeedPlanningDetails:",
      error,
      "FeedPlanning------>>>",
      feedPlanning
    );
    return { success: false, message: error.message };
  }
};

/// สมมติว่ามีการ เรียกใช้ api เพื่อจัดการกับการ start paused Crop ไปยังหลังบ้าน

export const updateCropStatus = async (farmCode, cropCode, statusCode) => {
  try {
    console.log("🟡 Sending updateCropStatus", {
      farmCode,
      cropCode,
      statusCode,
    });

    const token = localStorage.getItem("token");

    const res = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/settingeditcrop",
      `${BASE_URL}/api/private/settingeditcrop`,
      {
        FarmCode: farmCode,
        CropCode: cropCode,
        StatusCrop: statusCode, // ← status ที่คุณต้องการเปลี่ยน
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("updateCropStatus response:", res.data);

    return res.status === 200 || res.data?.status === "200";
  } catch (err) {
    console.error(
      "🔴 updateCropStatus error:",
      err.response?.data || err.message
    );
    return false;
  }
};

export const startCrop = async (farmCode, dateStartCrop) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    // "https://smartfarmpro.com/v4/api/private/settingnewcrop",
    `${BASE_URL}/api/private/settingnewcrop`,
    {
      FarmCode: farmCode,
      DateStart: dateStartCrop,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data; // 👈 ดิบ ๆ ให้ store ไปจัดการเอง
};

export const SettingEditFlock = async (flockArray, farmCode, cropCode) => {
  if (!farmCode || farmCode === 0) {
    console.error("❌ Invalid farmCode:", farmCode);
    return { success: false, message: "Invalid FarmCode" };
  }

  const token = localStorage.getItem("token");

  // const houseDetail = flockArray.map(item => ({
  //   HouseCode: item.HouseCode,
  //   FlockName: item.FlockName ?? "",
  //   DateStart: item.DateStart ? dayjs(item.DateStart).format("YYYY-MM-DD 00:00:00") : null,
  //   DateEnd: item.DateEnd ? dayjs(item.DateEnd).format("YYYY-MM-DD 00:00:00") : null,
  //   AgeOfStart: Number(item.AgeOfStart) || 0,
  //   FeedPlanning: item.FeedPlanning ?? "",
  //   FocusCatch: item.FocusCatch ?? 0,
  //   BreedStandard1: item.BreedStandard1 ?? "",
  //   Number1: Number(item.Number1) || 0,
  //   DateCatch: item.DateCatch ? dayjs(item.DateCatch).format("YYYY-MM-DD 00:00:00") : null,
  //   SlaughterhouseWeight: Number(item.SlaughterhouseWeight) || 0,
  // }));

  const houseDetail = flockArray.map((item) => ({
    HouseCode: item.HouseCode,
    FlockName: item.FlockName ?? "",
    DateStart: item.DateStart
      ? dayjs(item.DateStart).format("YYYY-MM-DD 00:00:00")
      : "2025-01-01 00:00:00",
    DateEnd: item.DateEnd
      ? dayjs(item.DateEnd).format("YYYY-MM-DD 00:00:00")
      : "",

    AgeOfStart: Number(item.AgeOfStart) || 0, // ไม่ใช้ 0
    FeedPlanning: item.FeedPlanning || "-",
    FocusCatch: item.FocusCatch ?? 1,
    BreedStandard1: item.BreedStandard1 || "",
    Number1: Number(item.Number1) || "",
    DateCatch: item.DateCatch
      ? dayjs(item.DateCatch).format("YYYY-MM-DD 00:00:00")
      : null,
    SlaughterhouseWeight: Number(item.SlaughterhouseWeight) || "",
  }));

  const payload = {
    FarmCode: farmCode,
    CropCode: cropCode,
    HouseDetail: houseDetail,
  };

  console.log("----->>>>>>> Sending to API SettingEditFlock ---->>>:", payload);
  // console.log(" ----->>>>>>> Using FarmCode:", farmCode, typeof farmCode);
  console.log("✅ Sending houseDetail:", houseDetail);

  try {
    const res = await axios.post(
      // "https://smartfarmpro.com/v4/api/private/settingeditflock",
      `${BASE_URL}/api/private/settingeditflocks`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      Array.isArray(res.data.result) &&
      res.data.result[0]?.status === "200"
    ) {
      return {
        success: true,
        message: res.data.message || "บันทึกสำเร็จ",
        result: res.data.result,
      };
    } else {
      return {
        success: false,
        message:
          res.data.result?.[0]?.message ||
          res.data.message ||
          "ไม่สามารถบันทึกข้อมูลได้",
      };
    }
  } catch (error) {
    console.error("❌ Error saving flock settings:", error);
    return {
      success: false,
      message: error.response?.data?.message || "เกิดข้อผิดพลาด",
      error,
    };
  }
};
