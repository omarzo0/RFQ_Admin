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
  LinearProgress,
} from "@mui/material";
import {
  SubscriptionsRounded,
  TrendingUpRounded,
  RefreshRounded,
  VisibilityRounded,
  SearchRounded,
  EditRounded,
  CancelRounded,
  BarChartRounded,
  ScienceRounded,
  QueryStatsRounded,
  ExtensionRounded,
  WarningAmberRounded,
  AddRounded,
  DeleteRounded,
  ToggleOnRounded,
  ToggleOffRounded,
  InventoryRounded,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
} from "recharts";
import {
  useSubscriptions,
  useSubscriptionDetail,
  useUpdateSubscription,
  useCancelSubscription,
  useSubscriptionAnalytics,
  useTrialSubscriptions,
  useExtendTrial,
  useSubscriptionStatistics,
} from "@/features/subscriptions/hooks";
import {
  usePlans,
  usePlanDetail,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  useTogglePlanStatus,
} from "@/features/subscription-plans/hooks";
import type { SubscriptionPlan } from "@/features/subscription-plans/types";
import SubscriptionDetailDialog from "@/features/subscriptions/components/SubscriptionDetailDialog";
import UpdateSubscriptionDialog from "@/features/subscriptions/components/UpdateSubscriptionDialog";
import CancelSubscriptionDialog from "@/features/subscriptions/components/CancelSubscriptionDialog";
import ExtendTrialDialog from "@/features/subscriptions/components/ExtendTrialDialog";
import PlanDetailDialog from "@/features/subscription-plans/components/PlanDetailDialog";
import PlanFormDialog from "@/features/subscription-plans/components/PlanFormDialog";
import DeletePlanDialog from "@/features/subscription-plans/components/DeletePlanDialog";
import toast from "react-hot-toast";

/* ──────────────── Helpers ──────────────── */

const PIE_COLORS = ["#16a34a", "#1976d2", "#f59e0b", "#ef4444", "#7c3aed", "#ec4899", "#0891b2", "#14b8a6"];

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

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (s === "ACTIVE") color = "success";
  else if (["TRIAL", "PAST_DUE"].includes(s)) color = "warning";
  else if (["CANCELLED", "UNPAID"].includes(s)) color = "error";
  return (
    <Chip
      label={status || "—"}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
    />
  );
}

