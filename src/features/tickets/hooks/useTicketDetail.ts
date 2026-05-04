"use client";

import { useState, useEffect, useCallback } from "react";
import { getTicket } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { TicketDetail } from "@/features/tickets/types";

export function useTicketDetail(id: string | null) {
  const [data, setData] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getTicket(id);
      if (response.data?.success) {
        setData(response.data.data as TicketDetail);
      } else {
        setError(response.data?.message || "Failed to load ticket detail");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load ticket detail"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
