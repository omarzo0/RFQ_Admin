export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  RFQ: "/rfq",
  USERS: "/users",
  SETTINGS: "/settings",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;
