/* ═══════════════════════════════════════════
   ADMIN MANAGEMENT FEATURE — TYPES
   Matches 9 admin management endpoints
   ═══════════════════════════════════════════ */

/* ──────── Shared ──────── */

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ──────── Admin entity ──────── */

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ──────── 1. POST /admins — Create ──────── */

export interface CreateAdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

/* ──────── 2. GET /admins — List ──────── */

export interface AdminsParams {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: string;
  search?: string;
}

export interface AdminsResponse {
  admins: Admin[];
  pagination: AdminPagination;
}

/* ──────── 3. GET /admins/:id — Detail ──────── */

export interface AdminDetail extends Admin {
  permissions: string[];
}

/* ──────── 4. PUT /admins/:id — Update ──────── */

export interface UpdateAdminData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface UpdateAdminResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  updatedAt: string;
}

/* ──────── 5. DELETE /admins/:id — Delete ──────── */

export interface DeleteAdminResponse {
  id: string;
  isActive: boolean;
  deletedAt: string;
}

/* ──────── 6. PUT /admins/:id/password — Change Password ──────── */

export interface ChangePasswordData {
  newPassword: string;
}

export interface ChangePasswordResponse {
  id: string;
  passwordChangedAt: string;
}

/* ──────── 7. PATCH /admins/:id/status — Toggle Status ──────── */

export interface ToggleStatusData {
  isActive: boolean;
}

export interface ToggleStatusResponse {
  id: string;
  isActive: boolean;
  updatedAt: string;
}

/* ──────── 8. GET /roles — Roles ──────── */

export interface AdminRole {
  role: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface RolesResponse {
  roles: AdminRole[];
}

/* ──────── 9. GET /admins/:id/activity — Activity Log ──────── */

export interface AdminActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface ActivityParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface ActivityResponse {
  activities: AdminActivity[];
  pagination: AdminPagination;
}
