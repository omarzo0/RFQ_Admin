/* ═══════════════════════════════════════════
   TRANSACTIONS FEATURE — TYPES
   Matches 8 admin transaction endpoints
   ═══════════════════════════════════════════ */

/* ──────── Shared / Reusable ──────── */

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ──────── 1. GET /transactions — Paginated list ──────── */

export interface Transaction {
  id: string;
  stripeTransactionId: string;
  companyId: string;
  companyName: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsSummary {
  totalAmount: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  currency: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: TransactionPagination;
  summary: TransactionsSummary;
}

export type TransactionsParams = {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  companyId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

/* ──────── 2. GET /transactions/:id — Detail ──────── */

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
}

export interface StripeData {
  paymentIntentId: string;
  chargeId: string;
  invoiceId: string;
}

export interface TransactionDetail {
  id: string;
  stripeTransactionId: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  description: string;
  paymentMethod: PaymentMethod;
  stripeData: StripeData;
  createdAt: string;
  updatedAt: string;
}

/* ──────── 3. GET /transactions/analytics ──────── */

export interface AnalyticsOverview {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageTransactionValue: number;
  currency: string;
}

export interface AnalyticsTrend {
  date: string;
  transactions: number;
  amount: number;
  successRate: number;
}

export interface AnalyticsByStatus {
  status: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface AnalyticsByType {
  type: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface AnalyticsTopCompany {
  companyId: string;
  companyName: string;
  transactionCount: number;
  totalAmount: number;
}

export interface TransactionAnalyticsResponse {
  overview: AnalyticsOverview;
  trends: AnalyticsTrend[];
  byStatus: AnalyticsByStatus[];
  byType: AnalyticsByType[];
  topCompanies: AnalyticsTopCompany[];
}

/* ──────── 4. GET /transactions/company/:companyId ──────── */

export interface CompanyTransactionCompany {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: string;
}

export interface CompanyTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface CompanyTransactionSummary {
  totalAmount: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
}

export interface CompanyTransactionsResponse {
  company: CompanyTransactionCompany;
  transactions: CompanyTransaction[];
  pagination: TransactionPagination;
  summary: CompanyTransactionSummary;
}

/* ──────── 5. GET /transactions/summary ──────── */

export interface TransactionCounts {
  total: number;
  successful: number;
  failed: number;
  pending: number;
}

export interface AverageValues {
  transactionValue: number;
  monthlyPerCompany: number;
  lifetimePerCompany: number;
}

export interface ConversionRates {
  trialToPaid: number;
  subscriptionRetention: number;
  paymentSuccess: number;
}

export interface TopPerformingPlan {
  plan: string;
  revenue: number;
  transactions: number;
  averageValue: number;
}

export interface TransactionSummaryResponse {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  currency: string;
  transactionCounts: TransactionCounts;
  averageValues: AverageValues;
  conversionRates: ConversionRates;
  topPerformingPlans: TopPerformingPlan[];
}

/* ──────── 6. GET /transactions/export ──────── */

export interface ExportResponse {
  exportId: string;
  status: string;
  downloadUrl: string;
  expiresAt: string;
}

/* ──────── 7. GET /transactions/failed ──────── */

export interface FailedTransaction {
  id: string;
  stripeTransactionId: string;
  companyId: string;
  companyName: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  description: string;
  failureReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface FailureReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface FailedTransactionsResponse {
  transactions: FailedTransaction[];
  pagination: TransactionPagination;
  failureReasons: FailureReason[];
}

/* ──────── 8. POST /transactions/:id/retry ──────── */

export interface RetryResponse {
  id: string;
  status: string;
  retryAttempt: number;
  retryReason: string;
  updatedAt: string;
}
