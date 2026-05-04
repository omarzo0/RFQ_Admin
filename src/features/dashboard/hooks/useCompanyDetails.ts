"use client";

import { useState, useCallback } from "react";
import { getCompanyDetails } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface CompanyDetails {
  _id: string;
  name: string;
  email?: string;
  plan?: string;
  status?: string;
  usersCount?: number;
  rfqsCount?: number;
  quotesCount?: number;
  revenue?: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface UseCompanyDetailsReturn {
  data: CompanyDetails | null;
  loading: boolean;
  error: string | null;
  fetch: (companyId: string) => Promise<void>;
}

export function useCompanyDetails(): UseCompanyDetailsReturn {
  const [data, setData] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCompanyDetails(companyId);
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load company details"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load company details"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch: fetchData };
}
