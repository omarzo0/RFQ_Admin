import { authRequests } from "@/shared/api/request";
import { adminMgmtUrls } from "./urls";
import type {
  AdminsParams,
  CreateAdminData,
  UpdateAdminData,
  ChangePasswordData,
  ToggleStatusData,
  ActivityParams,
} from "@/features/admin-management/types";

/* ──────── 1. POST /admins — create admin ──────── */
export const createAdmin = (data: CreateAdminData) => {
  return authRequests.post(null, false, adminMgmtUrls.create, data);
};

/* ──────── 2. GET /admins — paginated list ──────── */
export const getAdmins = (params?: AdminsParams) => {
  return authRequests.get(null, false, adminMgmtUrls.list, params as Record<string, string | number | boolean>);
};

/* ──────── 3. GET /admins/:id — detail ──────── */
export const getAdmin = (id: string) => {
  return authRequests.get(null, false, adminMgmtUrls.detail(id));
};

/* ──────── 4. PUT /admins/:id — update ──────── */
export const updateAdmin = (id: string, data: UpdateAdminData) => {
  return authRequests.put(null, false, adminMgmtUrls.update(id), data);
};

/* ──────── 5. DELETE /admins/:id — delete ──────── */
export const deleteAdmin = (id: string) => {
  return authRequests.delete(null, false, adminMgmtUrls.delete(id));
};

/* ──────── 6. PUT /admins/:id/password — change password ──────── */
export const changeAdminPassword = (id: string, data: ChangePasswordData) => {
  return authRequests.put(null, false, adminMgmtUrls.changePassword(id), data);
};

/* ──────── 7. PATCH /admins/:id/status — toggle active status ──────── */
export const toggleAdminStatus = (id: string, data: ToggleStatusData) => {
  return authRequests.patch(null, false, adminMgmtUrls.toggleStatus(id), data);
};

/* ──────── 8. GET /roles — available roles ──────── */
export const getAdminRoles = () => {
  return authRequests.get(null, false, adminMgmtUrls.roles);
};

/* ──────── 9. GET /admins/:id/activity — activity log ──────── */
export const getAdminActivity = (id: string, params?: ActivityParams) => {
  return authRequests.get(null, false, adminMgmtUrls.activity(id), params as Record<string, string | number | boolean>);
};
