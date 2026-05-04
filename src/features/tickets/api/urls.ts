const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ticketUrls = {
  list:        `${baseUrl}/api/v1/admin/tickets`,
  detail:      (id: string) => `${baseUrl}/api/v1/admin/tickets/${id}`,
  updateStatus:(id: string) => `${baseUrl}/api/v1/admin/tickets/${id}/status`,
  assign:      (id: string) => `${baseUrl}/api/v1/admin/tickets/${id}/assign`,
  addComment:  (id: string) => `${baseUrl}/api/v1/admin/tickets/${id}/comments`,
  resolve:     (id: string) => `${baseUrl}/api/v1/admin/tickets/${id}/resolve`,
  close:       (id: string) => `${baseUrl}/api/v1/admin/tickets/${id}/close`,
  statistics:  `${baseUrl}/api/v1/admin/tickets/statistics`,
};
