import { authRequests } from "@/shared/api/request";
import { planUrls } from "./urls";
import type {
  PlansParams,
  CreatePlanData,
  UpdatePlanData,
  ToggleStatusData,
  PlanSubscribersParams,
} from "@/features/subscription-plans/types";

/* ──────── 1. GET /subscription-plans — list ──────── */
export const getPlans = (params?: PlansParams) => {
  return authRequests.get(null, false, planUrls.getPlans, params);
};

/* ──────── 2. GET /subscription-plans/:id — detail ──────── */
export const getPlan = (id: string) => {
  return authRequests.get(null, false, planUrls.getPlan(id));
};

/* ──────── 3. POST /subscription-plans — create ──────── */
export const createPlan = (data: CreatePlanData) => {
  return authRequests.post(null, false, planUrls.createPlan, data);
};

/* ──────── 4. PUT /subscription-plans/:id — update ──────── */
export const updatePlan = (id: string, data: UpdatePlanData) => {
  return authRequests.put(null, false, planUrls.updatePlan(id), data);
};

/* ──────── 5. DELETE /subscription-plans/:id — delete ──────── */
export const deletePlan = (id: string) => {
  return authRequests.delete(null, false, planUrls.deletePlan(id), {});
};

/* ──────── 6. PATCH /subscription-plans/:id/status — toggle ──────── */
export const togglePlanStatus = (id: string, data: ToggleStatusData) => {
  return authRequests.put(null, false, planUrls.toggleStatus(id), data);
};

/* ──────── 7. GET /subscription-plans/:id/analytics ──────── */
export const getPlanAnalytics = (id: string, params?: { period?: string }) => {
  return authRequests.get(null, false, planUrls.planAnalytics(id), params);
};

/* ──────── 8. GET /subscription-plans/:id/subscribers ──────── */
export const getPlanSubscribers = (id: string, params?: PlanSubscribersParams) => {
  return authRequests.get(null, false, planUrls.planSubscribers(id), params);
};

/* ──────── 9. GET /subscription-plans/feature-registry ──────── */
export const getFeatureRegistry = () => {
  return authRequests.get(null, false, planUrls.featureRegistry);
};
