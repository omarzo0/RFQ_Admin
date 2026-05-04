"use client";

import { useState, useEffect, useCallback } from "react";
import { getTicketManagement } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export interface Ticket {
  id: string;
  subject?: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface TicketStatistics {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  urgentTickets: number;
  highPriorityTickets: number;
  ticketsByCategory: { category: string; count: number }[];
  ticketsByPriority: { priority: string; count: number }[];
  resolutionRate: number;
}

export interface TicketManagementData {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: TicketStatistics;
}

interface UseTicketManagementReturn {
  data: TicketManagementData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTicketManagement(): UseTicketManagementReturn {
  const [data, setData] = useState<TicketManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTicketManagement();
      if (response.data?.success) {
        setData(response.data.data as TicketManagementData);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load ticket management data"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load ticket management data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
