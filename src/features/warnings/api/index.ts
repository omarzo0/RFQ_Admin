import { authRequests } from "@/shared/api/request";
import { WARNINGS_URLS } from "./urls";
import { CreateWarningPayload, WarningsListResponse, WarningStats } from "../types";

export async function getWarnings(params?: any) {
    return authRequests.get(null, false, WARNINGS_URLS.LIST, params);
}

export async function createWarning(payload: CreateWarningPayload) {
    return authRequests.post(null, false, WARNINGS_URLS.CREATE, payload);
}

export async function resolveWarning(id: string) {
    return authRequests.put(null, false, WARNINGS_URLS.RESOLVE(id), {});
}

export async function deleteWarning(id: string) {
    return authRequests.delete(null, false, WARNINGS_URLS.DELETE(id));
}

export async function getWarningStats() {
    return authRequests.get(null, false, WARNINGS_URLS.STATS);
}
