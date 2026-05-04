import { authRequests } from "@/shared/api/request";
import { AxiosResponse } from "axios";
import dashboardUrls from "./urls";

const { get: getAuth } = authRequests;

// Main dashboard
export const getDashboard = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getDashboard);

export const getComprehensiveDashboard = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getComprehensive);

// Resources
export const getAllRFQs = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getRFQs);

export const getAllQuotes = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getQuotes);

export const getAllContacts = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getContacts);

export const getAllShippingLines = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getShippingLines);

export const getAllEmails = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getEmails);

// Management overviews
export const getAdminManagement = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getAdminManagement);

export const getCompanyManagement = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getCompanyManagement);

export const getTicketManagement = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getTicketManagement);

export const getSystemFeatures = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getSystemFeatures);

export const getSubscriptionOverview = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getSubscriptions);

// Analytics
export const getAnalyticsOverview = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getAnalyticsOverview);

export const getSubscriptionAnalytics = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getSubscriptionAnalytics);

export const getEmailAnalytics = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getEmailAnalytics);

export const getRFQAnalytics = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getRFQAnalytics);

export const getQuoteAnalytics = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getQuoteAnalytics);

// Admin Analytics routes (/api/v1/admin/analytics)
export const getCompanyGrowthAnalytics = (months = 12): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getCompanyGrowthAnalytics, { months });

export const getRevenueAnalytics = (months = 12): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getRevenueAnalytics, { months });

export const getUserActivityAnalytics = (days = 30): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getUserActivityAnalytics, { days });

export const getEmailPerformance = (months = 12): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getEmailPerformance, { months });

export const getRFQPerformance = (months = 12): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getRFQPerformance, { months });

export const getQuotePerformance = (months = 12): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getQuotePerformance, { months });

export const getTopCompanies = (): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getTopCompanies);

// Company details
export const getCompanyDetails = (companyId: string): Promise<AxiosResponse> =>
  getAuth(null, false, dashboardUrls.getCompanyDetails(companyId));
