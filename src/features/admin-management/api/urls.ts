const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const adminMgmtUrls = {
  list:           `${baseUrl}/api/v1/admin/management/admins`,
  create:         `${baseUrl}/api/v1/admin/management/admins`,
  detail:         (id: string) => `${baseUrl}/api/v1/admin/management/admins/${id}`,
  update:         (id: string) => `${baseUrl}/api/v1/admin/management/admins/${id}`,
  delete:         (id: string) => `${baseUrl}/api/v1/admin/management/admins/${id}`,
  changePassword: (id: string) => `${baseUrl}/api/v1/admin/management/admins/${id}/password`,
  toggleStatus:   (id: string) => `${baseUrl}/api/v1/admin/management/admins/${id}/status`,
  roles:          `${baseUrl}/api/v1/admin/management/roles`,
  activity:       (id: string) => `${baseUrl}/api/v1/admin/management/admins/${id}/activity`,
};
