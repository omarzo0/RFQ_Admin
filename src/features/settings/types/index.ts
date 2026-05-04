/* ═══════════════════════════════════════════
   SETTINGS FEATURE — TYPES
   Profile + Update Profile + Update Password
   ═══════════════════════════════════════════ */

/* ──────── GET /admin/auth/profile ──────── */

export interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ──────── PUT /admin/auth/profile ──────── */

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

/* ──────── PUT /admin/auth/password ──────── */

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}
