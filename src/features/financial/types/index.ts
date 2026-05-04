/* ═══════════════════════════════════════════
   FINANCIAL FEATURE — TYPES
   Matches the 9 definitive endpoints
   ═══════════════════════════════════════════ */

/* ──────── Shared / Reusable ──────── */

export interface FinancialPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ──────── 1. GET /financial — Paginated list ──────── */

export interface FinancialDetail {
  id: string;
  companyId: string;
  companyName: string;
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageTransactionValue: number;
  lastPaymentDate: string | null;
  currency: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialDetailsSummary {
  totalCompanies: number;
  totalRevenue: number;
  currency: string;
}

export interface FinancialDetailsResponse {
  financialDetails: FinancialDetail[];
  pagination: FinancialPagination;
  summary: FinancialDetailsSummary;
}

/* ──────── 2. GET /financial/dashboard — Overview ──────── */

export interface DashboardRevenueChart {
  month: string;
  revenue: number;
}

export interface DashboardTopCompany {
  companyId: string;
  companyName: string;
  revenue: number;
  growth: number;
}

export interface DashboardResponse {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeCustomers: number;
  churnRate: number;
  revenueGrowth: number;
  customerGrowth: number;
  topCompanies: DashboardTopCompany[];
  revenueChart: DashboardRevenueChart[];
  currency: string;
}

/* ──────── 3. GET /financial/analytics — Deep analytics ──────── */

export interface RevenueByPlanItem {
  plan: string;
  planId?: string;
  revenue: number;
  percentage: number;
  subscribers: number;
  averageRevenuePerUser?: number;
  monthlyRecurringRevenue?: number;
}

export interface AnalyticsTopPerformer {
  companyId: string;
  companyName: string;
  revenue: number;
  growth: number;
  plan: string;
}

export interface AnalyticsResponse {
  revenueGrowth: number;
  customerLifetimeValue: number;
  churnRate: number;
  averageRevenuePerUser: number;
  monthlyRecurringRevenue: number;
  revenueByPlan: RevenueByPlanItem[];
  topPerformers: AnalyticsTopPerformer[];
  currency: string;
  period: string;
}

/* ──────── 4. GET /financial/revenue-trends — Time-series ──────── */

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
  transactions?: number;
  growth?: number;
}

export interface RevenueTrendsResponse {
  trends: RevenueTrendPoint[];
  totalRevenue: number;
  periodRevenue: number;
  revenueGrowth: number;
  currency: string;
  period: string;
}

/* ──────── 5. GET /financial/top-companies — Top N ──────── */

export interface TopCompanyItem {
  companyId: string;
  companyName: string;
  revenue: number;
  percentage: number;
  plan?: string;
  growth?: number;
}

export interface TopCompaniesResponse {
  companies: TopCompanyItem[];
  totalRevenue: number;
  currency: string;
}

/* ──────── 6. GET /financial/health — Health score ──────── */

export interface HealthRecommendation {
  type: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface HealthMetric {
  name: string;
  value: number;
  status: "good" | "warning" | "critical";
}

export interface FinancialHealthResponse {
  score: number;
  status: string;
  metrics: HealthMetric[];
  recommendations: HealthRecommendation[];
}

/* ──────── 7. GET /financial/company/:id — Single company ──────── */

export interface CompanyFinancialCompany {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
}

export interface CompanyFinancialInfo {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageTransactionValue: number;
  lastPaymentDate: string | null;
  currency: string;
}

export interface CompanyTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
}

export interface CompanyRevenueTrendItem {
  month: string;
  revenue: number;
}

export interface CompanyFinancialResponse {
  company: CompanyFinancialCompany;
  financialDetails: CompanyFinancialInfo;
  revenueTrend: CompanyRevenueTrendItem[];
  transactions: CompanyTransaction[];
}

/* ──────── 8. PUT /financial/company/:id — Update ──────── */

export interface UpdateCompanyFinancialPayload {
  [key: string]: unknown;
}

export interface UpdateCompanyFinancialResponse {
  success: boolean;
  message: string;
  data: CompanyFinancialResponse;
}

/* ──────── 9. POST /financial/company/:id/recalculate ──────── */

export interface RecalculateResponse {
  success: boolean;
  message: string;
  data: CompanyFinancialResponse;
}
