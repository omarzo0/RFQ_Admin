"use client";

import { useState, useEffect, useCallback } from "react";
import { getNotifications, createNotification } from "../api";
import { extractApiError } from "@/shared/utils/extractApiError";
import { NotificationsListResponse, CreateNotificationPayload } from "../types";

export function useNotifications(params?: {
    page?: number;
    limit?: number;
    search?: string;
    audience?: string;
    companyId?: string;
}) {
    const [data, setData] = useState<NotificationsListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getNotifications(params);
            if (response.data?.success) {
                setData(response.data.data);
            } else {
                setError(response.data?.message || response.data?.error || "Failed to load notifications");
            }
        } catch (err: unknown) {
            console.error("Notifications fetch error:", err);
            setError(extractApiError(err, "Failed to load notifications"));
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

export function useCreateNotification() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (payload: CreateNotificationPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createNotification(payload);
            if (response.data?.success) {
                return response.data.data;
            } else {
                const apiError = response.data?.message || response.data?.error || "Failed to create notification";
                throw new Error(apiError);
            }
        } catch (err: unknown) {
            console.error("Notification creation error:", err);
            const msg = extractApiError(err, "Failed to create notification");
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}
