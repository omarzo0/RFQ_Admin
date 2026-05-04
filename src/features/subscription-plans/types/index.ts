/* ═══════════════════════════════════════════
   SUBSCRIPTION PLANS FEATURE — TYPES
   Matches admin subscription-plan endpoints
   ═══════════════════════════════════════════ */

/* ──────── Shared ──────── */

export interface PlanPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Features are now a key→boolean map */
export type PlanFeatures = Record<string, boolean>;

export interface FeatureSummary {
  enabledCount: number;
  totalCount: number;
}

/* ──────── Feature Registry ──────── */

export interface FeatureRegistryItem {
  key: string;
  label: string;
  description: string;
  category: string;
  defaultValue: boolean;
}

export interface FeatureRegistryResponse {
  features: FeatureRegistryItem[];
  grouped: Record<string, FeatureRegistryItem[]>;
  totalFeatures: number;
}

/* ──────── 1. GET /subscription-plans — List ──────── */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: PlanFeatures;
  featureSummary?: FeatureSummary;
  isActive: boolean;
  isDefault?: boolean;
  maxUsers?: number;
  maxRFQsPerMonth?: number;
  maxContacts?: number;
  maxEmailSendsPerMonth?: number;
  stripePriceId?: string;
  stripeProductId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  subscriptionPlans: SubscriptionPlan[];
  pagination: PlanPagination;
}

export type PlansParams = {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
};

/* ──────── 2. GET /subscription-plans/:id — Detail ──────── */

export interface PlanSubscribers {
  total: number;
  active: number;
  trial: number;
}

export interface ResolvedFeature {
  key: string;
  label: string;
  description: string;
  category: string;
  enabled: boolean;
  explicitlySet: boolean;
}

export interface PlanDetail extends SubscriptionPlan {
  subscribers?: PlanSubscribers;
  resolvedFeatures?: ResolvedFeature[];
}

/* ──────── 3. POST /subscription-plans — Create ──────── */

export interface CreatePlanData {
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency?: string;
  features: PlanFeatures;
  isActive?: boolean;
  maxUsers?: number;
  maxRFQsPerMonth?: number;
  maxContacts?: number;
  maxEmailSendsPerMonth?: number;
}

/* ──────── 4. PUT /subscription-plans/:id — Update ──────── */

export interface UpdatePlanData {
  name?: string;
  description?: string;
  priceMonthly?: number;
  priceYearly?: number;
  features?: PlanFeatures;
  isActive?: boolean;
  maxUsers?: number;
  maxRFQsPerMonth?: number;
  maxContacts?: number;
  maxEmailSendsPerMonth?: number;
}

/* ──────── 5. DELETE /subscription-plans/:id ──────── */

export interface DeletePlanResponse {
  id: string;
  isActive: boolean;
  deletedAt: string;
}

/* ──────── 6. PATCH /subscription-plans/:id/status ──────── */

export interface ToggleStatusData {
  isActive: boolean;
}

export interface ToggleStatusResponse {
  id: string;
  isActive: boolean;
  updatedAt: string;
}

/* ──────── 7. GET /subscription-plans/:id/analytics ──────── */

export interface PlanAnalyticsPlan {
  id: string;
  name: string;
  priceMonthly: number;
  currency: string;
}

export interface PlanAnalyticsSubscribers {
  total: number;
  active: number;
  trial: number;
  churned: number;
}

export interface PlanAnalyticsRevenue {
  total: number;
  monthly: number;
  growth: number;
}

export interface PlanAnalyticsConversion {
  trialToPaid: number;
  averageTrialDuration: number;
  retentionRate: number;
}

export interface PlanAnalyticsTrend {
  month: string;
  newSubscribers: number;
  churnedSubscribers: number;
  revenue: number;
}

export interface PlanAnalyticsResponse {
  plan: PlanAnalyticsPlan;
  subscribers: PlanAnalyticsSubscribers;
  revenue: PlanAnalyticsRevenue;
  conversion: PlanAnalyticsConversion;
  trends: PlanAnalyticsTrend[];
}

/* ──────── 8. GET /subscription-plans/:id/subscribers ──────── */

export interface PlanSubscriber {
  companyId: string;
  companyName: string;
  subscriptionStatus: string;
  subscribedAt: string;
  trialEndsAt: string | null;
  lastPaymentDate: string | null;
}

export interface PlanSubscribersSummary {
  totalSubscribers: number;
  activeSubscribers: number;
  trialSubscribers: number;
}

export interface PlanSubscribersResponse {
  subscribers: PlanSubscriber[];
  pagination: PlanPagination;
  summary: PlanSubscribersSummary;
}

export type PlanSubscribersParams = {
  page?: number;
  limit?: number;
  status?: string;
};
