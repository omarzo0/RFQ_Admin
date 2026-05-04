import { authRequests } from "@/shared/api/request";
import { financialUrls } from "./urls";

/* ──────── 1. GET /financial — paginated list ──────── */
export const getFinancialDetails = (params?: {
  page?: number;
  limit?: number;
}) => {
  return authRequests.get(null, false, financialUrls.getFinancialDetails, params);
};

/* ──────── 2. GET /financial/dashboard — overview ──────── */
export const getDashboard = () => {
  return authRequests.get(null, false, financialUrls.getDashboard);
};

/* ──────── 3. GET /financial/analytics — deep analytics ──────── */
export const getAnalytics = (params?: { period?: string }) => {
  return authRequests.get(null, false, financialUrls.getAnalytics, params);
};

/* ──────── 4. GET /financial/revenue-trends — time-series ──────── */
export const getRevenueTrends = (params?: { period?: string }) => {
  return authRequests.get(null, false, financialUrls.getRevenueTrends, params);
};

/* ──────── 5. GET /financial/top-companies — top N by revenue ──────── */
export const getTopCompanies = (params?: { limit?: number }) => {
  return authRequests.get(null, false, financialUrls.getTopCompanies, params);
};

/* ──────── 6. GET /financial/health — health score ──────── */
export const getHealth = () => {
  return authRequests.get(null, false, financialUrls.getHealth);
};

/* ──────── 7. GET /financial/company/:id — single company ──────── */
export const getCompanyFinancial = (companyId: string) => {
  return authRequests.get(
    null,
    false,
    financialUrls.getCompanyFinancial(companyId)
  );
};

/* ──────── 8. PUT /financial/company/:id — update company ──────── */
export const updateCompanyFinancial = (
  companyId: string,
  data: Record<string, unknown>
) => {
  return authRequests.put(
    null,
    false,
    financialUrls.updateCompanyFinancial(companyId),
    data
  );
};

/* ──────── 9. POST /financial/company/:id/recalculate ──────── */
export const recalculateCompanyFinancial = (companyId: string) => {
  return authRequests.post(
    null,
    false,
    financialUrls.recalculateCompanyFinancial(companyId),
    {}
  );
};
