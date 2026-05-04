export type NotificationAudience = "ALL" | "ADMIN_ONLY" | "COMPANY_ONLY";
export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "ANNOUNCEMENT" | "SYSTEM" | "BILLING" | "FEATURE" | "MAINTENANCE";
export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    audience: NotificationAudience;
    isGlobal: boolean;
    companyId?: string | null;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsListResponse {
    notifications: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CreateNotificationPayload {
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    audience: NotificationAudience;
    isGlobal: boolean;
    companyId?: string | null;
    expiresAt?: string | null;
}
