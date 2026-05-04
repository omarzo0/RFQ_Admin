// Company types based on API responses

export interface CompanyUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  domain?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt?: string | null;
  emailFooter?: string;
  defaultFollowUpDays?: number;
  autoFollowUpEnabled?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: CompanyUser[];
  _count?: {
    rfqs: number;
    contacts: number;
    shippingLines: number;
  };
  quoteStats?: {
    totalQuotes: number;
    awardedQuotes: number;
    activeQuotes: number;
  };
  planDetails?: {
    name: string;
    maxUsers: number;
    maxRFQsPerMonth: number;
    maxContacts: number;
    maxEmailSendsPerMonth: number;
    features: Record<string, boolean>;
  } | null;
}

export interface CompanyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CompaniesListResponse {
  companies: Company[];
  pagination: CompanyPagination;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  companyName: string;
}

export interface CompanyDashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  totalRFQs: number;
  totalQuotes: number;
  recentActivity: RecentActivity[];
}

export interface CreateCompanyPayload {
  name: string;
  email: string;
  domain?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  trialEndsAt?: string;
  emailFooter?: string;
  defaultFollowUpDays?: number;
  autoFollowUpEnabled?: boolean;
}

export interface UpdateCompanyPayload {
  name?: string;
  email?: string;
  domain?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  isActive?: boolean;
}

// Company User types
export interface CompanyUsersListResponse {
  users: CompanyUser[];
  pagination: CompanyPagination;
}

export interface CreateCompanyUserPayload {
  email: string;
  password: string;
  companyId: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UpdateCompanyUserPayload {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}
