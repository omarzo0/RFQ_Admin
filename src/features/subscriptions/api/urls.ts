const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const subscriptionUrls = {
  // 1. GET — Paginated list of all subscriptions (with filters)
  getSubscriptions: `${baseUrl}/api/v1/admin/subscriptions`,

  // 2. GET — Single subscription detail
  getSubscription: (id: string) =>
    `${baseUrl}/api/v1/admin/subscriptions/${id}`,

  // 3. PUT — Update subscription
  updateSubscription: (id: string) =>
    `${baseUrl}/api/v1/admin/subscriptions/${id}`,

  // 4. DELETE — Cancel subscription
  cancelSubscription: (id: string) =>
    `${baseUrl}/api/v1/admin/subscriptions/${id}`,

  // 5. GET — Subscription analytics & trends
  getAnalytics: `${baseUrl}/api/v1/admin/subscriptions/analytics`,

  // 6. GET — Trial subscriptions
  getTrials: `${baseUrl}/api/v1/admin/subscriptions/trials`,

  // 7. PUT — Extend trial
  extendTrial: (id: string) =>
    `${baseUrl}/api/v1/admin/subscriptions/${id}/extend-trial`,

  // 8. GET — Subscription statistics
  getStatistics: `${baseUrl}/api/v1/admin/subscriptions/statistics`,
};
