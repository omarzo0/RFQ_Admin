import { baseUrl } from "@/shared/api/baseUrl";

const dashboardUrls = {
  // Main dashboard
  getDashboard: `${baseUrl}/api/v1/admin/dashboard`,
  getComprehensive: `${baseUrl}/api/v1/admin/dashboard/comprehensive`,

  // Resources
  getRFQs: `${baseUrl}/api/v1/admin/dashboard/rfqs`,
  getQuotes: `${baseUrl}/api/v1/admin/dashboard/quotes`,
  getContacts: `${baseUrl}/api/v1/admin/dashboard/contacts`,
  getShippingLines: `${baseUrl}/api/v1/admin/dashboard/shipping-lines`,
  getEmails: `${baseUrl}/api/v1/admin/dashboard/emails`,

  // Management overviews
  getAdminManagement: `${baseUrl}/api/v1/admin/dashboard/admin-management`,
  getCompanyManagement: `${baseUrl}/api/v1/admin/dashboard/company-management`,
  getTicketManagement: `${baseUrl}/api/v1/admin/dashboard/ticket-management`,
  getSystemFeatures: `${baseUrl}/api/v1/admin/dashboard/system-features`,
  getSubscriptions: `${baseUrl}/api/v1/admin/dashboard/subscriptions`,

  // Analytics
  getAnalyticsOverview: `${baseUrl}/api/v1/admin/dashboard/analytics`,
  getSubscriptionAnalytics: `${baseUrl}/api/v1/admin/dashboard/analytics/subscriptions`,
  getEmailAnalytics: `${baseUrl}/api/v1/admin/dashboard/analytics/emails`,
  getRFQAnalytics: `${baseUrl}/api/v1/admin/dashboard/analytics/rfqs`,
  getQuoteAnalytics: `${baseUrl}/api/v1/admin/dashboard/analytics/quotes`,

  // Admin Analytics routes (/api/v1/admin/analytics)
  getCompanyGrowthAnalytics: `${baseUrl}/api/v1/admin/analytics/company-growth`,
  getRevenueAnalytics: `${baseUrl}/api/v1/admin/analytics/revenue`,
  getUserActivityAnalytics: `${baseUrl}/api/v1/admin/analytics/user-activity`,
  getEmailPerformance: `${baseUrl}/api/v1/admin/analytics/email-performance`,
  getRFQPerformance: `${baseUrl}/api/v1/admin/analytics/rfq-performance`,
  getQuotePerformance: `${baseUrl}/api/v1/admin/analytics/quote-performance`,
  getTopCompanies: `${baseUrl}/api/v1/admin/analytics/top-companies`,

  // Company details
  getCompanyDetails: (companyId: string) =>
    `${baseUrl}/api/v1/admin/dashboard/companies/${companyId}/details`,
} as const;

export default dashboardUrls;
