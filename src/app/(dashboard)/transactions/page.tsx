"use client";

import React, { useState, useCallback } from "react";
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
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  ReceiptRounded,
  TrendingUpRounded,
  AttachMoneyRounded,
  PeopleRounded,
  RefreshRounded,
  FileDownloadRounded,
  VisibilityRounded,
  SearchRounded,
  ReplayRounded,
  ErrorOutlineRounded,
  BarChartRounded,
  SummarizeRounded,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
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
  useTransactions,
  useTransactionAnalytics,
  useTransactionSummary,
  useFailedTransactions,
  useTransactionDetail,
  useRetryTransaction,
  useExportTransactions,
} from "@/features/transactions/hooks";
import TransactionDetailDialog from "@/features/transactions/components/TransactionDetailDialog";
import RetryTransactionDialog from "@/features/transactions/components/RetryTransactionDialog";
import toast from "react-hot-toast";

/* ──────────────── Helpers ──────────────── */

const PIE_COLORS = ["#16a34a", "#ef4444", "#f59e0b", "#1976d2", "#7c3aed", "#ec4899", "#0891b2", "#14b8a6"];

function formatCents(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

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

function formatDateTime(d: unknown): string {
  if (!d) return "—";
  try {
    return new Date(d as string).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (["succeeded", "successful"].includes(s)) color = "success";
  else if (["pending", "processing"].includes(s)) color = "warning";
  else if (["failed", "error", "canceled"].includes(s)) color = "error";
  else if (["refunded"].includes(s)) color = "info";
  return (
    <Chip
      label={status || "—"}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
    />
  );
}

function TypeChip({ type }: { type: string }) {
  return (
    <Chip
      label={type?.replace(/_/g, " ") || "—"}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
    />
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
        {growth !== undefined && (
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{
              color: Number(growth) >= 0 ? "success.main" : "error.main",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
            }}
          >
            {Number(growth) >= 0 ? "▲" : "▼"} {Math.abs(Number(growth)).toFixed(1)}%
          </Typography>
        )}
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
   TAB 0 — ALL TRANSACTIONS  (API 1 + 2)
   ═══════════════════════════════════════════ */

function TransactionsListTab() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  const {
    transactions,
    pagination,
    summary,
    loading,
    error,
    refetch,
  } = useTransactions({
    page,
    limit,
    status: status || undefined,
    type: type || undefined,
    search: search || undefined,
  });

  const [viewId, setViewId] = useState<string | null>(null);
  const { data: txDetail, loading: detailLoading, error: detailError } = useTransactionDetail(viewId);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* ─── Summary Cards ─── */}
      {summary && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Amount"
              value={formatCents(summary.totalAmount, summary.currency)}
              icon={<AttachMoneyRounded />}
              color="#16a34a"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Transactions"
              value={summary.totalTransactions}
              icon={<ReceiptRounded />}
              color="#1976d2"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Successful"
              value={summary.successfulTransactions}
              icon={<ReceiptRounded />}
              color="#16a34a"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Failed"
              value={summary.failedTransactions}
              icon={<ErrorOutlineRounded />}
              color="#ef4444"
              loading={loading}
            />
          </Grid>
        </Grid>
      )}

      {/* ─── Filters ─── */}
      <Paper
        elevation={0}
        sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search transactions…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{ minWidth: 220, flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 20, color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="succeeded">Succeeded</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="canceled">Canceled</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={(e) => { setType(e.target.value); setPage(1); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="subscription">Subscription</MenuItem>
              <MenuItem value="one_time">One-time</MenuItem>
              <MenuItem value="refund">Refund</MenuItem>
              <MenuItem value="setup">Setup</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={refetch}>
              <RefreshRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* ─── Transactions Table ─── */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
        {loading ? (
          <Box>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 0.5, borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No transactions found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell sx={{ fontSize: "0.8125rem", maxWidth: 200 }}>
                          <Typography variant="body2" noWrap sx={{ fontSize: "0.8125rem" }}>
                            {tx.description || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{tx.companyName}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{formatCents(tx.amount, tx.currency)}</TableCell>
                        <TableCell><StatusChip status={tx.status} /></TableCell>
                        <TableCell><TypeChip type={tx.type} /></TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(tx.createdAt)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="View details">
                            <IconButton size="small" color="primary" onClick={() => setViewId(tx.id)}>
                              <VisibilityRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
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

      {/* Detail Dialog */}
      <TransactionDetailDialog
        open={!!viewId}
        onClose={() => setViewId(null)}
        data={txDetail}
        loading={detailLoading}
        error={detailError}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 1 — ANALYTICS  (API 3)
   ═══════════════════════════════════════════ */

function AnalyticsTab() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error, refetch } = useTransactionAnalytics(period);

  const overview = data?.overview;
  const trends = data?.trends ?? [];
  const byStatus = data?.byStatus ?? [];
  const byType = data?.byType ?? [];
  const topCompanies = data?.topCompanies ?? [];

  return (
    <>
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

      {/* ─── Overview Cards ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Transactions"
            value={overview?.totalTransactions ?? 0}
            icon={<ReceiptRounded />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Amount"
            value={formatCents(overview?.totalAmount ?? 0, overview?.currency)}
            icon={<AttachMoneyRounded />}
            color="#16a34a"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Success Rate"
            value={`${Number(overview?.successRate ?? 0).toFixed(1)}%`}
            icon={<TrendingUpRounded />}
            color="#7c3aed"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Avg Transaction"
            value={formatCents(overview?.averageTransactionValue ?? 0, overview?.currency)}
            icon={<AttachMoneyRounded />}
            color="#f59e0b"
            loading={loading}
          />
        </Grid>
      </Grid>

      {loading ? (
        <ChartSkeleton />
      ) : (
        <>
          {/* ─── Trends Chart ─── */}
          {trends.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Transaction Trends
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#999" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#999" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#999" tickFormatter={(v) => formatCompact(v)} />
                  <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#1976d2" strokeWidth={2} name="Transactions" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} name="Amount" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          )}

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* By Status Pie */}
            {byStatus.length > 0 && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    By Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={byStatus}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={3}
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {byStatus.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            )}

            {/* By Type Pie */}
            {byType.length > 0 && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    By Type
                  </Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={byType}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={3}
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {byType.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Top Companies */}
          {topCompanies.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Top Companies by Transaction Volume
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Transactions</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Total Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCompanies.map((c, i) => (
                      <TableRow key={c.companyId} hover>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{i + 1}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{c.companyName}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{c.transactionCount}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCents(c.totalAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 2 — SUMMARY  (API 5)
   ═══════════════════════════════════════════ */

function SummaryTab() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error, refetch } = useTransactionSummary(period);

  const counts = data?.transactionCounts;
  const avgValues = data?.averageValues;
  const rates = data?.conversionRates;
  const plans = data?.topPerformingPlans ?? [];

  return (
    <>
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

      {/* ─── Revenue Cards ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCents(data?.totalRevenue ?? 0, data?.currency)}
            icon={<AttachMoneyRounded />}
            color="#16a34a"
            loading={loading}
            growth={data?.revenueGrowth}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Monthly Revenue"
            value={formatCents(data?.monthlyRevenue ?? 0, data?.currency)}
            icon={<TrendingUpRounded />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Transactions"
            value={counts?.total ?? 0}
            icon={<ReceiptRounded />}
            color="#7c3aed"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Payment Success"
            value={`${Number(rates?.paymentSuccess ?? 0).toFixed(1)}%`}
            icon={<TrendingUpRounded />}
            color="#0891b2"
            loading={loading}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 6 }}><ChartSkeleton /></Grid>
          <Grid size={{ xs: 12, lg: 6 }}><ChartSkeleton /></Grid>
        </Grid>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Transaction Counts */}
            {counts && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Transaction Counts
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: "Successful", value: counts.successful, color: "#16a34a" },
                      { label: "Failed", value: counts.failed, color: "#ef4444" },
                      { label: "Pending", value: counts.pending, color: "#f59e0b" },
                      { label: "Total", value: counts.total, color: "#1976d2" },
                    ].map((item) => (
                      <Grid key={item.label} size={{ xs: 6 }}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                          <Typography variant="h5" fontWeight={700} sx={{ color: item.color }}>
                            {item.value.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Conversion Rates */}
            {rates && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Conversion Rates
                  </Typography>
                  {[
                    { label: "Trial to Paid", value: rates.trialToPaid, color: "#16a34a" },
                    { label: "Subscription Retention", value: rates.subscriptionRetention, color: "#1976d2" },
                    { label: "Payment Success", value: rates.paymentSuccess, color: "#7c3aed" },
                  ].map((item) => (
                    <Box key={item.label} sx={{ mb: 2.5, "&:last-child": { mb: 0 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: item.color }}>
                          {Number(item.value).toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(Number(item.value), 100)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "grey.100",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            backgroundColor: item.color,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Paper>
              </Grid>
            )}
          </Grid>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Average Values */}
            {avgValues && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Average Values
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ textAlign: "center", py: 1 }}>
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                          {formatCents(avgValues.transactionValue)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Per Transaction</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ textAlign: "center", py: 1 }}>
                        <Typography variant="h5" fontWeight={700} color="success.main">
                          {formatCents(avgValues.monthlyPerCompany)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Monthly / Company</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ textAlign: "center", py: 1 }}>
                        <Typography variant="h5" fontWeight={700} color="secondary.main">
                          {formatCents(avgValues.lifetimePerCompany)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Lifetime / Company</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Top Plans */}
            {plans.length > 0 && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Top Performing Plans
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Plan</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Revenue</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Txns</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Avg Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {plans.map((p) => (
                          <TableRow key={p.plan} hover>
                            <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "capitalize" }}>{p.plan}</TableCell>
                            <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCents(p.revenue)}</TableCell>
                            <TableCell sx={{ fontSize: "0.8125rem" }}>{p.transactions.toLocaleString()}</TableCell>
                            <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCents(p.averageValue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 3 — FAILED TRANSACTIONS  (API 7 + 8)
   ═══════════════════════════════════════════ */

function FailedTab() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const {
    transactions,
    pagination,
    failureReasons,
    loading,
    error,
    refetch,
  } = useFailedTransactions({ page, limit });

  const { retry, loading: retrying } = useRetryTransaction();

  const [retryTarget, setRetryTarget] = useState<{
    id: string;
    companyName: string;
    amount: string;
  } | null>(null);

  const handleRetry = useCallback(
    async (id: string, reason: string): Promise<boolean> => {
      const result = await retry(id, reason);
      if (result) {
        toast.success(`Transaction retry initiated (attempt #${result.retryAttempt})`);
        refetch();
        return true;
      }
      toast.error("Failed to retry transaction");
      return false;
    },
    [retry, refetch]
  );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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

      {/* ─── Failure Reasons Chart ─── */}
      {!loading && failureReasons.length > 0 && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Failure Reasons
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={failureReasons}
                    dataKey="count"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${(name ?? "").replace(/_/g, " ")} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {failureReasons.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Failure Breakdown
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Reason</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Count</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Share</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {failureReasons.map((r) => (
                      <TableRow key={r.reason} hover>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "capitalize" }}>
                          {r.reason.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{r.count}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{Number(r.percentage).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ─── Failed Transactions Table ─── */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Failed Transactions
        </Typography>

        {loading ? (
          <Box>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 0.5, borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No failed transactions 🎉</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell sx={{ fontSize: "0.8125rem", maxWidth: 180 }}>
                          <Typography variant="body2" noWrap sx={{ fontSize: "0.8125rem" }}>
                            {tx.description || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{tx.companyName}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{formatCents(tx.amount, tx.currency)}</TableCell>
                        <TableCell>
                          <Chip
                            label={tx.failureReason?.replace(/_/g, " ") || "Unknown"}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: "0.7rem", textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDateTime(tx.createdAt)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Retry transaction">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() =>
                                setRetryTarget({
                                  id: tx.id,
                                  companyName: tx.companyName,
                                  amount: formatCents(tx.amount, tx.currency),
                                })
                              }
                            >
                              <ReplayRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
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

      {/* Retry Dialog */}
      <RetryTransactionDialog
        open={!!retryTarget}
        onClose={() => setRetryTarget(null)}
        transactionId={retryTarget?.id ?? null}
        companyName={retryTarget?.companyName ?? ""}
        amount={retryTarget?.amount ?? ""}
        onRetry={handleRetry}
        loading={retrying}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function TransactionsPage() {
  const [tab, setTab] = useState(0);
  const { exportData, exporting } = useExportTransactions();

  const handleExport = useCallback(
    async (format: string) => {
      const result = await exportData({ format });
      if (result?.downloadUrl) {
        window.open(result.downloadUrl, "_blank");
        toast.success("Export started successfully");
      } else {
        toast.error("Failed to export transactions");
      }
    },
    [exportData]
  );

  return (
    <Box>
      {/* ─── Page Header ─── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Transaction management, analytics and reporting
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadRounded />}
            disabled={exporting}
            onClick={() => handleExport("csv")}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadRounded />}
            disabled={exporting}
            onClick={() => handleExport("excel")}
          >
            Excel
          </Button>
        </Stack>
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
        <Tab icon={<ReceiptRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Transactions" />
        <Tab icon={<BarChartRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Analytics" />
        <Tab icon={<SummarizeRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Summary" />
        <Tab icon={<ErrorOutlineRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Failed" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <TransactionsListTab />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <AnalyticsTab />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <SummaryTab />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <FailedTab />
      </TabPanel>
    </Box>
  );
}
