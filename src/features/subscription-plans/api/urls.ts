const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const planUrls = {
  // 1. GET — List all subscription plans
  getPlans: `${baseUrl}/api/v1/admin/subscription-plans`,

  // 2. GET — Single plan detail
  getPlan: (id: string) => `${baseUrl}/api/v1/admin/subscription-plans/${id}`,

  // 3. POST — Create plan
  createPlan: `${baseUrl}/api/v1/admin/subscription-plans`,

  // 4. PUT — Update plan
  updatePlan: (id: string) => `${baseUrl}/api/v1/admin/subscription-plans/${id}`,

  // 5. DELETE — Delete plan
  deletePlan: (id: string) => `${baseUrl}/api/v1/admin/subscription-plans/${id}`,

  // 6. PATCH — Toggle plan status
  toggleStatus: (id: string) =>
    `${baseUrl}/api/v1/admin/subscription-plans/${id}/status`,

  // 7. GET — Plan analytics
  planAnalytics: (id: string) =>
    `${baseUrl}/api/v1/admin/subscription-plans/${id}/analytics`,

  // 8. GET — Plan subscribers
  planSubscribers: (id: string) =>
    `${baseUrl}/api/v1/admin/subscription-plans/${id}/subscribers`,

  // 9. GET — Feature registry
  featureRegistry: `${baseUrl}/api/v1/admin/subscription-plans/feature-registry`,
};
