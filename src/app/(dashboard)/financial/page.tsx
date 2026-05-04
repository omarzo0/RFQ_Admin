"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Skeleton,
  Alert,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Pagination,
  alpha,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
} from "@mui/material";
import {
  AccountBalanceRounded,
  TrendingUpRounded,
  AttachMoneyRounded,
  PeopleRounded,
  RefreshRounded,
  VisibilityRounded,
  ShowChartRounded,
  PieChartRounded,
  HealthAndSafetyRounded,
  AnalyticsRounded,
  EmojiEventsRounded,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
} from "recharts";
import {
  useFinancialDashboard,
  useFinancialDetails,
  useFinancialAnalytics,
  useRevenueTrends,
  useTopCompanies,
  useFinancialHealth,
  useCompanyFinancial,
} from "@/features/financial/hooks";
import CompanyFinancialDialog from "@/features/financial/components/CompanyFinancialDialog";

/* ──────────────── Helpers ──────────────── */

const PIE_COLORS = ["#1976d2", "#7c3aed", "#0891b2", "#16a34a", "#f59e0b", "#ec4899", "#6366f1", "#14b8a6"];

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompact(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v}`;
}

function formatDate(d: unknown): string {
  if (!d) return "—";
  try {
    return new Date(d as string).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function GrowthBadge({ value }: { value: number }) {
  const num = Number(value);
  const positive = num >= 0;
  return (
    <Typography
      variant="caption"
      fontWeight={600}
      sx={{
        color: positive ? "success.main" : "error.main",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.25,
      }}
    >
      {positive ? "▲" : "▼"} {Math.abs(num).toFixed(1)}%
    </Typography>
  );
}

/* ──────── Skeleton helpers ──────── */

const StatSkeleton = () => (
  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
    <Skeleton variant="rounded" width={44} height={44} sx={{ mb: 2 }} />
    <Skeleton variant="text" width={80} height={36} />
    <Skeleton variant="text" width={120} height={20} />
  </Paper>
);

const ChartSkeleton = () => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
    <Skeleton variant="text" width={140} height={28} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" height={280} />
  </Paper>
);

/* ──────── Stat Card ──────── */

function StatCard({
  title,
  value,
  icon,
  color,
  loading,
  subtitle,
  growth,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
  subtitle?: string;
  growth?: number;
}) {
  if (loading) return <StatSkeleton />;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        height: "100%",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: `0 4px 20px ${alpha(color, 0.12)}` },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            backgroundColor: alpha(color, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </Box>
        {growth !== undefined && <GrowthBadge value={growth} />}
      </Box>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.disabled">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}

/* ──────── Tab Panel ──────── */

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

/* ═══════════════════════════════════════════
   TAB 0 — OVERVIEW  (GET /financial/dashboard + GET /financial)
   ═══════════════════════════════════════════ */

function OverviewTab() {
  const { data: dashboard, loading: dLoading, error: dErr, refetch: refetchDash } = useFinancialDashboard();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { details, pagination, summary: detailSummary, loading: fLoading, error: fErr, refetch: refetchDetails } = useFinancialDetails({ page, limit });
  const [viewCompanyId, setViewCompanyId] = useState<string | null>(null);
  const { data: companyFin, loading: cLoading, error: cErr } = useCompanyFinancial(viewCompanyId);

  const topCompanies = dashboard?.topCompanies ?? [];

  return (
    <>
      {(dErr || fErr) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {dErr && <Typography variant="body2">{dErr}</Typography>}
          {fErr && <Typography variant="body2">{fErr}</Typography>}
        </Alert>
      )}

      {/* ─── Dashboard Stat Cards ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(dashboard?.totalRevenue ?? 0, dashboard?.currency)}
            icon={<AttachMoneyRounded />}
            color="#16a34a"
            loading={dLoading}
            growth={dashboard?.revenueGrowth}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(dashboard?.monthlyRecurringRevenue ?? 0, dashboard?.currency)}
            icon={<TrendingUpRounded />}
            color="#1976d2"
            loading={dLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active Customers"
            value={dashboard?.activeCustomers ?? 0}
            icon={<PeopleRounded />}
            color="#7c3aed"
            loading={dLoading}
            growth={dashboard?.customerGrowth}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Churn Rate"
            value={`${Number(dashboard?.churnRate ?? 0).toFixed(1)}%`}
            icon={<TrendingUpRounded />}
            color="#ef4444"
            loading={dLoading}
          />
        </Grid>
      </Grid>

      {/* ─── Revenue Chart ─── */}
      {dLoading ? (
        <ChartSkeleton />
      ) : (dashboard?.revenueChart?.length ?? 0) > 0 ? (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Revenue Overview
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={dashboard!.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 11 }} stroke="#999" tickFormatter={(v) => formatCompact(v)} />
              <RTooltip formatter={(value) => [formatCurrency(Number(value)), ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
              <Area type="monotone" dataKey="revenue" stroke="#1976d2" fill={alpha("#1976d2", 0.1)} strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      ) : null}

      {/* ─── Top Companies (from dashboard) ─── */}
      {!dLoading && topCompanies.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Top Performers
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Revenue</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Growth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCompanies.map((tp, i) => (
                  <TableRow key={tp.companyId} hover>
                    <TableCell sx={{ fontSize: "0.8125rem" }}>{i + 1}</TableCell>
                    <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{tp.companyName}</TableCell>
                    <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCurrency(tp.revenue)}</TableCell>
                    <TableCell><GrowthBadge value={tp.growth} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ─── Financial Details Table ─── */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Company Financial Details
            </Typography>
            {detailSummary && (
              <Typography variant="caption" color="text.secondary">
                {detailSummary.totalCompanies} companies · {formatCurrency(detailSummary.totalRevenue, detailSummary.currency)} total revenue
              </Typography>
            )}
          </Box>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={() => { refetchDash(); refetchDetails(); }}>
              <RefreshRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {fLoading ? (
          <Box>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 0.5, borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Total Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Monthly</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Transactions</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Success Rate</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Avg Value</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Last Payment</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No financial data available</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    details.map((fd) => {
                      const successRate = fd.totalTransactions > 0
                        ? ((fd.successfulTransactions / fd.totalTransactions) * 100).toFixed(1)
                        : "0.0";
                      return (
                        <TableRow key={fd.id} hover>
                          <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{fd.companyName}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCurrency(fd.totalRevenue, fd.currency)}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCurrency(fd.monthlyRevenue, fd.currency)}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{fd.totalTransactions}</TableCell>
                          <TableCell>
                            <Chip
                              label={`${successRate}%`}
                              size="small"
                              color={Number(successRate) >= 90 ? "success" : Number(successRate) >= 70 ? "warning" : "error"}
                              variant="outlined"
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCurrency(fd.averageTransactionValue, fd.currency)}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(fd.lastPaymentDate)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="View details">
                              <IconButton size="small" color="primary" onClick={() => setViewCompanyId(fd.companyId)}>
                                <VisibilityRounded fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  color="primary"
                  size="small"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Company Financial Dialog */}
      <CompanyFinancialDialog
        open={!!viewCompanyId}
        onClose={() => setViewCompanyId(null)}
        data={companyFin}
        loading={cLoading}
        error={cErr}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 1 — ANALYTICS  (GET /financial/analytics)
   Revenue by plan data is included in this response
   ═══════════════════════════════════════════ */

function AnalyticsTab() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error, refetch } = useFinancialAnalytics(period);

  const revenueByPlan = data?.revenueByPlan ?? [];
  const topPerformers = data?.topPerformers ?? [];

  return (
    <>
      {/* Period selector */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={refetch}>
            <RefreshRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* ─── Analytics Summary Cards ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Revenue Growth"
            value={`${Number(data?.revenueGrowth ?? 0).toFixed(1)}%`}
            icon={<TrendingUpRounded />}
            color="#16a34a"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Customer Lifetime Value"
            value={formatCurrency(data?.customerLifetimeValue ?? 0, data?.currency)}
            icon={<PeopleRounded />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Churn Rate"
            value={`${Number(data?.churnRate ?? 0).toFixed(1)}%`}
            icon={<TrendingUpRounded />}
            color="#ef4444"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="ARPU"
            value={formatCurrency(data?.averageRevenuePerUser ?? 0, data?.currency)}
            icon={<AttachMoneyRounded />}
            color="#f59e0b"
            loading={loading}
            subtitle={`MRR: ${formatCurrency(data?.monthlyRecurringRevenue ?? 0, data?.currency)}`}
          />
        </Grid>
      </Grid>

      {loading ? (
        <ChartSkeleton />
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Revenue by Plan Pie Chart */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Revenue by Plan
              </Typography>
              {revenueByPlan.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={revenueByPlan}
                      dataKey="revenue"
                      nameKey="plan"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={3}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {revenueByPlan.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RTooltip formatter={(value) => [formatCurrency(Number(value)), ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
                  No plan data available
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Revenue by Plan Table */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Plan Breakdown
              </Typography>
              {revenueByPlan.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Plan</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Revenue</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Share</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Subscribers</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenueByPlan.map((p) => (
                        <TableRow key={p.plan} hover>
                          <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "capitalize" }}>{p.plan}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCurrency(p.revenue)}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{Number(p.percentage).toFixed(1)}%</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{p.subscribers}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
                  No plan data available
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ─── Top Performers ─── */}
      {!loading && topPerformers.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Top Performers
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Plan</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Revenue</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Growth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topPerformers.map((tp, i) => (
                  <TableRow key={tp.companyId} hover>
                    <TableCell sx={{ fontSize: "0.8125rem" }}>{i + 1}</TableCell>
                    <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{tp.companyName}</TableCell>
                    <TableCell>
                      <Chip label={tp.plan} size="small" variant="outlined" sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCurrency(tp.revenue)}</TableCell>
                    <TableCell><GrowthBadge value={tp.growth} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 2 — REVENUE TRENDS  (GET /financial/revenue-trends)
   ═══════════════════════════════════════════ */

function RevenueTrendsTab() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error, refetch } = useRevenueTrends(period);

  const trends = data?.trends ?? [];

  return (
    <>
      {/* Period selector */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={refetch}>
            <RefreshRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* ─── Summary Cards ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(data?.totalRevenue ?? 0, data?.currency)}
            icon={<AttachMoneyRounded />}
            color="#16a34a"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Period Revenue"
            value={formatCurrency(data?.periodRevenue ?? 0, data?.currency)}
            icon={<TrendingUpRounded />}
            color="#1976d2"
            loading={loading}
            growth={data?.revenueGrowth}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Revenue Growth"
            value={`${Number(data?.revenueGrowth ?? 0).toFixed(1)}%`}
            icon={<ShowChartRounded />}
            color="#7c3aed"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* ─── Revenue Trend Chart ─── */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Revenue Time Series
              </Typography>
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#999" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#999" tickFormatter={(v) => formatCompact(v)} />
                    <RTooltip formatter={(value) => [formatCurrency(Number(value)), ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#1976d2" fill={alpha("#1976d2", 0.1)} strokeWidth={2} name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
                  No trend data available for this period
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ─── Growth Bar Chart (if growth data exists) ─── */}
      {!loading && trends.length > 0 && trends.some((t) => t.growth !== undefined) && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Monthly Growth
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 11 }} stroke="#999" tickFormatter={(v) => `${v}%`} />
              <RTooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
              <Bar dataKey="growth" radius={[4, 4, 0, 0]} name="Growth">
                {trends.map((entry, idx) => (
                  <Cell key={idx} fill={(entry.growth ?? 0) >= 0 ? "#16a34a" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 3 — HEALTH & TOP COMPANIES
   (GET /financial/health + GET /financial/top-companies)
   ═══════════════════════════════════════════ */

function HealthTab() {
  const { data: health, loading: hLoading, error: hErr, refetch: refetchHealth } = useFinancialHealth();
  const { data: topData, loading: tLoading, error: tErr, refetch: refetchTop } = useTopCompanies();

  const healthColor = (health?.score ?? 0) >= 80 ? "#16a34a" : (health?.score ?? 0) >= 50 ? "#f59e0b" : "#ef4444";
  const topCompanies = topData?.companies ?? [];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={() => { refetchHealth(); refetchTop(); }}>
            <RefreshRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {(hErr || tErr) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {hErr || tErr}
        </Alert>
      )}

      {/* ─── Health Score ─── */}
      {hLoading ? (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}><StatSkeleton /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><StatSkeleton /></Grid>
        </Grid>
      ) : health ? (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Financial Health
            </Typography>
            <Chip
              label={health.status}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                textTransform: "capitalize",
                backgroundColor: alpha(healthColor, 0.1),
                color: healthColor,
                border: `1px solid ${alpha(healthColor, 0.3)}`,
              }}
            />
          </Box>

          {/* Score */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h2" fontWeight={800} sx={{ color: healthColor }}>
              {health.score}
            </Typography>
            <Typography variant="body2" color="text.secondary">Health Score (out of 100)</Typography>
            <Box sx={{ maxWidth: 400, mx: "auto", mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={health.score}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "grey.100",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 6,
                    backgroundColor: healthColor,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Health Metrics */}
          {health.metrics && health.metrics.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {health.metrics.map((m) => {
                const mColor = m.status === "good" ? "#16a34a" : m.status === "warning" ? "#f59e0b" : "#ef4444";
                return (
                  <Grid key={m.name} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: alpha(mColor, 0.3) }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
                          {m.name}
                        </Typography>
                        <Chip
                          label={m.status}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            textTransform: "capitalize",
                            backgroundColor: alpha(mColor, 0.08),
                            color: mColor,
                            height: 22,
                          }}
                        />
                      </Box>
                      <Typography variant="h6" fontWeight={700}>{m.value}</Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Recommendations */}
          {health.recommendations && health.recommendations.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Recommendations
              </Typography>
              {health.recommendations.map((r, i) => {
                const prioColor = r.priority === "high" ? "#ef4444" : r.priority === "medium" ? "#f59e0b" : "#16a34a";
                return (
                  <Paper
                    key={i}
                    variant="outlined"
                    sx={{ p: 2, mb: 1, borderRadius: 2, borderLeft: `4px solid ${prioColor}` }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Chip
                          label={r.type}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500, fontSize: "0.7rem", textTransform: "capitalize", mr: 1 }}
                        />
                        <Typography variant="body2" component="span" sx={{ fontSize: "0.8125rem" }}>
                          {r.message}
                        </Typography>
                      </Box>
                      <Chip
                        label={r.priority}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          textTransform: "capitalize",
                          backgroundColor: alpha(prioColor, 0.08),
                          color: prioColor,
                          height: 22,
                          ml: 1,
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  </Paper>
                );
              })}
            </>
          )}
        </Paper>
      ) : null}

      {/* ─── Top Companies by Revenue ─── */}
      {tLoading ? (
        <ChartSkeleton />
      ) : topCompanies.length > 0 ? (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Top Companies by Revenue
            </Typography>
            {topData?.totalRevenue != null && (
              <Typography variant="caption" color="text.secondary">
                Total: {formatCurrency(topData.totalRevenue, topData?.currency)}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2.5}>
            {/* Bar chart */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <ResponsiveContainer width="100%" height={Math.max(280, topCompanies.length * 48)}>
                <BarChart data={topCompanies} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#999" tickFormatter={(v) => formatCompact(v)} />
                  <YAxis type="category" dataKey="companyName" tick={{ fontSize: 11 }} stroke="#999" width={70} />
                  <RTooltip formatter={(value) => [formatCurrency(Number(value)), ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]} name="Revenue">
                    {topCompanies.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Grid>

            {/* Table */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Revenue</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Share</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCompanies.map((c, i) => (
                      <TableRow key={c.companyId} hover>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{i + 1}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{c.companyName}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCurrency(c.revenue)}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{Number(c.percentage).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      ) : null}
    </>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function FinancialPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      {/* ─── Page Header ─── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Financial
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Revenue overview, analytics, trends and financial health
        </Typography>
      </Box>

      {/* ─── Tabs ─── */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 42 },
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Tab icon={<AccountBalanceRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Overview" />
        <Tab icon={<AnalyticsRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Analytics" />
        <Tab icon={<ShowChartRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Revenue Trends" />
        <Tab icon={<HealthAndSafetyRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Health & Rankings" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <OverviewTab />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <AnalyticsTab />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <RevenueTrendsTab />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <HealthTab />
      </TabPanel>
    </Box>
  );
}
