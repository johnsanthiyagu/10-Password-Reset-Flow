const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD && !configuredBaseUrl) {
  throw new Error(
    "VITE_API_URL is required for production. Set it to your deployed backend URL ending in /api/users."
  );
}

const baseUrl = configuredBaseUrl || "http://localhost:4000/api/users";

export const USERS_API_URL = baseUrl.replace(/\/+$/, "");
