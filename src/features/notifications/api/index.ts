import { authRequests } from "@/shared/api/request";
import { AxiosResponse } from "axios";
import { notificationsUrls } from "./urls";
import { CreateNotificationPayload } from "../types";

const { get: getAuth, post: postAuth, delete: deleteAuth } = authRequests;

export const getNotifications = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    audience?: string;
    companyId?: string;
}): Promise<AxiosResponse> =>
    getAuth(null, false, notificationsUrls.list, params as Record<string, string | number | boolean>);

export const createNotification = (data: CreateNotificationPayload): Promise<AxiosResponse> =>
    postAuth(null, false, notificationsUrls.create, data);

export const deleteNotification = (id: string): Promise<AxiosResponse> =>
    deleteAuth(null, false, notificationsUrls.delete(id));
