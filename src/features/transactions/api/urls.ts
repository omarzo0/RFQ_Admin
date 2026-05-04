const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const transactionUrls = {
  // 1. GET — Paginated list of all transactions (with filters)
  getTransactions: `${baseUrl}/api/v1/admin/transactions`,

  // 2. GET — Single transaction detail
  getTransaction: (id: string) =>
    `${baseUrl}/api/v1/admin/transactions/${id}`,

  // 3. GET — Transaction analytics & trends
  getAnalytics: `${baseUrl}/api/v1/admin/transactions/analytics`,

  // 4. GET — Company transactions
  getCompanyTransactions: (companyId: string) =>
    `${baseUrl}/api/v1/admin/transactions/company/${companyId}`,

  // 5. GET — Overall transaction summary
  getSummary: `${baseUrl}/api/v1/admin/transactions/summary`,

  // 6. GET — Export transactions
  exportTransactions: `${baseUrl}/api/v1/admin/transactions/export`,

  // 7. GET — Failed transactions
  getFailedTransactions: `${baseUrl}/api/v1/admin/transactions/failed`,

  // 8. POST — Retry failed transaction
  retryTransaction: (id: string) =>
    `${baseUrl}/api/v1/admin/transactions/${id}/retry`,
};
