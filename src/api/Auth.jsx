// src/api/auth/Auth.js
import axios from "axios";
import { BASE_URL } from "../utils/ApiConfig"

export const login = async ({ username, password }) => {
  const params = new URLSearchParams({
    grant_type: "password", // ✅ อย่าลืมใช้ lowercase
    username,
    password,
  });

  const response = await axios.post(
    // "https://smartfarmpro.com/v4/api/security/login",
    `${BASE_URL}/api/security/login`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log("Login API Response:---->>", response.data[".email"]);

  return response.data; 
};
