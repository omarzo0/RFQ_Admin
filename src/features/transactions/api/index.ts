import { authRequests } from "@/shared/api/request";
import { transactionUrls } from "./urls";
import type { TransactionsParams } from "@/features/transactions/types";

/* ──────── 1. GET /transactions — paginated list ──────── */
export const getTransactions = (params?: TransactionsParams) => {
  return authRequests.get(null, false, transactionUrls.getTransactions, params);
};

/* ──────── 2. GET /transactions/:id — detail ──────── */
export const getTransaction = (id: string) => {
  return authRequests.get(null, false, transactionUrls.getTransaction(id));
};

/* ──────── 3. GET /transactions/analytics ──────── */
export const getTransactionAnalytics = (params?: {
  period?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return authRequests.get(null, false, transactionUrls.getAnalytics, params);
};

/* ──────── 4. GET /transactions/company/:companyId ──────── */
export const getCompanyTransactions = (
  companyId: string,
  params?: { page?: number; limit?: number; status?: string; type?: string }
) => {
  return authRequests.get(
    null,
    false,
    transactionUrls.getCompanyTransactions(companyId),
    params
  );
};

/* ──────── 5. GET /transactions/summary ──────── */
export const getTransactionSummary = (params?: { period?: string }) => {
  return authRequests.get(null, false, transactionUrls.getSummary, params);
};

/* ──────── 6. GET /transactions/export ──────── */
export const exportTransactions = (params?: {
  format?: string;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  status?: string;
}) => {
  return authRequests.get(
    null,
    false,
    transactionUrls.exportTransactions,
    params
  );
};

/* ──────── 7. GET /transactions/failed ──────── */
export const getFailedTransactions = (params?: {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return authRequests.get(
    null,
    false,
    transactionUrls.getFailedTransactions,
    params
  );
};

/* ──────── 8. POST /transactions/:id/retry ──────── */
export const retryTransaction = (id: string, data?: { reason?: string }) => {
  return authRequests.post(
    null,
    false,
    transactionUrls.retryTransaction(id),
    data ?? {}
  );
};
