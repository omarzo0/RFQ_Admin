import { baseUrl } from "@/shared/api/baseUrl";

export const notificationsUrls = {
    list: `${baseUrl}/api/v1/admin/notifications`,
    create: `${baseUrl}/api/v1/admin/notifications`,
    detail: (id: string) => `${baseUrl}/api/v1/admin/notifications/${id}`,
    delete: (id: string) => `${baseUrl}/api/v1/admin/notifications/${id}`,
};
