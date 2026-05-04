import { authRequests } from "@/shared/api/request";
import { AxiosResponse } from "axios";
import companiesUrls from "./urls";

const { get: getAuth, post: postAuth, put: putAuth, delete: deleteAuth } = authRequests;

// Dashboard stats
export const getCompanyDashboardStats = (): Promise<AxiosResponse> =>
  getAuth(null, false, companiesUrls.getDashboardStats);

// Company CRUD
export const getCompanies = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<AxiosResponse> =>
  getAuth(null, false, companiesUrls.getCompanies, params as Record<string, string | number | boolean>);

export const createCompany = (data: {
  name: string;
  email: string;
  domain?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  trialEndsAt?: string;
  emailFooter?: string;
  defaultFollowUpDays?: number;
  autoFollowUpEnabled?: boolean;
}): Promise<AxiosResponse> =>
  postAuth(null, false, companiesUrls.createCompany, data);

export const getCompanyById = (id: string): Promise<AxiosResponse> =>
  getAuth(null, false, companiesUrls.getCompany(id));

export const updateCompany = (
  id: string,
  data: {
    name?: string;
    email?: string;
    domain?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    timezone?: string;
    isActive?: boolean;
  }
): Promise<AxiosResponse> =>
  putAuth(null, false, companiesUrls.updateCompany(id), data);

export const deleteCompany = (id: string): Promise<AxiosResponse> =>
  deleteAuth(null, false, companiesUrls.deleteCompany(id));

export const restoreCompany = (id: string): Promise<AxiosResponse> =>
  postAuth(null, false, companiesUrls.restoreCompany(id));

// Company User CRUD
export const createCompanyUser = (data: {
  email: string;
  password: string;
  companyId: string;
  firstName: string;
  lastName: string;
  role?: string;
}): Promise<AxiosResponse> =>
  postAuth(null, false, companiesUrls.createCompanyUser, data);

export const getCompanyUsers = (
  companyId: string,
  params?: { page?: number; limit?: number }
): Promise<AxiosResponse> =>
  getAuth(
    null,
    false,
    companiesUrls.getCompanyUsers(companyId),
    params as Record<string, string | number | boolean>
  );

export const updateCompanyUser = (
  userId: string,
  data: { firstName?: string; lastName?: string; role?: string; isActive?: boolean }
): Promise<AxiosResponse> =>
  putAuth(null, false, companiesUrls.updateCompanyUser(userId), data);

export const deleteCompanyUser = (userId: string): Promise<AxiosResponse> =>
  deleteAuth(null, false, companiesUrls.deleteCompanyUser(userId));
