import axios from "axios";

export const currentUser = async (token) =>
  await axios.post(
    "https://smartfarmpro.com/v3/api/security/login",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );