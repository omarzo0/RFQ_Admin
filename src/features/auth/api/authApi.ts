import { anonymousRequests, authRequests } from "@/shared/api/request";
import { AxiosResponse } from "axios";
import authUrls from "./urls";
import type {
  LoginRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "@/features/auth/types";

const { post: postAnonymous } = anonymousRequests;
const { get: getAuth, post: postAuth } = authRequests;

// Auth APIs
export const adminLogin = (data: LoginRequest): Promise<AxiosResponse> =>
  postAnonymous(null, false, authUrls.login, data);

export const getProfile = (): Promise<AxiosResponse> =>
  getAuth(null, false, authUrls.profile);

export const changePassword = (
  data: ChangePasswordRequest
): Promise<AxiosResponse> =>
  postAuth(null, false, authUrls.changePassword, data);

export const refreshToken = (data: {
  refreshToken: string;
}): Promise<AxiosResponse> =>
  postAuth(null, false, authUrls.refreshToken, data);

export const logoutUser = (): Promise<AxiosResponse> =>
  postAuth(null, false, authUrls.logout);

export const forgotPassword = (
  data: ForgotPasswordRequest
): Promise<AxiosResponse> =>
  postAnonymous(null, false, authUrls.forgotPassword, data);

export const verifyOtp = (data: VerifyOtpRequest): Promise<AxiosResponse> =>
  postAnonymous(null, false, authUrls.verifyOtp, data);

export const resetPassword = (
  data: ResetPasswordRequest
): Promise<AxiosResponse> =>
  postAnonymous(null, false, authUrls.resetPassword, data);
