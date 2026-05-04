const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const financialUrls = {
  // 1. GET — Paginated list of all company financial details
  getFinancialDetails: `${baseUrl}/api/v1/admin/financial`,

  // 2. GET — Dashboard overview (total revenue, MRR, active customers, churn, top companies, revenue chart)
  getDashboard: `${baseUrl}/api/v1/admin/financial/dashboard`,

  // 3. GET — Deep analytics (revenue growth, CLV, churn, revenue by plan, top performers)
  getAnalytics: `${baseUrl}/api/v1/admin/financial/analytics`,

  // 4. GET — Revenue time-series over a period (accepts ?period=30d)
  getRevenueTrends: `${baseUrl}/api/v1/admin/financial/revenue-trends`,

  // 5. GET — Top N companies by revenue
  getTopCompanies: `${baseUrl}/api/v1/admin/financial/top-companies`,

  // 6. GET — Financial health score with recommendations
  getHealth: `${baseUrl}/api/v1/admin/financial/health`,

  // 7. GET — Single company's financial details
  getCompanyFinancial: (companyId: string) =>
    `${baseUrl}/api/v1/admin/financial/company/${companyId}`,

  // 8. PUT — Update a company's financial details
  updateCompanyFinancial: (companyId: string) =>
    `${baseUrl}/api/v1/admin/financial/company/${companyId}`,

  // 9. POST — Recalculate aggregates from transactions
  recalculateCompanyFinancial: (companyId: string) =>
    `${baseUrl}/api/v1/admin/financial/company/${companyId}/recalculate`,
};
