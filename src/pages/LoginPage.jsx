import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFarmStore from "../store/smartfarm-store";
import { useTranslation } from "react-i18next";
import heroImage from "../assets/img/nene.jpg";
import titleImage from "../assets/img/Logo-SmartFarmPro.png";
import { MdKeyboardArrowRight } from "react-icons/md";

const LoginPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = useFarmStore((state) => state.loginUser);

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    localStorage.setItem("savedUsername", formData.username);

    const result = await loginUser(formData);

    if (result.success) {
      navigate("/overview/house");
    } else {
      setError(t("login.error"));
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 to-white px-4 sm:px-6 md:px-10 py-6 relative overflow-hidden">
      {/* Animated Circles */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-cyan-400 to-teal-400 rounded-full opacity-40 top-20 left-1/3 transform -translate-x-1/2 animate-float-slow"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 bottom-32 right-10 animate-float-fast"></div>
      <div className="absolute w-20 h-20 bg-blue-400 rounded-full opacity-50 top-1/2 left-[15%] animate-float-medium"></div>
      <div className="absolute w-30 h-30 bg-red-400 rounded-full opacity-50 top-[20%] right-[5%] md:right-[20%] animate-float-slow"></div>
      <div className="absolute w-12 h-12 bg-green-400 rounded-full opacity-50 top-[80%] right-[70%] animate-float-slow"></div>
      <div className="absolute w-24 h-24 bg-amber-300 rounded-full opacity-50 top-[80%] right-[40%] animate-float-slow"></div>

      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-4xl shadow-gray-400 shadow-lg overflow-hidden relative">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 px-10 py-8 flex flex-col justify-center z-10 bg-white">
          <img src={titleImage} alt="logo" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center mt-5">
            {t("login.accountLogin")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {t("login.email_address")}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="text-sm text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {t("login.password")}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="text-sm text-gray-700 w-full px-4 py-2  border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <div className="text-xs text-left text-gray-600 flex items-center gap-1">
                <input type="checkbox" />
                <a href="#">Remember me</a>
              </div>
              <div className="text-xs text-left text-[#A1C8FE] hover:underline hover:text-blue-500">
                <a href="#">Forgot your password?</a>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`group flex items-center justify-center w-full bg-[#A1C8FE] text-white font-semibold py-2 rounded-full shadow-gray-500 shadow-md transition duration-200 cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-500"
              }`}
            >
              {loading ? t("login.loading") : t("login.submit")}
              <MdKeyboardArrowRight
                size={24}
                className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1.5"
              />
            </button>
          </form>
        </div>

        {/* Right: Image with SVG Mask */}
        <div className="hidden md:block md:w-1/2 h-64 md:h-auto relative">
          <svg
            viewBox="0 0 566 840"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-2 right-0 w-full h-full "
            preserveAspectRatio="xMidYMid slice"
          >
            <mask id="mask0" mask-type="alpha">
              <path
                fill="#fff"
                d="M342.407 73.6315C388.53 56.4007 394.378 17.3643 391.538 0H566V840H0C14.5385 834.991 100.266 804.436 77.2046 707.263C49.6393 591.11 115.306 518.927 176.468 488.873C363.385 397.026 156.98 302.824 167.945 179.32C173.46 117.209 284.755 95.1699 342.407 73.6315Z"
              />
            </mask>

            <g mask="url(#mask0)">
              <path
                fill="#fff"
                d="M342.407 73.6315C388.53 56.4007 394.378 17.3643 391.538 0H566V840H0C14.5385 834.991 100.266 804.436 77.2046 707.263C49.6393 591.11 115.306 518.927 176.468 488.873C363.385 397.026 156.98 302.824 167.945 179.32C173.46 117.209 284.755 95.1699 342.407 73.6315Z"
              />
              <image
                href={heroImage} // <-- เปลี่ยนเป็น URL รูปภาพที่คุณใช้
                width="566"
                height="840"
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
