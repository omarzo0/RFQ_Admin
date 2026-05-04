"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyManagement } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface ManagedCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users: unknown[];
  userCount: number;
  lastActivityAt: string;
}

export interface PlanDistribution {
  plan: string;
  count: number;
  percentage: number;
}

export interface SubscriptionStats {
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
  planDistribution: PlanDistribution[];
  churnRate: number;
  renewalRate: number;
}

export interface CompanyManagementData {
  companies: ManagedCompany[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  subscriptionStats: SubscriptionStats;
}

interface UseCompanyManagementReturn {
  data: CompanyManagementData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCompanyManagement(): UseCompanyManagementReturn {
  const [data, setData] = useState<CompanyManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCompanyManagement();
      if (response.data?.success) {
        setData(response.data.data as CompanyManagementData);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load company management data"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load company management data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
