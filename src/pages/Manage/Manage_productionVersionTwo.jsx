import { toast } from "react-toastify";
import useFarmStore from "../../store/smartfarm-store";
import { useEffect, useState ,useRef} from "react";
import { ChevronDown, ChevronUp, Pencil, Save } from "lucide-react";

const Manage_productionVersionTwo = () => {
  const fetchFarmProductions = useFarmStore((state) => state.SettingProduction);
  const selectedFarmCode = useFarmStore((state) => state.selectedFarmCode);
  const selectedCropCode = useFarmStore((state) => state.selectedCropCode); // เอาค่า crop ที่เลือกมา
  
  const [farmProductions, setFarmProductions] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedProductionId, setExpandedProductionId] = useState(null);
  
  const activeProduction = farmProductions.find((p) => p.StatusCrop === 1);
  const productionHistory = [...farmProductions.filter((p) => p.StatusCrop !== 1)].reverse();
  const isEditable = activeProduction && activeProduction.StatusCrop === 1;

  const tableRefs = useRef({});
  const activeProductionRef = useRef(null);
  
  
  useEffect(() => {
    if (selectedCropCode) {
      setExpandedProductionId(selectedCropCode);
  
      setTimeout(() => {
        if (activeProduction && activeProduction.CropCode === selectedCropCode) {
          activeProductionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          const selectedRef = tableRefs.current[selectedCropCode];
          if (selectedRef) {
            selectedRef.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 200);
    }
  }, [selectedCropCode, activeProduction]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedFarmCode) return;
      const result = await fetchFarmProductions(selectedFarmCode);
      if (result.success) {
        setFarmProductions(result.data);
        const current = result.data.find((p) => p.StatusCrop === 1);
        if (current) setEditableData(current.CropDetail);
      }
    };
    fetchData();
  }, [selectedFarmCode]);


  const handleEditChange = (index, field, value) => {
    const updated = [...editableData];
    updated[index] = { ...updated[index], [field]: value };
    setEditableData(updated);
  };

  const handleSave = () => {
    localStorage.setItem("editableCropData", JSON.stringify(editableData));
    toast.success("✅ Saved successfully!");
    setIsEditing(false);
  };

  const toggleProductionDetail = (id) => {
    setExpandedProductionId(expandedProductionId === id ? null : id);
  };
  

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Production Overview
      </h1>
      <div className="flex items-center justify-between my-6 px-4">
          <h1 className="text-md md:text-lg font-semibold text-gray-600 dark:text-white">
          Manage Production
          </h1>

          <div className="flex gap-2">
          <button className="bg-amber-200 px-3 py-1 rounded-md shadow cursor-pointer">Start</button>
          <button className="bg-red-200 px-3 py-1 rounded-md shadow cursor-pointer">Stop</button>
          </div>
      </div>

  {activeProduction ? (
    <>
      <div 
        ref={activeProductionRef} // << เพิ่มตรงนี้
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Main Crop: {activeProduction.MainCrop}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-400 text-center w-fit">
            🟢 In Process
          </span>

          {isEditable && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-1 rounded-md shadow text-sm ${
                isEditing ? "bg-gray-400" : "bg-blue-500"
              } text-white transition`}
            >
              {isEditing ? "❌ Cancel" : "✏️ Edit"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {editableData.map((house, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-500 border-gray-500 rounded-xl p-4 shadow-lg space-y-2 hover:shadow-xl 
            hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-gray-700 dark:text-white">
                🏠 {house.HouseName}
              </h3>
              <span className="text-xs text-gray-500">Flock: {house.FlockName}</span>
            </div>

            <div className="space-y-2">
              <FieldRow label="Feed Planning" value={house.FeedPlanning} isEditing={isEditing} onChange={(v) => handleEditChange(index, "FeedPlanning", v)} />
              <FieldRow label="Breed Standard" value={house.BreedStandard1} isEditing={isEditing} onChange={(v) => handleEditChange(index, "BreedStandard1", v)} />
              <FieldRow label="Start Date" value={house.StartDate} isEditing={isEditing} onChange={(v) => handleEditChange(index, "StartDate", v)} />
              <FieldRow label="Age Start" value={house.Age} isEditing={isEditing} onChange={(v) => handleEditChange(index, "Age", v)} />
              <FieldRow label="Unit" value={house.Unit} isEditing={isEditing} onChange={(v) => handleEditChange(index, "Unit", v)} />
              <FieldRow label="Slaughterhouse Weight" value={house.SlaughterhouseWeight} isEditing={isEditing} onChange={(v) => handleEditChange(index, "SlaughterhouseWeight", v)} />
              <FieldRow label="Catching Date" value={house.CatchingDate} isEditing={isEditing} onChange={(v) => handleEditChange(index, "CatchingDate", v)} />
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="text-right mt-4">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow transition"
          >
            <Save size={16} className="inline-block mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </>
  ) : (
    <p className="text-gray-500">No current crop available.</p>
  )}

  {/* Previous Crop Section */}
  {productionHistory.length > 0 && (
    <div className="mt-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-white">
       Production History
      </h2>

      <div className="flex flex-wrap gap-2">
        {productionHistory.map((crop) => (
          <button
            key={crop.CropCode}
            onClick={() => toggleProductionDetail(crop.CropCode)}
            className={`flex items-center gap-2 px-4 py-1 rounded-full border text-sm transition ${
              expandedProductionId === crop.CropCode
                ? "bg-[#A1C8FE] dark:bg-[#1DCD9F] text-white"
                : "bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
            }`}
          >
            Main Crop: {crop.MainCrop}
            {expandedProductionId === crop.CropCode ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        ))}
      </div>

      {productionHistory.map(
        (crop) =>
          expandedProductionId === crop.CropCode && (
            <div 
              ref={(el) => (tableRefs.current[crop.CropCode] = el)}
              key={crop.CropCode} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 animate-fade-in">
              {crop.CropDetail.map((house, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-600 border-gray-300 rounded-xl p-4 shadow-md space-y-2 
                hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-700 dark:text-white">
                      🏠 {house.HouseName}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-300">Flock: {house.FlockName}</span>
                  </div>

                  <div className="text-sm space-y-1">
                    <FieldRow label="Feed Planning" value={house.FeedPlanning} />
                    <FieldRow label="Breed Standard" value={house.BreedStandard1} />
                    <FieldRow label="Start Date" value={house.StartDate} />
                    <FieldRow label="Age" value={house.Age} />
                    <FieldRow label="Unit" value={house.Unit} />
                    <FieldRow label="Slaughter Wt." value={house.SlaughterhouseWeight} />
                    <FieldRow label="Catching Date" value={house.CatchingDate} />
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  )}
</div>

  );
};

const FieldRow = ({ label, value, isEditing, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
      <label className="text-left font-medium sm:w-1/2">{label}:</label>
      {isEditing ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="px-2 py-1 border rounded-lg bg-gray-50 dark:bg-gray-700 w-full sm:w-1/2"
        />
      ) : (
        <span className="sm:w-1/2 text-xs">{value || "-"}</span>
      )}
    </div>
  );
};



export default Manage_productionVersionTwo;
