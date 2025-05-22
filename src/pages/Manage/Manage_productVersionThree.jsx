import React, { useEffect, useMemo, useState } from "react";
import useFarmStore from "../../store/smartfarm-store";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  getDataFarm,
  SettingEditFlock,
  updateCropStatus,
} from "../../api/FarmData";
import { FaEdit } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { MdOutlineSaveAlt } from "react-icons/md";

import ConfirmModal from "../../components/ConfirmModal";
import isEqual from "lodash.isequal";

// ภายใน Manage_productVersionThree.jsx

const Manage_productVersionThree = () => {
  const { t } = useTranslation();
  const [farmProductions, setFarmProductions] = useState([]);
  const activeProduction = useMemo(() => {
    return farmProductions?.find(
      (p) => p.StatusCrop === 1 || p.StatusCrop === 2
    );
  }, [farmProductions]);
  const [startDate, setStartDate] = useState(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [editableData, setEditableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedProductionId, setExpandedProductionId] = useState(null);
  const [changedRows, setChangedRows] = useState([]);

  const [isCurrentExpanded, setIsCurrentExpanded] = useState(true);
  const [initialData, setInitialData] = useState([]);
  const [houseList, setHouseList] = useState([]);
  const [allFarms, setAllFarms] = useState([]);
  // ตัวจัดการปุ่ม production อิงตาม statusCode 0, 1, 2  history in process paused
  const [productionStatus, setProductionStatus] = useState("none");

  // ตัวจัดการ modal สำหรับการจะ  'pause' | 'end'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'pause' | 'end'

  const fetchFarmProductions = useFarmStore((state) => state.SettingProduction);
  const selectedFarmCode = useFarmStore((state) => state.selectedFarmCode);
  const selectedCropCode = useFarmStore((state) => state.selectedCropCode);

  const breedStandardOptions = useFarmStore(
    (state) => state.selectBreedStandard
  );
  const feedPlanningOptions = useFarmStore((state) => state.selectPlanningList);
  const getBreedStandardList = useFarmStore(
    (state) => state.getBreedStandardList
  );
  const getFeedPlanningList = useFarmStore(
    (state) => state.getFeedPlanningList
  );
  const startNewCrop = useFarmStore((state) => state.startNewCrop);

  const selectedProduction = farmProductions.find(
    (p) => p.CropCode === selectedCropCode
  );
  const setSelectedCropCode = useFarmStore(
    (state) => state.setSelectedCropCode
  );
  const tableRefs = useRef({});
  const activeProductionRef = useRef(null);

  const productionHistory = farmProductions
    ?.filter((p) => p.StatusCrop === 0)
    .reverse();

  const datePickerRef = useRef(null);
  const modalRef = useRef(null);

  const handleEditChange = (index, field, value) => {
    setEditableData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };

      const { BreedStandard1, DateStart, AgeOfStart, DateEnd } = newData[index];

      // คำนวณ DateEnd หากมีการเปลี่ยน BreedStandard1, DateStart, หรือ AgeOfStart
      if (
        ["BreedStandard1", "DateStart", "AgeOfStart"].includes(field) &&
        BreedStandard1 &&
        DateStart &&
        AgeOfStart !== null
      ) {
        const breed = breedStandardOptions.find(
          (b) =>
            b.BreedStandard.trim().toLowerCase() ===
            BreedStandard1.trim().toLowerCase()
        );

        if (breed) {
          const maxDay = Number(breed.MaxDay);
          const age = Number(AgeOfStart);
          const daysToAdd = maxDay - age;

          if (!isNaN(daysToAdd) && daysToAdd >= 0) {
            const dateEnd = dayjs(DateStart)
              .add(daysToAdd, "day")
              .format("YYYY-MM-DD");
            newData[index].DateEnd = dateEnd;
          }
        }
      }

      // ตรวจสอบ DateCatch ว่าอยู่ระหว่าง DateStart และ DateEnd หรือไม่
      if (field === "DateCatch") {
        if (DateStart && DateEnd) {
          const start = dayjs(DateStart);
          const end = dayjs(DateEnd);
          const catchDate = dayjs(value);

          if (!catchDate.isAfter(start)) {
            toast.error(
              t("settingProduction.toast.must_be_greater_than_start")
            );
            return prev;
          }

          if (!catchDate.isBefore(end)) {
            toast.error(t("settingProduction.toast.must_be_less_than_the_end"));
            return prev;
          }
        }
      }

      return newData;
    });
    // บันทึก index ที่มีการแก้ไขไว้ (ไฮไลต์สีน้ำเงิน)
    setChangedRows((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleSave = async () => {
    if (!Array.isArray(editableData) || editableData.length === 0) {
      toast.error(t("settingProduction.toast.nodata_description"));
      setModalAction(null);
      setShowConfirmModal(true);
      return;
    }

    // เช็คว่าข้อมูลแถวไหนเปลี่ยนจากค่าเริ่มต้น
    const changedRows = editableData.filter((row, index) => {
      const initialRow = initialData?.[index];
      const isDifferent = !isEqual(row, initialRow);
      console.log(`Row ${index} changed:`, isDifferent);
      return isDifferent; // ส่งเฉพาะที่ต่าง
    });

    if (changedRows.length === 0) {
      toast.info(t("settingProduction.toast.no_changes_detected"));
      return;
    }

    const result = await SettingEditFlock(
      changedRows,
      selectedFarmCode,
      selectedCropCode
    );

    if (result.success) {
      toast.success(t("settingProduction.toast.saved"));
      setIsEditing(false);
      setInitialData([...editableData]); // อัปเดต initialData ใหม่หลังบันทึก
      setChangedRows([]); // 🔁 รีเซ็ตไฮไลต์

      // โหลดข้อมูลใหม่หลัง save
      await new Promise((resolve) => setTimeout(resolve, 400)); // เล็กน้อยให้ backend บันทึกเสร็จ

      const refreshed = await fetchFarmProductions(selectedFarmCode);
      const data = Array.isArray(refreshed.data) ? refreshed.data : [];
      setFarmProductions(data);

      // ดึง crop ที่กำลัง active อยู่ (StatusCrop === 1)
      const activeCrop = data.find((p) => p.StatusCrop === 1);
      if (activeCrop) {
        setSelectedCropCode(activeCrop.CropCode);
      }
    } else {
      toast.error(t("settingProduction.toast.errorinrecording"));
    }
  };

  const handleToggleEdit = (editMode) => {
    if (editMode) {
      // เข้าสู่โหมดแก้ไข: บันทึก initialData ปัจจุบันเพื่อใช้ตรวจสอบการเปลี่ยนแปลง
      setInitialData(JSON.parse(JSON.stringify(editableData))); // ✅ deep copy
    } else {
      // ยกเลิกการแก้ไข: คืนค่าจาก initialData กลับมา
      setEditableData(JSON.parse(JSON.stringify(initialData)));
      setChangedRows([]);
    }
    setIsEditing(editMode);
  };

  const handleStartCropClick = () => {
    toast.warning(
      t("settingProduction.toast.Please_select_the_crop_start_date")
    );
    setIsDatePickerOpen((prev) => !prev);
  };

  const handleStartCrop = async () => {
    if (!startDate) {
      toast.error(
        t("settingProduction.toast.Please_select_the_crop_start_date")
      );
      return;
    }
    try {
      const result = await startNewCrop(startDate);
      if (result.success) {
        setIsDatePickerOpen(false);
        toast.success(t("settingProduction.toast.startCrop"));

        // ✅ โหลดข้อมูลใหม่หลังเริ่ม crop
        await new Promise((resolve) => setTimeout(resolve, 400));

        const refreshed = await fetchFarmProductions(selectedFarmCode);
        const data = Array.isArray(refreshed.data) ? refreshed.data : [];
        setFarmProductions(data);

        // ✅ ดึง cropCode ที่เพิ่ง start
        const newStartedCrop = data.find((p) => p.StatusCrop === 1);
        if (newStartedCrop) {
          // await fetchCropList(selectedFarmCode); // 👈 โหลด crop ใหม่

          setSelectedCropCode(newStartedCrop.CropCode); // <-- เลือก crop ใหม่ใน sidebar
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log("error---->>> ", error);
      toast.error(t("settingProduction.toast.startProductionerror"));
    }
  };

  const handlePauseCrop = async () => {
    const success = await updateCropStatus(
      selectedFarmCode,
      selectedCropCode,
      2
    ); // 2 = paused
    if (success) {
      toast.warning(t("settingProduction.toast.paused"));

      await new Promise((resolve) => setTimeout(resolve, 400));
      console.log(
        " เรียก fetchFarmProductions (store) ด้วย farmCode:",
        selectedFarmCode
      );

      const refreshed = await fetchFarmProductions(selectedFarmCode);
      const data = Array.isArray(refreshed.data) ? refreshed.data : [];
      console.log(
        "Refreshed data after update handlePauseCrop:",
        refreshed.data
      );
      setFarmProductions(data); // 👈 อัปเดต state เพื่อให้ UI แสดงข้อมูลใหม่
    }
  };

  const handleContinueCrop = async () => {
    const success = await updateCropStatus(
      selectedFarmCode,
      selectedCropCode,
      1
    ); // 1 = active
    if (success) {
      toast.success(t("settingProduction.toast.continueCrop"));
      await new Promise((resolve) => setTimeout(resolve, 500));
      const refreshed = await fetchFarmProductions(selectedFarmCode);
      const data = Array.isArray(refreshed.data) ? refreshed.data : [];
      console.log(
        "Refreshed data after update handleContinueCrop:",
        refreshed.data
      );
      setFarmProductions(data);
    }
  };
  const handleEndCrop = async () => {
    const success = await updateCropStatus(
      selectedFarmCode,
      selectedCropCode,
      0
    ); // 3 = ended? (คุณอาจต้องเช็คว่า backend ใช้อะไรสำหรับ "สิ้นสุด")
    if (success) {
      toast.error(t("settingProduction.toast.endCrop"));

      setSelectedCropCode(null); // ✅ reset crop ที่เลือก

      await new Promise((resolve) => setTimeout(resolve, 500));
      const refreshed = await fetchFarmProductions(selectedFarmCode);
      const data = Array.isArray(refreshed.data) ? refreshed.data : [];

      console.log("Refreshed data after update handleEndCrop:", refreshed.data);

      setFarmProductions(data);
    }
  };
  /// ฟังก์ชั่น confirm การ pause หรือ จบ crop
  const handleConfirmAction = async () => {
    if (modalAction === "pause") {
      await handlePauseCrop();
    } else if (modalAction === "end") {
      await handleEndCrop();
    }
    setShowConfirmModal(false);
  };
  const toggleProductionDetail = (id) => {
    setExpandedProductionId(expandedProductionId === id ? null : id);
  };

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const generateFlockName = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // เพิ่ม 1 เพราะ getMonth() เริ่มที่ 0
    return `${year}-${month}`;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const result = await getDataFarm(); // fetchFarms
        const allFarms = Array.isArray(result.data) ? result.data : [];
        setAllFarms(allFarms);

        const selectedFarm = allFarms.find(
          (f) => f.FarmCode === selectedFarmCode
        );
        const houses = selectedFarm?.House || [];
        setHouseList(houses);

        // ต้องรอ houseList พร้อมก่อนค่อย fetchData
        const resultProd = await fetchFarmProductions(selectedFarmCode);
        const data = Array.isArray(resultProd.data) ? resultProd.data : [];

        setFarmProductions(data);

        const current = data.find(
          (p) => p.StatusCrop === 1 || p.StatusCrop === 2
        );
        const FlockName = generateFlockName();

        if (current?.CropDetail?.length > 0) {
          const sorted = current.CropDetail.slice().sort(
            (a, b) => a.HouseCode - b.HouseCode
          );
          setEditableData(sorted);
          console.log("current.CropDetail---->>", sorted);
          setInitialData(sorted);
          // setEditableData(current.CropDetail);
          // console.log("current.CropDetail---->>", current.CropDetail);
          // setInitialData(current.CropDetail);
        } else if (!current && houses.length > 0) {
          const newData = houses.map((h) => ({
            HouseCode: h.HouseCode,
            HouseName: h.HouseName,
            FlockName: FlockName,
            DateStart: "",
            DateEnd: "",
            AgeOfStart: "", // ✅ ต้องมี
            FeedPlanning: "", // ✅ ต้องมี
            FocusCatch: 0, // ✅ ต้องมี
            BreedStandard1: "",
            Number1: "",
            DateCatch: "",
            SlaughterhouseWeight: "",
          }));
          const sortedNew = newData
            .slice()
            .sort((a, b) => a.HouseCode - b.HouseCode);
          setEditableData(sortedNew);
          setInitialData(sortedNew);
          // setEditableData(newData);
          // setInitialData(newData);
        }

        await getBreedStandardList(selectedFarmCode);
        await getFeedPlanningList(selectedFarmCode);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูลฟาร์ม");
      }
    };

    if (selectedFarmCode) fetchAll();
  }, [selectedFarmCode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowConfirmModal(false);
      }
    };
    const handleClickOutsideDatePicker = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideDatePicker);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideDatePicker);
    };
  }, []);
  // ตัวจัดการ Production ปุ่ม crop
  useEffect(() => {
    console.log("farmProductions check --->", farmProductions);
    const active = farmProductions.find(
      (p) => p.StatusCrop === 1 || p.StatusCrop === 2
    );

    // console.log("ActiveProduction --->", active);
    setProductionStatus(
      !active
        ? "none"
        : active.StatusCrop === 1
        ? "active"
        : active.StatusCrop === 2
        ? "paused"
        : "none"
    );
  }, [farmProductions]);

  useEffect(() => {
    if (!selectedCropCode || !farmProductions.length) return;

    const scrollToCrop = () => {
      const active = farmProductions.find((p) => p.StatusCrop === 1);
      if (active && active.CropCode === selectedCropCode) {
        activeProductionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        const selectedRef = tableRefs.current[selectedCropCode];
        selectedRef?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    setExpandedProductionId(selectedCropCode);
    setTimeout(scrollToCrop, 200);
  }, [selectedCropCode, farmProductions]);

  useEffect(() => {
    if (activeProduction?.StartCrop) {
      setStartDate(activeProduction.StartCrop);
      setIsCurrentExpanded(true);
    }
  }, [activeProduction]);

  useEffect(() => {
    if (
      isEditing &&
      activeProduction?.CropDetail &&
      editableData.length === 0
    ) {
      setEditableData([...activeProduction.CropDetail]); // clone
    }
  }, [isEditing, activeProduction, editableData.length]);

  useEffect(() => {
    const FlockName = generateFlockName();
    if (activeProduction && activeProduction.CropDetail?.length === 0) {
      setEditableData(
        houseList.map((house) => ({
          HouseCode: house.HouseCode,
          HouseName: house.HouseName,
          FlockName: FlockName,
          DateStart: "",
          DateEnd: "",
          AgeOfStart: "", // ✅ ต้องมี
          FeedPlanning: "", // ✅ ต้องมี
          FocusCatch: 0, // ✅ ต้องมี
          BreedStandard1: "",
          Number1: "",
          DateCatch: "",
          SlaughterhouseWeight: "",
        }))
      );
      setIsEditing(true); // เข้าสู่โหมดสร้างใหม่
    }
  }, [activeProduction, houseList]);

  return (
    <div className="lg:px-4 lg:py-2">
      {/* Title */}
      <h1 className="text-md md:text-xl font-bold text-gray-800 dark:text-white ">
        {t("settingProduction.title")}
      </h1>

      {/* Production Controls */}
      <div className="flex items-center justify-between mb-2 px-3 ">
        <h1 className="text-sm md:text-base font-semibold text-gray-600 dark:text-white">
          {t("settingProduction.manageProduction")}
        </h1>

        <div className="flex gap-2">
          {selectedProduction?.StatusCrop === 1 && (
            <button
              onClick={() => {
                setModalAction("pause");
                setShowConfirmModal(true);
              }}
              className="text-xs lg:text-base bg-amber-300 hover:bg-amber-400 px-2 py-1  rounded-xl shadow cursor-pointer text-white font-semibold"
            >
              {t("settingProduction.pauseCrop")}
            </button>
          )}

          {selectedProduction?.StatusCrop === 2 && (
            <>
              <button
                onClick={handleContinueCrop}
                className="text-xs lg:text-base bg-blue-400 hover:bg-blue-500 px-2 py-1  rounded-xl shadow cursor-pointer text-white font-semibold"
              >
                {t("settingProduction.continueCrop")}
              </button>
              <button
                onClick={() => {
                  setModalAction("end");
                  setShowConfirmModal(true);
                }}
                className="text-xs lg:text-base bg-red-500 hover:bg-red-600 px-2 py-1  rounded-xl shadow cursor-pointer text-white font-semibold"
              >
                {t("settingProduction.endCrop")}
              </button>
            </>
          )}
          <ConfirmModal
            show={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirmAction}
            action={modalAction}
            title={
              modalAction === "pause"
                ? t("settingProduction.confirm_title")
                : t("settingProduction.confirm_title")
            }
            description={
              modalAction === "pause"
                ? t("settingProduction.confirmPauseText")
                : t("settingProduction.confirmEndText")
            }
            confirmText={t("settingProduction.confirm")}
            cancelText={t("settingProduction.cancel")}
          />

          {/* Start button เฉพาะ current crop ที่ยังไม่เริ่ม (แต่ยังอยู่ในปัจจุบัน) */}
          {(!selectedProduction || selectedProduction.StatusCrop === 0) && (
            <div className="relative inline-block text-center">
              <button
                onClick={handleStartCropClick}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition duration-200 text-sm md:text-md"
              >
                <FaStar /> {t("settingProduction.startCrop")}
              </button>

              {isDatePickerOpen && (
                <div
                  ref={datePickerRef}
                  className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 z-50 animate-fade-in"
                >
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    {t(
                      "settingProduction.toast.Please_select_the_crop_start_date"
                    )}
                  </h3>

                  <div className="rounded-lg overflow-hidden">
                    <DatePicker
                      selected={startDate}
                      onSelect={(date) => setStartDate(date)}
                      inline
                      calendarClassName="!bg-white dark:!bg-gray-700 !text-gray-800 dark:!text-white"
                      dayClassName={(date) =>
                        "hover:bg-emerald-100 dark:hover:bg-emerald-600 transition duration-150"
                      }
                      shouldCloseOnSelect={false}
                    />
                  </div>

                  <button
                    onClick={handleStartCrop}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-200 text-sm"
                  >
                    ✅ {t("settingProduction.Confirm_production_start")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Current Production */}
      {activeProduction && (
        <div
          ref={activeProductionRef}
          className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow my-4"
        >
          <div
            onClick={() => setIsCurrentExpanded((prev) => !prev)}
            className={`flex justify-between items-center px-1 py-2 sm:p-3 md:p-4 lg:px-6 bg-gray-100 dark:bg-gray-700 cursor-pointer ${
              isCurrentExpanded ? "bg-[#A1C8FE] dark:bg-[#1DCD9F]" : ""
            }`}
          >
            <div className="font-bold text-gray-700 dark:text-white">
              <div className="flex items-center gap-1 md:gap-5 lg:gap-20">
                <h2 className="text-xs md:text-md">
                  {t("settingProduction.current.mainCrop")}:{" "}
                  {activeProduction?.MainCrop}
                </h2>
                <div className="flex flex-col lg:flex-row text-[10px] lg:text-xs text-gray-400 font-medium ">
                  <span className="text-[10px] lg:text-xs">
                    {t("settingProduction.current.start")}:{" "}
                    {formatDateOnly(startDate || activeProduction?.StartCrop)}
                  </span>
                  <span className="text-[10px] lg:text-xs lg:ml-5 mx-auto">
                    {t("settingProduction.current.end")}:{" "}
                    {formatDateOnly(activeProduction?.EndCrop)}
                  </span>
                </div>
              </div>
            </div>

            <div className="">
              <span className="md:mr-3 text-[10px] lg:text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-400">
                {t("settingProduction.current.status.inProcess")}
              </span>
              <span className="">{isCurrentExpanded ? "🔽" : "▶️"}</span>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isCurrentExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-3 bg-white dark:bg-gray-800">
                  <CropTable
                    title={`${t("settingProduction.main_crop_details")} : ${
                      activeProduction?.MainCrop || "-"
                    }`}
                    crop={activeProduction}
                    activeProduction={activeProduction}
                    isEditable={
                      activeProduction?.StatusCrop === 1 ||
                      activeProduction?.StatusCrop === 2
                    }
                    editableData={editableData}
                    isEditing={isEditing}
                    onEditChange={handleEditChange}
                    onSave={handleSave}
                    onToggleEdit={handleToggleEdit}
                    breedStandardOptions={breedStandardOptions}
                    feedPlanningOptions={feedPlanningOptions}
                    // handleGenerateCropDetail={handleGenerateCropDetail}
                    generateFlockName={generateFlockName}
                    changedRows={changedRows}
                    setChangedRows={setChangedRows}
                    initialData={initialData}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <hr className="text-gray-300" />

      {/* History */}
      <h1 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white mt-3 md:mt-10">
        {t("settingProduction.historyTitle")}
      </h1>
      {productionHistory.length === 0 ? (
        <p className="text-center text-gray-400 mt-4">
          {t("settingProduction.noHistory")}
        </p>
      ) : (
        productionHistory.map((p) => (
          <div
            ref={(el) => (tableRefs.current[p.CropCode] = el)}
            key={p.CropCode}
            className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow my-3"
          >
            <div
              onClick={() => toggleProductionDetail(p.CropCode)}
              className={`flex justify-between items-center px-1 py-2 sm:p-3 md:p-4 lg:px-6 bg-gray-100 dark:bg-gray-700 cursor-pointer ${
                expandedProductionId === p.CropCode
                  ? "bg-[#A1C8FE] dark:bg-[#1DCD9F]"
                  : ""
              }`}
            >
              <div className="font-bold text-gray-700 dark:text-white">
                <div className="flex items-center gap-5">
                  <h2 className="text-xs md:text-md">
                    {t("settingProduction.current.mainCrop")}: {p.MainCrop}
                  </h2>
                  <div className="flex flex-col lg:flex-row text-[10px] lg:text-xs text-gray-400 font-medium ">
                    <span className="text-[10px] lg:text-xs">
                      {t("settingProduction.current.start")}:{" "}
                      {formatDateOnly(p.StartCrop)}
                    </span>
                    <span className="text-[10px] lg:text-xs lg:ml-5 ">
                      {t("settingProduction.current.end")}:{" "}
                      {formatDateOnly(p.EndCrop)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className=" md:mr-3 text-[10px] lg:text-xs px-2 py-1 rounded-full bg-gray-300 text-gray-700 border border-gray-400">
                  {t("settingProduction.current.status.completed")}
                </span>
                <span className=" transition-all duration-300">
                  {expandedProductionId === p.CropCode ? "🔽" : "▶️"}
                </span>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {expandedProductionId === p.CropCode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <CropTable
                      title={`Main Crop Details : ${p.MainCrop}`}
                      crop={p}
                      breedStandardOptions={breedStandardOptions}
                      feedPlanningOptions={feedPlanningOptions}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}
    </div>
  );
};

export default Manage_productVersionThree;

// ------------------ CropTable Component ------------------ //

const CropTable = ({
  title,
  editableData = [],
  isEditing = false,
  onEditChange,
  onSave,
  onToggleEdit,
  breedStandardOptions = [],
  feedPlanningOptions = [],
  crop,
  activeProduction,
  // handleGenerateCropDetail,
  generateFlockName,
  initialData,
}) => {
  const { t } = useTranslation();
  if (!crop) return null;
  const isEditable = crop.StatusCrop === 1 || crop.StatusCrop === 2;

  const [editingRows, setEditingRows] = useState([]); // สำหรับติดตามแถวที่กำลังแก้ไข
  const isCellChanged = (index, field) => {
    const initial = initialData?.[index]?.[field];
    const current = editableData?.[index]?.[field];
    return initial !== current;
  };

  useEffect(() => {
    if (isEditing) {
      setEditingRows(editableData.map((_, index) => index)); // แก้ไขได้ทุกแถว
    } else {
      setEditingRows([]); // ปิดโหมดแก้ไข
    }
  }, [isEditing, editableData]);
  const handleDateChange = (index, date) => {
    const startDate = dayjs(date).format("YYYY-MM-DD");
    const endCrop = dayjs(date).add(56, "day").format("YYYY-MM-DD");

    onEditChange(index, "DateStart", startDate); // เปลี่ยนชื่อ field ให้ตรง backend
    onEditChange(index, "EndCrop", endCrop);
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";
    const date = dayjs(dateString);
    return date.isValid() ? date.format("DD-MM-YYYY") : "-";
  };

  return (
    <div className="mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-2 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs md:text-sm text-left font-semibold dark:text-white">
          {title}
        </h2>

        {isEditable && (
          <>
            {editableData.length > 0 && !isEditing && (
              <button
                onClick={() => onToggleEdit(true)}
                className="flex items-center gap-1 text-xs md:text-md bg-[#5F99AE] hover:bg-[#336D82] px-3 py-1 rounded-xl shadow text-white font-semibold"
              >
                <FaEdit />
                {t("settingProduction.edit")}
              </button>
            )}

            {isEditing && (
              <button
                onClick={() => onToggleEdit(false)}
                className="text-xs md:text-md bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-xl shadow text-black font-semibold"
              >
                🔙 {t("settingProduction.cancel")}
              </button>
            )}
          </>
        )}
      </div>

      <div className="overflow-auto rounded-xl">
        <table className="min-w-full table-auto shadow-md">
          <thead>
            <tr className="bg-[#A1C8FE] dark:bg-gray-700 text-gray-800 dark:text-white ">
              {[
                // isEditing ? "Action" : null, // คอลัมน์ Action จะปรากฏเฉพาะเมื่อ isEditing เป็น true
                t("settingProduction.cropTable.house"),
                t("settingProduction.cropTable.flock"),
                t("settingProduction.cropTable.feed_planning"),
                t("settingProduction.cropTable.breed_standard"),
                t("settingProduction.cropTable.unit"),
                t("settingProduction.cropTable.start_date"),
                t("settingProduction.cropTable.age_start"),
                t("settingProduction.cropTable.date_end"),
                t("settingProduction.cropTable.focus_catch"),
                t("settingProduction.cropTable.slaughterhouse_weight"),
                t("settingProduction.cropTable.catching_date"),
              ]
                // .filter(Boolean) // กรองคอลัมน์ที่เป็น null (เมื่อ isEditing เป็น false)
                .map((header, idx) => (
                  <th
                    key={idx}
                    className="border border-gray-200 dark:border-gray-500 text-xs  whitespace-nowrap p-2 text-center "
                  >
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {(isEditing
              ? [...editableData].sort((a, b) => a.HouseCode - b.HouseCode)
              : [...(crop?.CropDetail ?? [])].sort(
                  (a, b) => a.HouseCode - b.HouseCode
                )
            ).map((detail, index) => {
              const rowHasChanged =
                isEditing &&
                initialData?.[index] &&
                !isEqual(editableData[index], initialData[index]);
              const rowChangedStyle = rowHasChanged
                ? "bg-[#F4EDD3] border-1 border-[#A5BFCC] dark:bg-[#948979] dark:border-[#423F3E]"
                : "";

              return (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap text-[10px] md:text-xs lg:text-sm ${rowChangedStyle}`}
                >
                  {renderCell(
                    detail,
                    index,
                    isEditing,
                    onEditChange,
                    feedPlanningOptions,
                    breedStandardOptions,
                    formatDateOnly,
                    handleDateChange,
                    crop,
                    t,
                    generateFlockName,
                    editingRows,
                    setEditingRows,
                    isCellChanged
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* {isEditable && isEditing && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSave}
            className="flex items-center gap-1 px-2 py-1 bg-[#A1C8FE] hover:bg-[#82A9F4] dark:bg-[#1DCD9F] text-white text-sm md:text-base rounded-xl shadow dark:hover:bg-[#169976] cursor-pointer"
          >
            <MdOutlineSaveAlt />
            {t("settingProduction.save_changes")}
          </button>
        </div>
      )} */}
      {isEditable && isEditing && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              const emptyWeightRows = editableData.filter(
                (row) =>
                  row.SlaughterhouseWeight === "" ||
                  row.SlaughterhouseWeight === null ||
                  row.SlaughterhouseWeight === undefined
              );

              if (emptyWeightRows.length > 0) {
                const houseNames = emptyWeightRows
                  .map((row) => row.HouseName)
                  .join(", ");
                toast.error(`${t("settingProduction.toast.fill_weight")} ${houseNames}`);

                return;
              }

              onSave();
            }}
            className="flex items-center gap-1 px-2 py-1 bg-[#A1C8FE] hover:bg-[#82A9F4] dark:bg-[#1DCD9F] text-white text-sm md:text-base rounded-xl shadow dark:hover:bg-[#169976] cursor-pointer"
          >
            <MdOutlineSaveAlt />
            {t("settingProduction.save_changes")}
          </button>
        </div>
      )}
    </div>
  );
};

const renderCell = (
  detail,
  index,
  isEditing,
  onEditChange,
  feedOptions,
  breedOptions,
  formatDateOnly,
  handleDateChange,
  crop,
  t,
  generateFlockName,
  editingRows,
  setEditingRows,
  isCellChanged
) => {
  const fields = [
    { key: "HouseName" }, // สำหรับแสดงเฉย ๆ
    { key: "FlockName" },
    { key: "FeedPlanning" },
    { key: "BreedStandard1" },
    { key: "Number1" },
    { key: "DateStart" },
    { key: "AgeOfStart" },
    { key: "DateEnd" },
    { key: "FocusCatch" },
    { key: "SlaughterhouseWeight" },
    { key: "DateCatch" },
  ];

  // เลือกว่าผู้ใช้เลือกค่าไหนจาก FocusCatch
  const isSlaughterhouseSelected = detail.FocusCatch === 1;
  const isCatchDateSelected = detail.FocusCatch === 0;
  const isRowEditing = editingRows.includes(index);

  return fields.map(({ key }, idx) => {
    return (
      <td
        key={idx}
        className="border border-gray-200 dark:border-gray-500 text-[10px] md:text-xs text-gray-600 dark:text-gray-300 px-2 py-1 " //${changedStyle}
      >
        {isRowEditing ? (
          key === "HouseName" ? (
            <div className="w-full min-w-[75px] max-w-[120px] bg-gray-300 dark:bg-white text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md text-center">
              {detail[key] ?? "-"}
            </div>
          ) : key === "FeedPlanning" ? (
            <select
              value={detail[key] ?? ""}
              onChange={(e) => onEditChange(index, key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#A1C8FE] focus:border-[#A1C8FE] 
             dark:focus:ring-[#948979] dark:focus:border-[#948979] "
            >
              <option value="">{t("settingProduction.select_feed")}</option>
              {feedOptions.map((item, index) => (
                <option key={index} value={item.FeedPlanning}>
                  {" "}
                  {/* ใช้ FeedPlanning เป็น value */}
                  {item.FeedPlanning}
                </option>
              ))}
            </select>
          ) : key === "BreedStandard1" ? (
            <select
              value={detail[key] ?? ""}
              onChange={(e) => onEditChange(index, key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#A1C8FE] focus:border-[#A1C8FE] 
             dark:focus:ring-[#948979] dark:focus:border-[#948979] "
            >
              <option value="">{t("settingProduction.select_breed")}</option>
              {breedOptions.map((item, index) => (
                <option key={index} value={item.BreedStandard}>
                  {" "}
                  {/* ใช้ BreedStandard เป็น value */}
                  {item.BreedStandard}
                </option>
              ))}
            </select>
          ) : key === "DateStart" ? (
            <DatePicker
              selected={detail[key] ? dayjs(detail[key]).toDate() : null}
              onChange={(date) => handleDateChange(index, date)} // ใช้ handleDateChange เพื่อคำนวณ DateEnd ด้วย
              dateFormat="dd-MM-yyyy"
              className="w-full border border-gray-300 rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#A1C8FE] focus:border-[#A1C8FE] 
             dark:focus:ring-[#948979] dark:focus:border-[#948979] "
              placeholderText="Select date"
              minDate={new Date(crop.StartCrop)} //  ป้องกันไม่ให้เลือกวันที่ก่อนวัน StartCrop
            />
          ) : key === "DateEnd" ? (
            <DatePicker
              selected={detail[key] ? dayjs(detail[key]).toDate() : null}
              onChange={(date) => handleDateChange(index, date)} // ใช้ handleDateChange เพื่อคำนวณ DateEnd ด้วย
              dateFormat="dd-MM-yyyy"
              className="w-full border border-gray-300 bg-gray-300 dark:bg-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#A1C8FE] focus:border-[#A1C8FE] 
             dark:focus:ring-[#948979] dark:focus:border-[#948979] "
              placeholderText="Select date"
              minDate={new Date(crop.StartCrop)} //  ป้องกันไม่ให้เลือกวันที่ก่อนวัน StartCrop
              disabled
            />
          ) : key === "SlaughterhouseWeight" ? (
            <>
              {/* ถ้าเลือก FocusCatch เป็น SlaughterhouseWeight จะให้กรอกค่าได้ */}
              <input
                type="number"
                value={detail[key] ?? ""}
                onChange={(e) => {
                  const inputValue = parseFloat(e.target.value);
                  const breed = breedOptions.find(
                    (b) =>
                      b.BreedStandard.trim().toLowerCase() ===
                      detail.BreedStandard1?.trim().toLowerCase()
                  );
                  const maxWeight = parseFloat(
                    breed?.MaxBodyWeight ?? Infinity
                  );

                  if (isNaN(inputValue)) {
                    onEditChange(index, key, "");
                  } else if (inputValue <= maxWeight) {
                    onEditChange(index, key, inputValue);
                  } else {
                    toast.error(
                      t("settingProduction.toast.max_weight", {
                        max: maxWeight,
                      })
                    );
                  }
                }}
                className={`w-full min-w-[120px] max-w-[200px] border border-gray-300 rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#A1C8FE] focus:border-[#A1C8FE] 
             dark:focus:ring-[#948979] dark:focus:border-[#948979] 
                ${
                  !isSlaughterhouseSelected
                    ? "bg-gray-200 text-gray-400 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-500 dark:text-white"
                }`}
                // disabled={!isSlaughterhouseSelected}
                placeholder={
                  isSlaughterhouseSelected ? "Enter weight" : "Disabled"
                }
              />
            </>
          ) : key === "DateCatch" ? (
            <>
              {/* ถ้าเลือก FocusCatch เป็น DateCatch จะให้กรอกค่าได้ */}
              <DatePicker
                selected={detail[key] ? new Date(detail[key]) : null}
                onChange={(date) =>
                  onEditChange(index, key, date?.toISOString().split("T")[0])
                }
                dateFormat="dd-MM-yyyy"
                className={`w-full border border-gray-300 rounded-md px-2 py-1 cursor-pointer 
                  focus:outline-none focus:ring-1 focus:ring-[#A1C8FE] focus:border-[#A1C8FE] 
             dark:focus:ring-[#948979] dark:focus:border-[#948979] 
                ${
                  !isCatchDateSelected
                    ? "bg-gray-200 text-gray-400  dark:bg-gray-800"
                    : "bg-white  dark:bg-gray-500 dark:text-white"
                }`}
                // disabled={!isCatchDateSelected} // ถ้าไม่เลือกจะบล็อคการกรอก
                placeholder={isCatchDateSelected ? "Select date" : "Disabled"}
              />
            </>
          ) : key === "FocusCatch" ? (
            <>
              {/* Checkbox สำหรับ FocusCatch */}
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={isSlaughterhouseSelected}
                  onChange={() => onEditChange(index, key, 1)} // เลือก SlaughterhouseWeight
                  className="mr-2 cursor-pointer"
                />
                <label>
                  {t("settingProduction.cropTable.slaughterhouse_weight")}
                </label>
                <input
                  type="radio"
                  checked={isCatchDateSelected}
                  onChange={() => onEditChange(index, key, 0)} // เลือก DateCatch
                  className="ml-4 mr-2 cursor-pointer "
                />
                <label>{t("settingProduction.cropTable.catching_date")}</label>
              </div>
            </>
          ) : (
            <input
              type={key === "FocusCatch" ? "number" : "text"}
              value={detail[key] ?? ""}
              onChange={(e) => onEditChange(index, key, e.target.value)}
              className="w-full min-w-[75px] max-w-[120px] border border-gray-300 rounded-md px-2 py-1 text-center cursor-pointer
              focus:outline-none focus:ring-1 focus:ring-[#A1C8FE] focus:border-[#A1C8FE] 
             dark:focus:ring-[#948979] dark:focus:border-[#948979] "
            />
          )
        ) : key === "DateStart" || key === "DateCatch" || key === "DateEnd" ? (
          formatDateOnly(detail[key])
        ) : key === "FocusCatch" ? (
          detail[key] === 0 ? (
            t("settingProduction.cropTable.catching_date")
          ) : detail[key] === 1 ? (
            t("settingProduction.cropTable.slaughterhouse_weight")
          ) : (
            "-"
          )
        ) : (
          detail[key] ?? "-"
        )}
      </td>
    );
  });
};

// ลบ---
//     {isEditing && (
//       <td className="border border-gray-200 dark:border-gray-500 text-[10px] md:text-xs whitespace-nowrap text-center px-3 py-1">
//         {/* คอลัมน์ Action สำหรับปุ่ม ✏️ */}
//         {editingRows.includes(index) ? (
//           <div className="flex justify-center gap-2">
//             <button
//               onClick={() => {
//                 setEditingRows(
//                   editingRows.filter((i) => i !== index)
//                 ); // ออกจากโหมดแก้ไข
//               }}
//               className="text-red-500 cursor-pointer hover:scale-110"
//               title="Cancel"
//             >
//               ❌
//             </button>
//             <button
//               onClick={() => {
//                 setEditingRows(
//                   editingRows.filter((i) => i !== index)
//                 ); // ออกจากโหมดแก้ไข
//                 // onSave(); // บันทึก
//               }}
//               className="text-green-500 cursor-pointer hover:scale-110"
//               title="Save"
//             >
//               💾
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => setEditingRows([...editingRows, index])}
//             className="flex items-center gap-1 text-gray-700 hover:text-[#5F99AE] dark:hover:text-[#1DCD9F] dark:text-white cursor-pointer"
//             title="Edit"
//           >
//             ✏️
//           </button>
//         )}
//       </td>
//     )}
// ลบ--
