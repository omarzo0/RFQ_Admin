"use client";

import { useState, useEffect, useCallback } from "react";
import { getTickets } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  Ticket,
  TicketPagination,
  TicketsSummary,
  TicketsParams,
} from "@/features/tickets/types";

export function useTickets(params?: TicketsParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const status = params?.status;
  const priority = params?.priority;
  const category = params?.category;
  const assignedTo = params?.assignedTo;
  const companyId = params?.companyId;
  const search = params?.search;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<TicketPagination | null>(null);
  const [summary, setSummary] = useState<TicketsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams: TicketsParams = { page, limit };
      if (status) cleanParams.status = status;
      if (priority) cleanParams.priority = priority;
      if (category) cleanParams.category = category;
      if (assignedTo) cleanParams.assignedTo = assignedTo;
      if (companyId) cleanParams.companyId = companyId;
      if (search) cleanParams.search = search;

      const response = await getTickets(cleanParams);
      if (response.data?.success) {
        const d = response.data.data;
        setTickets(d?.tickets ?? []);
        setPagination(
          d
            ? {
                page: d.pagination?.page ?? d.page,
                limit: d.pagination?.limit ?? d.limit,
                total: d.pagination?.total ?? d.total,
                totalPages: d.pagination?.totalPages ?? d.totalPages,
              }
            : null
        );
        setSummary(d?.summary ?? null);
      } else {
        setError(response.data?.message || "Failed to load tickets");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load tickets"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, priority, category, assignedTo, companyId, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { tickets, pagination, summary, loading, error, refetch: fetch };
}
