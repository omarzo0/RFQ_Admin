"use client";

import { useState, useEffect, useCallback } from "react";
import { getTicketStatistics } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { TicketStatisticsResponse } from "@/features/tickets/types";

export function useTicketStatistics() {
  const [data, setData] = useState<TicketStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTicketStatistics();
      if (response.data?.success) {
        setData(response.data.data as TicketStatisticsResponse);
      } else {
        setError(response.data?.message || "Failed to load ticket statistics");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load ticket statistics"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
