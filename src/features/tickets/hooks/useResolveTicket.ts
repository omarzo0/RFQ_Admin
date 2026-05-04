"use client";

import { useState, useCallback } from "react";
import { resolveTicket as api } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { ResolveTicketData, ResolveTicketResponse } from "@/features/tickets/types";

export function useResolveTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = useCallback(
    async (id: string, data: ResolveTicketData): Promise<ResolveTicketResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, data);
        if (response.data?.success) {
          return response.data.data as ResolveTicketResponse;
        }
        const msg = response.data?.message || "Failed to resolve ticket";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to resolve ticket"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { resolve, loading, error, clearError: () => setError(null) };
}
