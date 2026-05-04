"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscriptionOverview } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface Subscription {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
    rfqs: number;
    emailLogs: number;
    contacts: number;
    shippingLines: number;
  };
}

export interface SubPlanDistribution {
  plan: string;
  count: number;
  percentage: number;
}

export interface SubStatistics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  expiredSubscriptions: number;
  canceledSubscriptions: number;
  revenue: {
    monthly: number;
    yearly: number;
    total: number;
  };
  planDistribution: SubPlanDistribution[];
  churnRate: number;
  renewalRate: number;
}

export interface SubscriptionOverviewData {
  subscriptions: Subscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: SubStatistics;
  expiringTrials: Subscription[];
}

interface UseSubscriptionOverviewReturn {
  data: SubscriptionOverviewData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSubscriptionOverview(): UseSubscriptionOverviewReturn {
  const [data, setData] = useState<SubscriptionOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSubscriptionOverview();
      if (response.data?.success) {
        setData(response.data.data as SubscriptionOverviewData);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load subscription overview"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load subscription overview"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
