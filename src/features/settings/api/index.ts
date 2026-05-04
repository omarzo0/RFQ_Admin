import { authRequests } from "@/shared/api/request";
import { settingsUrls } from "./urls";
import type { UpdateProfileData, UpdatePasswordData } from "@/features/settings/types";

/* ──────── GET /admin/auth/profile ──────── */
export const getProfile = () => {
  return authRequests.get(null, false, settingsUrls.profile);
};

/* ──────── PUT /admin/auth/profile ──────── */
export const updateProfile = (data: UpdateProfileData) => {
  return authRequests.put(null, false, settingsUrls.updateProfile, data);
};

/* ──────── PUT /admin/auth/password ──────── */
export const updatePassword = (data: UpdatePasswordData) => {
  return authRequests.put(null, false, settingsUrls.updatePassword, data);
};
