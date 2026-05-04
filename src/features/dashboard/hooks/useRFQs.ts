"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllRFQs } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface RFQ {
  _id: string;
  companyId: string;
  companyName?: string;
  origin?: string;
  destination?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface UseRFQsReturn {
  data: RFQ[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRFQs(): UseRFQsReturn {
  const [data, setData] = useState<RFQ[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllRFQs();
      if (response.data?.success) {
        const result = response.data.data;
        const list = Array.isArray(result) ? result : (result?.rfqs || []);
        setData(list);
        setTotal(result?.total ?? list.length ?? 0);
      } else {
        setError(
          response.data?.message || response.data?.error || "Failed to load RFQs"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load RFQs"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}
