import { authRequests } from "@/shared/api/request";
import { subscriptionUrls } from "./urls";
import type {
  SubscriptionsParams,
  UpdateSubscriptionData,
  CancelSubscriptionData,
  TrialsParams,
  ExtendTrialData,
} from "@/features/subscriptions/types";

/* ──────── 1. GET /subscriptions — paginated list ──────── */
export const getSubscriptions = (params?: SubscriptionsParams) => {
  return authRequests.get(null, false, subscriptionUrls.getSubscriptions, params);
};

/* ──────── 2. GET /subscriptions/:id — detail ──────── */
export const getSubscription = (id: string) => {
  return authRequests.get(null, false, subscriptionUrls.getSubscription(id));
};

/* ──────── 3. PUT /subscriptions/:id — update ──────── */
export const updateSubscription = (id: string, data: UpdateSubscriptionData) => {
  return authRequests.put(null, false, subscriptionUrls.updateSubscription(id), data);
};

/* ──────── 4. DELETE /subscriptions/:id — cancel ──────── */
export const cancelSubscription = (id: string, data: CancelSubscriptionData) => {
  return authRequests.delete(null, false, subscriptionUrls.cancelSubscription(id), data);
};

/* ──────── 5. GET /subscriptions/analytics ──────── */
export const getSubscriptionAnalytics = (params?: { period?: string }) => {
  return authRequests.get(null, false, subscriptionUrls.getAnalytics, params);
};

/* ──────── 6. GET /subscriptions/trials ──────── */
export const getTrialSubscriptions = (params?: TrialsParams) => {
  return authRequests.get(null, false, subscriptionUrls.getTrials, params);
};

/* ──────── 7. PUT /subscriptions/:id/extend-trial ──────── */
export const extendTrial = (id: string, data: ExtendTrialData) => {
  return authRequests.put(null, false, subscriptionUrls.extendTrial(id), data);
};

/* ──────── 8. GET /subscriptions/statistics ──────── */
export const getSubscriptionStatistics = () => {
  return authRequests.get(null, false, subscriptionUrls.getStatistics);
};
