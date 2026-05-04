import { baseUrl } from "@/shared/api/baseUrl";

const companiesUrls = {
  // Dashboard stats
  getDashboardStats: `${baseUrl}/api/v1/admin/companies/dashboard/stats`,

  // Company CRUD
  getCompanies: `${baseUrl}/api/v1/admin/companies`,
  createCompany: `${baseUrl}/api/v1/admin/companies`,
  getCompany: (id: string) => `${baseUrl}/api/v1/admin/companies/${id}`,
  updateCompany: (id: string) => `${baseUrl}/api/v1/admin/companies/${id}`,
  deleteCompany: (id: string) => `${baseUrl}/api/v1/admin/companies/${id}`,
  restoreCompany: (id: string) =>
    `${baseUrl}/api/v1/admin/companies/${id}/restore`,

  // Company User CRUD
  createCompanyUser: `${baseUrl}/api/v1/admin/companies/users`,
  getCompanyUsers: (companyId: string) =>
    `${baseUrl}/api/v1/admin/companies/${companyId}/users`,
  updateCompanyUser: (userId: string) =>
    `${baseUrl}/api/v1/admin/companies/users/${userId}`,
  deleteCompanyUser: (userId: string) =>
    `${baseUrl}/api/v1/admin/companies/users/${userId}`,
} as const;

export default companiesUrls;
