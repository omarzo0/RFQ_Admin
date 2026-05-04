"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllQuotes } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface Quote {
  _id: string;
  rfqId?: string;
  companyId?: string;
  amount?: number;
  currency?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface UseQuotesReturn {
  data: Quote[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useQuotes(): UseQuotesReturn {
  const [data, setData] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllQuotes();
      if (response.data?.success) {
        const result = response.data.data;
        const list = Array.isArray(result) ? result : (result?.quotes || []);
        setData(list);
        setTotal(result?.total ?? list.length ?? 0);
      } else {
        setError(
          response.data?.message || response.data?.error || "Failed to load quotes"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load quotes"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}
