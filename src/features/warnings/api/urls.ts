import { baseUrl } from "@/shared/api/baseUrl";

const BASE_URL = `${baseUrl}/api/v1/admin/warnings`;

export const WARNINGS_URLS = {
    LIST: BASE_URL,
    CREATE: BASE_URL,
    STATS: `${BASE_URL}/stats`,
    RESOLVE: (id: string) => `${BASE_URL}/${id}/resolve`,
    DELETE: (id: string) => `${BASE_URL}/${id}`,
};
