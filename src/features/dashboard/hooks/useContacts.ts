"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllContacts } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface Contact {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface UseContactsReturn {
  data: Contact[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useContacts(): UseContactsReturn {
  const [data, setData] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllContacts();
      if (response.data?.success) {
        const result = response.data.data;
        const list = Array.isArray(result) ? result : (result?.contacts || []);
        setData(list);
        setTotal(result?.total ?? list.length ?? 0);
      } else {
        setError(
          response.data?.message || response.data?.error || "Failed to load contacts"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load contacts"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
}
