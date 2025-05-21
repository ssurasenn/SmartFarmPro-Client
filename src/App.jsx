import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// <<--------------------- Pages -------->>>>
import OverviewHouse from "./pages/Overview/OverviewHouse";
import OverviewFarm from "./pages/Overview/OverviewFarm";
// <<--------------------- Pages -------->>>>
import FeedOrderAndUsage from "./pages/House/FeedOrderAndUsage";
import BirdsLiveWeight from "./pages/House/BirdsLiveWeight";
import Climate from "./pages/House/Climate";
// <<--------------------- Pages -------->>>>
import Demand from "./pages/Orders/Demand";
import ConfirmOrders from "./pages/Orders/ConfirmOrders";
import SettingOrders from "./pages/Orders/SettingOrders";
// <<--------------------- Pages -------->>>>
import ManageFarm from "./pages/Manage/ManageFarm";
import ManageDevice from "./pages/Manage/ManageDevice";
// <<--------------------- Pages -------->>>>
import Notification from "./pages/Settings/Notification";
import Member from "./pages/Settings/Member";
// <<--------------------- Pages -------->>>>
import ClimateHistory from "./pages/Analysis/ClimateHistory";

// Tostify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompareData from "./pages/Analysis/CompareData";
import Reports from "./pages/Analysis/Reports";
import Calendar from "./pages/Calendar/Calendar";
// import { SelectionProvider } from "./context/SelectionContext";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoginPage from "./pages/LoginPage";

import SettingProfile from "./components/SettingProfile";
import Upload from "./pages/Manage/Upload";
import useFarmStore from "./store/smartfarm-store";
import ProtectedRoute from "./pages/ProtectRoute";
const App = () => {
  const checkAuth = useFarmStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <ToastContainer />
        <Routes>
          {/* หน้า login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes ที่ต้องล็อกอิน */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<OverviewHouse />} />
              <Route path="/overview/house" element={<OverviewHouse />} />
              <Route path="/overview/farm" element={<OverviewFarm />} />
              <Route path="/house/feeds" element={<FeedOrderAndUsage />} />
              <Route path="/house/weight" element={<BirdsLiveWeight />} />
              <Route path="/house/climate" element={<Climate />} />
              <Route path="/orders/demand" element={<Demand />} />
              <Route path="/orders/setting" element={<SettingOrders />} />
              <Route path="/orders/confirm" element={<ConfirmOrders />} />
              <Route
                path="/analysis/climatehistory"
                element={<ClimateHistory />}
              />
              <Route path="/analysis/reports" element={<Reports />} />
              <Route path="/analysis/comparedata" element={<CompareData />} />
              <Route path="/manage/farm" element={<ManageFarm />} />
              <Route path="/manage/device" element={<ManageDevice />} />
              <Route path="/manage/upload" element={<Upload />} />
              <Route path="/settings/notification" element={<Notification />} />
              <Route path="/settings/member" element={<Member />} />
              <Route path="/calendar/events" element={<Calendar />} />
              <Route
                path="/house/feed-order-and-usage"
                element={<FeedOrderAndUsage />}
              />
              <Route
                path="/house/birds-live-weight"
                element={<BirdsLiveWeight />}
              />
              <Route path="/profile-setting" element={<SettingProfile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </LocalizationProvider>
  );
};

export default App;
