"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminManagement } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStatistics {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  superAdmins: number;
  regularAdmins: number;
  recentLogins: number;
  roleDistribution: {
    superAdmins: number;
    regularAdmins: number;
  };
}

export interface AdminManagementData {
  admins: Admin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: AdminStatistics;
}

interface UseAdminManagementReturn {
  data: AdminManagementData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminManagement(): UseAdminManagementReturn {
  const [data, setData] = useState<AdminManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminManagement();
      if (response.data?.success) {
        setData(response.data.data as AdminManagementData);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load admin management data"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load admin management data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
