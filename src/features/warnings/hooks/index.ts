import { useState, useEffect, useCallback } from "react";
import { getWarnings, createWarning, resolveWarning, deleteWarning, getWarningStats } from "../api";
import { extractApiError } from "@/shared/utils/extractApiError";
import { WarningsListResponse, CreateWarningPayload, WarningStats } from "../types";

export function useWarnings(params?: any) {
    const [data, setData] = useState<WarningsListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getWarnings(params);
            if (response.data?.success) {
                setData(response.data.data);
            } else {
                setError(response.data?.message || response.data?.error || "Failed to load warnings");
            }
        } catch (err: unknown) {
            setError(extractApiError(err, "Failed to load warnings"));
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

export function useCreateWarning() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (payload: CreateWarningPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createWarning(payload);
            if (response.data?.success) {
                return response.data.data;
            } else {
                const apiError = response.data?.message || response.data?.error || "Failed to issue warning";
                throw new Error(apiError);
            }
        } catch (err: unknown) {
            const msg = extractApiError(err, "Failed to issue warning");
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}

export function useWarningActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resolve = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await resolveWarning(id);
            if (!response.data?.success) {
                throw new Error(response.data?.message || response.data?.error || "Failed to resolve warning");
            }
            return response.data.data;
        } catch (err: unknown) {
            const msg = extractApiError(err, "Failed to resolve warning");
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteWarning(id);
            if (!response.data?.success) {
                throw new Error(response.data?.message || response.data?.error || "Failed to delete warning");
            }
            return response.data.data;
        } catch (err: unknown) {
            const msg = extractApiError(err, "Failed to delete warning");
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { resolve, remove, loading, error };
}

export function useWarningStats() {
    const [stats, setStats] = useState<WarningStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getWarningStats();
            if (response.data?.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch warning stats:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}