function PlanChip({ plan }: { plan: string }) {
  const p = (plan || "").toLowerCase();
  let color: "primary" | "secondary" | "warning" | "default" = "default";
  if (p === "enterprise") color = "secondary";
  else if (p === "premium") color = "primary";
  else if (p === "trial") color = "warning";
  return (
    <Chip
      label={plan || "—"}
      size="small"
      color={color}
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
   TAB 0 — ALL SUBSCRIPTIONS  (API 1 + 2 + 3 + 4)
   ═══════════════════════════════════════════ */

function SubscriptionsListTab() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  /* Fetch real plan names for the update dialog */
  const { plans: allPlans } = usePlans({ page: 1, limit: 100 });
  const planNames = allPlans.map((p) => p.name);

  const {
    subscriptions,
    pagination,
    loading,
    error,
    refetch,
  } = useSubscriptions({ page, limit, status: status || undefined, plan: plan || undefined, search: search || undefined });

  /* Detail */
  const [viewId, setViewId] = useState<string | null>(null);
  const { data: detail, loading: detailLoading, error: detailError } = useSubscriptionDetail(viewId);

  /* Update */
  const [editTarget, setEditTarget] = useState<{
    id: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    trialEndsAt: string | null;
  } | null>(null);
  const { update, loading: updating } = useUpdateSubscription();

  /* Cancel */
  const [cancelTarget, setCancelTarget] = useState<{
    id: string;
    companyName: string;
    plan: string;
  } | null>(null);
  const { cancel, loading: cancelling } = useCancelSubscription();

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleUpdate = useCallback(
    async (data: { subscriptionPlan?: string; subscriptionStatus?: string; trialEndsAt?: string }) => {
      if (!editTarget) return false;
      const result = await update(editTarget.id, data);
      if (result) {
        toast.success("Subscription updated successfully");
        refetch();
        return true;
      }
      toast.error("Failed to update subscription");
      return false;
    },
    [editTarget, update, refetch]
  );

  const handleCancel = useCallback(
    async (reason: string, immediately: boolean) => {
      if (!cancelTarget) return false;
      const result = await cancel(cancelTarget.id, reason, immediately);
      if (result) {
        toast.success("Subscription cancelled successfully");
        setCancelTarget(null);
        refetch();
        return true;
      }
      toast.error("Failed to cancel subscription");
      return false;
    },
    [cancelTarget, cancel, refetch]
  );

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Total count */}
      {pagination && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard title="Total Subscriptions" value={pagination.total} icon={<SubscriptionsRounded />} color="#1976d2" loading={loading} />
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search by company name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{ minWidth: 240, flex: 1 }}
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
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="TRIAL">Trial</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
              <MenuItem value="PAST_DUE">Past Due</MenuItem>
              <MenuItem value="UNPAID">Unpaid</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Plan</InputLabel>
            <Select value={plan} label="Plan" onChange={(e) => { setPlan(e.target.value); setPage(1); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="trial">Trial</MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={refetch}>
              <RefreshRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Table */}
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
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Plan</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Trial Ends</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Users</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No subscriptions found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => (
                      <TableRow key={sub.id} hover>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{sub.name}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{sub.email}</TableCell>
                        <TableCell><PlanChip plan={sub.subscriptionPlan} /></TableCell>
                        <TableCell><StatusChip status={sub.subscriptionStatus} /></TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(sub.trialEndsAt)}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{sub._count?.users ?? 0}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="View details">
                            <IconButton size="small" color="primary" onClick={() => setViewId(sub.id)}>
                              <VisibilityRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() =>
                                setEditTarget({
                                  id: sub.id,
                                  subscriptionPlan: sub.subscriptionPlan,
                                  subscriptionStatus: sub.subscriptionStatus,
                                  trialEndsAt: sub.trialEndsAt,
                                })
                              }
                            >
                              <EditRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {sub.subscriptionStatus !== "CANCELLED" && (
                            <Tooltip title="Cancel">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  setCancelTarget({
                                    id: sub.id,
                                    companyName: sub.name,
                                    plan: sub.subscriptionPlan,
                                  })
                                }
                              >
                                <CancelRounded fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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

      {/* Dialogs */}
      <SubscriptionDetailDialog
        open={!!viewId}
        onClose={() => setViewId(null)}
        data={detail}
        loading={detailLoading}
        error={detailError}
      />
      <UpdateSubscriptionDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        loading={updating}
        plans={planNames}
        initialData={editTarget ?? undefined}
      />
      <CancelSubscriptionDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        companyName={cancelTarget?.companyName ?? ""}
        plan={cancelTarget?.plan ?? ""}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 1 — ANALYTICS  (API 5)
   ═══════════════════════════════════════════ */

function AnalyticsTab() {
  const { data, loading, error, refetch } = useSubscriptionAnalytics();

  const planDist = data?.planDistribution ?? [];
  const revenue = data?.revenue;

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

      {/* Overview Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Total Subscriptions" value={data?.totalSubscriptions ?? 0} icon={<SubscriptionsRounded />} color="#1976d2" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Active" value={data?.activeSubscriptions ?? 0} icon={<SubscriptionsRounded />} color="#16a34a" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Trial" value={data?.trialSubscriptions ?? 0} icon={<ScienceRounded />} color="#f59e0b" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Expired" value={data?.expiredSubscriptions ?? 0} icon={<WarningAmberRounded />} color="#ef4444" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Canceled" value={data?.canceledSubscriptions ?? 0} icon={<CancelRounded />} color="#64748b" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Renewal Rate" value={`${Number(data?.renewalRate ?? 0).toFixed(1)}%`} icon={<TrendingUpRounded />} color="#7c3aed" loading={loading} />
        </Grid>
      </Grid>

      {loading ? (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 6 }}><ChartSkeleton /></Grid>
          <Grid size={{ xs: 12, lg: 6 }}><ChartSkeleton /></Grid>
        </Grid>
      ) : (
        <Grid container spacing={2.5}>
          {/* Revenue Card */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Revenue
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: "Monthly", value: formatCompact(Number(revenue?.monthly ?? 0)), color: "#1976d2" },
                  { label: "Yearly", value: formatCompact(Number(revenue?.yearly ?? 0)), color: "#16a34a" },
                  { label: "Total", value: formatCompact(Number(revenue?.total ?? 0)), color: "#7c3aed" },
                ].map((item) => (
                  <Grid key={item.label} size={{ xs: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                      <Typography variant="h5" fontWeight={700} sx={{ color: item.color }}>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Churn Rate */}
              <Box sx={{ mt: 2.5, p: 2, borderRadius: 2, bgcolor: alpha("#ef4444", 0.04), border: "1px solid", borderColor: alpha("#ef4444", 0.15) }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Churn Rate
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">
                    {Number(data?.churnRate ?? 0).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Plan Distribution */}
          {planDist.length > 0 && (
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Plan Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={planDist}
                      dataKey="count"
                      nameKey="plan"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                      label={({ name, percent }: { name?: string; percent?: number }) =>
                        `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {planDist.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Plan table */}
                <TableContainer sx={{ mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Plan</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Count</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Share</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {planDist.map((p) => (
                        <TableRow key={p.plan} hover>
                          <TableCell sx={{ fontWeight: 600, textTransform: "capitalize", fontSize: "0.8125rem" }}>{p.plan}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{p.count.toLocaleString()}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{Number(p.percentage).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 2 — TRIALS  (API 6 + 7)
   ═══════════════════════════════════════════ */

function TrialsTab() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    subscriptions,
    pagination,
    loading,
    error,
    refetch,
  } = useTrialSubscriptions({ page, limit });

  const { extend, loading: extending } = useExtendTrial();

  const [extendTarget, setExtendTarget] = useState<{
    id: string;
    companyName: string;
    trialEndsAt: string;
  } | null>(null);

  const handleExtend = useCallback(
    async (extensionDays: number, reason: string) => {
      if (!extendTarget) return false;
      const result = await extend(extendTarget.id, extensionDays, reason);
      if (result) {
        toast.success(`Trial extended by ${result.extensionDays} days`);
        refetch();
        return true;
      }
      toast.error("Failed to extend trial");
      return false;
    },
    [extendTarget, extend, refetch]
  );

  /* compute days left from trialEndsAt */
  function getDaysLeft(trialEndsAt: string | null): number {
    if (!trialEndsAt) return 0;
    const diff = new Date(trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard title="Total Trials" value={pagination?.total ?? 0} icon={<ScienceRounded />} color="#1976d2" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Expiring Soon (≤ 7 days)"
            value={subscriptions.filter((s) => {
              const dl = getDaysLeft(s.trialEndsAt);
              return dl > 0 && dl <= 7;
            }).length}
            icon={<WarningAmberRounded />}
            color="#f59e0b"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Expired"
            value={subscriptions.filter((s) => getDaysLeft(s.trialEndsAt) === 0 && s.trialEndsAt).length}
            icon={<CancelRounded />}
            color="#ef4444"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Toolbar */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={refetch}>
              <RefreshRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
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
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Trial Ends</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Days Left</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Users</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No trial subscriptions found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => {
                      const daysLeft = getDaysLeft(sub.trialEndsAt);
                      return (
                        <TableRow key={sub.id} hover>
                          <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{sub.name}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{sub.email}</TableCell>
                          <TableCell><StatusChip status={sub.subscriptionStatus} /></TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(sub.trialEndsAt)}</TableCell>
                          <TableCell>
                            <Chip
                              label={daysLeft === 0 ? "Expired" : `${daysLeft} days`}
                              size="small"
                              color={daysLeft === 0 ? "error" : daysLeft <= 3 ? "error" : daysLeft <= 7 ? "warning" : "default"}
                              variant="outlined"
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{sub._count?.users ?? 0}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(sub.createdAt)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Extend trial">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  setExtendTarget({
                                    id: sub.id,
                                    companyName: sub.name,
                                    trialEndsAt: sub.trialEndsAt ?? "",
                                  })
                                }
                              >
                                <ExtensionRounded fontSize="small" />
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

      {/* Extend Dialog */}
      <ExtendTrialDialog
        open={!!extendTarget}
        onClose={() => setExtendTarget(null)}
        onSubmit={handleExtend}
        loading={extending}
        companyName={extendTarget?.companyName ?? ""}
        currentTrialEnd={extendTarget?.trialEndsAt ?? ""}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 3 — STATISTICS  (API 8)
   ═══════════════════════════════════════════ */

function StatisticsTab() {
  const { data, loading, error, refetch } = useSubscriptionStatistics();

  const revenue = data?.revenue;
  const planDist = data?.planDistribution ?? [];

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

      {/* Overview Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Subscriptions"
            value={data?.totalSubscriptions ?? 0}
            icon={<SubscriptionsRounded />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active"
            value={data?.activeSubscriptions ?? 0}
            icon={<SubscriptionsRounded />}
            color="#16a34a"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Trial"
            value={data?.trialSubscriptions ?? 0}
            icon={<ScienceRounded />}
            color="#f59e0b"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Canceled"
            value={data?.canceledSubscriptions ?? 0}
            icon={<CancelRounded />}
            color="#ef4444"
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
        <Grid container spacing={2.5}>
          {/* Revenue */}
          {revenue && (
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Revenue
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                      <Typography variant="h5" fontWeight={700} color="success.main">
                        {formatCompact(Number(revenue.total))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        {formatCompact(Number(revenue.monthly))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Monthly Revenue</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                      <Typography variant="h5" fontWeight={700} color="secondary.main">
                        {formatCompact(Number(revenue.yearly))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Yearly Revenue</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Rates */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200", height: "100%" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Key Metrics
              </Typography>
              {[
                { label: "Renewal Rate", value: Number(data?.renewalRate ?? 0), color: "#16a34a" },
                { label: "Churn Rate", value: Number(data?.churnRate ?? 0), color: "#ef4444" },
              ].map((item) => (
                <Box key={item.label} sx={{ mb: 3, "&:last-child": { mb: 0 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: item.color }}>
                      {item.value.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(item.value, 100)}
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

              {/* Subscription breakdown */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Breakdown
                </Typography>
                <Grid container spacing={1.5}>
                  {[
                    { label: "Expired", value: data?.expiredSubscriptions ?? 0, color: "#f59e0b" },
                    { label: "Canceled", value: data?.canceledSubscriptions ?? 0, color: "#ef4444" },
                  ].map((item) => (
                    <Grid key={item.label} size={{ xs: 6 }}>
                      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, textAlign: "center" }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: item.color }}>
                          {item.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Plan distribution table */}
          {planDist.length > 0 && (
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Plan Distribution
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Plan</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Count</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Share</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {planDist.map((p) => (
                        <TableRow key={p.plan} hover>
                          <TableCell sx={{ fontWeight: 600, textTransform: "capitalize", fontSize: "0.8125rem" }}>{p.plan}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{p.count}</TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(Number(p.percentage), 100)}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: "grey.100",
                                  "& .MuiLinearProgress-bar": { borderRadius: 3 },
                                }}
                              />
                              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 45, textAlign: "right" }}>
                                {Number(p.percentage).toFixed(1)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 4 — PLANS  (subscription-plans API 1-6)
   ═══════════════════════════════════════════ */

function formatCents(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

function PlansTab() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  const { plans, pagination, loading, error, refetch } = usePlans({
    page,
    limit,
    isActive: activeFilter === "" ? undefined : activeFilter === "true",
    search: search || undefined,
  });

  /* Detail */
  const [viewId, setViewId] = useState<string | null>(null);
  const { data: detail, loading: detailLoading, error: detailError } = usePlanDetail(viewId);

  /* Create / Edit */
  const { create, loading: creating } = useCreatePlan();
  const { update, loading: updating } = useUpdatePlan();
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SubscriptionPlan | null>(null);

  /* Delete */
  const { remove, loading: deleting } = useDeletePlan();
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(null);

  /* Toggle Status */
  const { toggle, loading: toggling } = useTogglePlanStatus();

  const handleCreate = useCallback(
    async (data: { name: string; description: string; priceMonthly: number; priceYearly: number; currency: string; features: Record<string, boolean>; isActive: boolean; maxUsers?: number; maxRFQsPerMonth?: number; maxContacts?: number; maxEmailSendsPerMonth?: number }) => {
      const result = await create(data);
      if (result) {
        toast.success("Plan created successfully");
        refetch();
        return true;
      }
      toast.error("Failed to create plan");
      return false;
    },
    [create, refetch]
  );

  const handleUpdate = useCallback(
    async (data: { name: string; description: string; priceMonthly: number; priceYearly: number; currency: string; features: Record<string, boolean>; isActive: boolean; maxUsers?: number; maxRFQsPerMonth?: number; maxContacts?: number; maxEmailSendsPerMonth?: number }) => {
      if (!editTarget) return false;
      const result = await update(editTarget.id, data);
      if (result) {
        toast.success("Plan updated successfully");
        refetch();
        return true;
      }
      toast.error("Failed to update plan");
      return false;
    },
    [editTarget, update, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return false;
    const ok = await remove(deleteTarget.id);
    if (ok) {
      toast.success("Plan deleted successfully");
      refetch();
      return true;
    }
    toast.error("Failed to delete plan");
    return false;
  }, [deleteTarget, remove, refetch]);

  const handleToggle = useCallback(
    async (plan: SubscriptionPlan) => {
      const ok = await toggle(plan.id, !plan.isActive);
      if (ok) {
        toast.success(`Plan ${plan.isActive ? "deactivated" : "activated"}`);
        refetch();
      } else {
        toast.error("Failed to toggle plan status");
      }
    },
    [toggle, refetch]
  );

  const openCreate = () => {
    setFormMode("create");
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setFormMode("edit");
    setEditTarget(plan);
    setFormOpen(true);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Toolbar */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search plans…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput);
                setPage(1);
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 18, color: "grey.400" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={activeFilter}
              label="Status"
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={refetch}>
              <RefreshRounded fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRounded />}
            onClick={openCreate}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Create Plan
          </Button>
        </Box>
      </Paper>

      {/* Plans Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
        {loading ? (
          <Box>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 0.5, borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Plan Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Monthly</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Yearly</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Features</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No plans found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map((plan) => (
                      <TableRow key={plan.id} hover>
                        <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{plan.name}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCents(Number(plan.priceMonthly), plan.currency)}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatCents(Number(plan.priceYearly), plan.currency)}</TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>
                          {plan.featureSummary ? (
                            <Chip
                              label={`${plan.featureSummary.enabledCount} / ${plan.featureSummary.totalCount}`}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                            />
                          ) : (
                            Object.keys(plan.features).length > 0
                              ? `${Object.values(plan.features).filter(Boolean).length} enabled`
                              : "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={plan.isActive ? "Active" : "Inactive"}
                            size="small"
                            color={plan.isActive ? "success" : "default"}
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(plan.createdAt)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                            <Tooltip title="View details">
                              <IconButton size="small" onClick={() => setViewId(plan.id)}>
                                <VisibilityRounded fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" color="primary" onClick={() => openEdit(plan)}>
                                <EditRounded fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={plan.isActive ? "Deactivate" : "Activate"}>
                              <IconButton
                                size="small"
                                color={plan.isActive ? "warning" : "success"}
                                onClick={() => handleToggle(plan)}
                                disabled={toggling}
                              >
                                {plan.isActive ? <ToggleOffRounded fontSize="small" /> : <ToggleOnRounded fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => setDeleteTarget(plan)}>
                                <DeleteRounded fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
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
      <PlanDetailDialog
        open={!!viewId}
        onClose={() => setViewId(null)}
        data={detail}
        loading={detailLoading}
        error={detailError}
      />

      {/* Create / Edit Dialog */}
      <PlanFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={formMode === "create" ? handleCreate : handleUpdate}
        loading={formMode === "create" ? creating : updating}
        mode={formMode}
        initialData={
          editTarget
            ? {
                name: editTarget.name,
                description: editTarget.description,
                priceMonthly: editTarget.priceMonthly,
                priceYearly: editTarget.priceYearly,
                currency: editTarget.currency,
                features: editTarget.features,
                isActive: editTarget.isActive,
                maxUsers: editTarget.maxUsers,
                maxRFQsPerMonth: editTarget.maxRFQsPerMonth,
                maxContacts: editTarget.maxContacts,
                maxEmailSendsPerMonth: editTarget.maxEmailSendsPerMonth,
              }
            : undefined
        }
      />

      {/* Delete Dialog */}
      <DeletePlanDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        planName={deleteTarget?.name ?? ""}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function SubscriptionsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Subscriptions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage company subscriptions, trials, and track analytics
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 42 },
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Tab icon={<SubscriptionsRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Subscriptions" />
        <Tab icon={<BarChartRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Analytics" />
        <Tab icon={<ScienceRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Trials" />
        <Tab icon={<QueryStatsRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Statistics" />
        <Tab icon={<InventoryRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Plans" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <SubscriptionsListTab />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <AnalyticsTab />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <TrialsTab />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <StatisticsTab />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <PlansTab />
      </TabPanel>
    </Box>
  );
}
