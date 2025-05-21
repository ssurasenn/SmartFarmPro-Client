import { Navigate, Outlet } from "react-router-dom";
import useFarmStore from "../store/smartfarm-store";

const ProtectedRoute = () => {
  const { isAuthenticated, token, isHydrated } = useFarmStore();

  if (!isHydrated) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
