const baseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/users";

export const USERS_API_URL = baseUrl.replace(/\/+$/, "");
