/* ═══════════════════════════════════════════
   SUBSCRIPTIONS FEATURE — TYPES
   Matches 8 admin subscription endpoints
   ═══════════════════════════════════════════ */

/* ──────── Shared / Reusable ──────── */

export interface SubscriptionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ──────── 1. GET /subscriptions — Paginated list ──────── */

export interface SubscriptionCounts {
  users: number;
  rfqs: number;
  emailLogs: number;
  contacts: number;
  shippingLines: number;
}

export interface Subscription {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: SubscriptionCounts;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SubscriptionsParams = {
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
  search?: string;
};

/* ──────── 2. GET /subscriptions/:id — Detail ──────── */

export interface SubscriptionCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  industry: string;
  size: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

/* The detail API may return data flat (same as list item) or nested.
   We normalise in the hook so the dialog always gets a consistent shape. */
export interface SubscriptionDetailData {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: SubscriptionCounts;
  /* possible extra fields from detail endpoint */
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
  size?: string;
  /* nested structures that may or may not be present */
  company?: SubscriptionCompany;
  paymentHistory?: PaymentHistoryItem[];
}

/* ──────── 3. PUT /subscriptions/:id — Update ──────── */

export interface UpdateSubscriptionData {
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  trialEndsAt?: string;
}

export interface UpdateSubscriptionResponse {
  id: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  updatedAt: string;
}

/* ──────── 4. DELETE /subscriptions/:id — Cancel ──────── */

export interface CancelSubscriptionData {
  reason: string;
  immediately: boolean;
}

export interface CancelSubscriptionResponse {
  id: string;
  subscriptionStatus: string;
  cancelledAt: string;
  cancelAtPeriodEnd: boolean;
  updatedAt: string;
}

/* ──────── 5. GET /subscriptions/analytics ──────── */

export interface AnalyticsRevenue {
  monthly: number;
  yearly: number;
  total: number;
}

export interface PlanDistribution {
  plan: string;
  count: number;
  percentage: number;
}

export interface SubscriptionAnalyticsResponse {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  expiredSubscriptions: number;
  canceledSubscriptions: number;
  revenue: AnalyticsRevenue;
  planDistribution: PlanDistribution[];
  churnRate: number;
  renewalRate: number;
}

/* ──────── 6. GET /subscriptions/trials ──────── */

export interface TrialSubscription {
  id: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt: string;
  daysLeft: number;
  createdAt: string;
}

export interface TrialSummary {
  total: number;
  expiringSoon: number;
  expired: number;
  active: number;
}

export interface TrialsResponse {
  subscriptions: TrialSubscription[];
  pagination: SubscriptionPagination;
  summary: TrialSummary;
}

export type TrialsParams = {
  page?: number;
  limit?: number;
  expiringSoon?: boolean;
};

/* ──────── 7. PUT /subscriptions/:id/extend-trial ──────── */

export interface ExtendTrialData {
  extensionDays: number;
  reason: string;
}

export interface ExtendTrialResponse {
  id: string;
  trialEndsAt: string;
  extensionDays: number;
  updatedAt: string;
}

/* ──────── 8. GET /subscriptions/statistics ──────── */

export interface StatisticsOverview {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
}

export interface ConversionByPlan {
  plan: string;
  conversionRate: number;
}

export interface StatisticsConversion {
  trialToPaid: number;
  averageTrialDuration: number;
  conversionByPlan: ConversionByPlan[];
}

export interface StatisticsRetention {
  monthlyRetention: number;
  quarterlyRetention: number;
  annualRetention: number;
  averageLifetime: number;
}

export interface StatisticsRevenue {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageRevenuePerUser: number;
}

export interface SubscriptionStatisticsResponse {
  overview: StatisticsOverview;
  conversion: StatisticsConversion;
  retention: StatisticsRetention;
  revenue: StatisticsRevenue;
}
