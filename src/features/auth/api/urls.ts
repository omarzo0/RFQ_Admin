import { baseUrl } from "@/shared/api/baseUrl";

const authUrls = {
  login: `${baseUrl}/api/v1/admin/auth/login`,
  profile: `${baseUrl}/api/v1/admin/auth/profile`,
  changePassword: `${baseUrl}/api/v1/admin/auth/change-password`,
  refreshToken: `${baseUrl}/api/v1/admin/auth/refresh-token`,
  logout: `${baseUrl}/api/v1/admin/auth/logout`,
  forgotPassword: `${baseUrl}/api/v1/admin/auth/forgot-password`,
  verifyOtp: `${baseUrl}/api/v1/admin/auth/verify-otp`,
  resetPassword: `${baseUrl}/api/v1/admin/auth/reset-password`,
} as const;

export type AuthUrlKeys = keyof typeof authUrls;
export default authUrls;
