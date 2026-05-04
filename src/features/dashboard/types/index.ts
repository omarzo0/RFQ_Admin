// --- Overview ---
export interface DashboardOverview {
  totalCompanies: number;
  activeCompanies: number;
  trialCompanies: number;
  totalUsers: number;
  activeUsers: number;
  totalRFQs: number;
  totalQuotes: number;
  totalRevenue: number;
}

export interface RecentActivity {
  type: string;
  message: string;
  timestamp: string;
  companyId?: string;
}

export interface MetricItem {
  current: number;
  previous: number;
  growth: number;
  currency?: string;
}

export interface DashboardMetrics {
  revenue: MetricItem;
  companies: MetricItem;
  users: MetricItem;
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
}

export interface CompanyGrowthPoint {
  month: string;
  newCompanies: number;
}

export interface DashboardCharts {
  revenueTrend: RevenueTrendPoint[];
  companyGrowth: CompanyGrowthPoint[];
}

export interface DashboardData {
  overview: DashboardOverview;
  recentActivity: RecentActivity[];
  metrics: DashboardMetrics;
  charts: DashboardCharts;
}

// --- Comprehensive ---
export interface AdminStats {
  totalAdmins: number;
  activeAdmins: number;
  superAdmins: number;
  regularAdmins: number;
  supportAdmins: number;
}

export interface SystemHealth {
  uptime: number;
  status: string;
  responseTime: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface Alert {
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
}

export interface ComprehensiveDashboardData extends DashboardData {
  adminStats: AdminStats;
  systemHealth: SystemHealth;
  alerts: Alert[];
}
