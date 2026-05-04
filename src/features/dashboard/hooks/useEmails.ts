"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllEmails } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface Email {
  _id: string;
  subject?: string;
  from?: string;
  to?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface UseEmailsReturn {
  data: Email[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmails(): UseEmailsReturn {
  const [data, setData] = useState<Email[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEmails();
      if (response.data?.success) {
        const result = response.data.data;
        const list = Array.isArray(result) ? result : (result?.emails || []);
        setData(list);
        setTotal(result?.total ?? list.length ?? 0);
      } else {
        setError(
          response.data?.message || response.data?.error || "Failed to load emails"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load emails"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}
