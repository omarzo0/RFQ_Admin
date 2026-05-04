"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Tab,
  Tabs,
  Skeleton,
  Alert,
  Paper,
  Chip,
  IconButton,
  Tooltip as MuiTooltip,
} from "@mui/material";
import {
  BusinessRounded,
  GroupRounded,
  RequestQuoteRounded,
  AttachMoneyRounded,
  RefreshRounded,
  CheckCircleRounded,
  InfoRounded,
  AdminPanelSettingsRounded,
  SupportAgentRounded,
  CardMembershipRounded,
  FormatQuoteRounded,
  EmailRounded,
  AnalyticsRounded,
  TrendingUpRounded,
  PeopleRounded,
  StarRounded,
} from "@mui/icons-material";
import StatCard from "@/features/dashboard/components/StatCard";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import CompanyGrowthChart from "@/features/dashboard/components/CompanyGrowthChart";
import RecentActivityList from "@/features/dashboard/components/RecentActivityList";
import DataTable from "@/features/dashboard/components/DataTable";
import type { Column } from "@/features/dashboard/components/DataTable";
import ManagementCard from "@/features/dashboard/components/ManagementCard";
import {
  useDashboard,
  useAdminManagement,
  useCompanyManagement,
  useTicketManagement,
  useSubscriptionOverview,
  useAnalyticsOverview,
  useSubscriptionAnalytics,
  useEmailAnalytics,
  useRFQAnalytics,
  useQuoteAnalytics,
  useCompanyGrowthAnalytics,
  useRevenueAnalytics,
  useUserActivityAnalytics,
  useEmailPerformance,
  useRFQPerformance,
  useQuotePerformance,
  useTopCompanies,
} from "@/features/dashboard/hooks";
import type { Admin } from "@/features/dashboard/hooks/useAdminManagement";
import type { ManagedCompany } from "@/features/dashboard/hooks/useCompanyManagement";
import type { Subscription } from "@/features/dashboard/hooks/useSubscriptionOverview";

/* ─────────────── Shared UI ─────────────── */

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

const StatSkeleton = () => (
  <Paper
    elevation={0}
    sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}
  >
    <Skeleton variant="rounded" width={44} height={44} sx={{ mb: 2 }} />
    <Skeleton variant="text" width={80} height={36} />
    <Skeleton variant="text" width={120} height={20} />
  </Paper>
);

const ChartSkeleton = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}
  >
    <Skeleton variant="text" width={140} height={28} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" height={280} />
  </Paper>
);

/* ─────────── Helper: Status chip ─────────── */

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (["active", "healthy", "sent", "completed", "accepted", "delivered"].includes(s))
    color = "success";
  else if (["pending", "draft", "trial", "processing"].includes(s))
    color = "warning";
  else if (["failed", "error", "rejected", "expired", "inactive"].includes(s))
    color = "error";
  else if (["info", "new"].includes(s)) color = "info";

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

/* ═══════════════════════════════════════════
   TAB 1 — OVERVIEW  (API 1)
   GET /dashboard
   ═══════════════════════════════════════════ */

function OverviewTab() {
  const { data: dash, loading: dashLoading, error: dashError } = useDashboard();

  const anyLoading = dashLoading;
  const errors = [
    dashError && `Dashboard: ${dashError}`,
  ].filter(Boolean);

  /* ── Skeletons ── */
  if (anyLoading) {
    return (
      <>
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatSkeleton />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ChartSkeleton />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ChartSkeleton />
          </Grid>
        </Grid>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <ChartSkeleton />
          </Grid>
        </Grid>
      </>
    );
  }

  /* ── Data from GET /dashboard ── */
  const overview = dash?.overview;
  const metrics = dash?.metrics;
  const charts = dash?.charts;
  const recentActivity = dash?.recentActivity || [];

  /* ── Stat cards from overview + metrics ── */
  const statCards = [
    {
      title: "Total Companies",
      value: overview?.totalCompanies ?? 0,
      icon: <BusinessRounded />,
      color: "#1976d2",
      growth: metrics?.companies?.growth,
      subtitle: `${overview?.activeCompanies ?? 0} active · ${overview?.trialCompanies ?? 0} trial`,
    },
    {
      title: "Total Users",
      value: overview?.totalUsers ?? 0,
      icon: <GroupRounded />,
      color: "#7c3aed",
      growth: metrics?.users?.growth,
      subtitle: `${overview?.activeUsers ?? 0} active`,
    },
    {
      title: "Total RFQs",
      value: overview?.totalRFQs ?? 0,
      icon: <RequestQuoteRounded />,
      color: "#0891b2",
    },
    {
      title: "Total Revenue",
      value: `$${(overview?.totalRevenue ?? 0).toLocaleString()}`,
      icon: <AttachMoneyRounded />,
      color: "#16a34a",
      growth: metrics?.revenue?.growth,
      subtitle: `${metrics?.revenue?.currency || "USD"} · $${(metrics?.revenue?.current ?? 0).toLocaleString()} current`,
    },
    {
      title: "Total Quotes",
      value: overview?.totalQuotes ?? 0,
      icon: <FormatQuoteRounded />,
      color: "#f59e0b",
    },
    {
      title: "Active Companies",
      value: overview?.activeCompanies ?? 0,
      icon: <CheckCircleRounded />,
      color: "#06b6d4",
      subtitle: `of ${overview?.totalCompanies ?? 0} total`,
    },
    {
      title: "Active Users",
      value: overview?.activeUsers ?? 0,
      icon: <GroupRounded />,
      color: "#8b5cf6",
      subtitle: `of ${overview?.totalUsers ?? 0} total`,
    },
    {
      title: "Trial Companies",
      value: overview?.trialCompanies ?? 0,
      icon: <InfoRounded />,
      color: "#ec4899",
    },
  ];

  return (
    <>
      {/* Errors */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errors.map((e, i) => (
            <Typography key={i} variant="body2">{e}</Typography>
          ))}
        </Alert>
      )}

      {/* ─── Stat Cards (from /dashboard overview + metrics) ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((c) => (
          <Grid key={c.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...c} />
          </Grid>
        ))}
      </Grid>

      {/* ─── Charts (from /dashboard charts) ─── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueChart data={charts?.revenueTrend || []} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivityList activities={recentActivity} />
        </Grid>
      </Grid>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <CompanyGrowthChart data={charts?.companyGrowth || []} />
        </Grid>
      </Grid>


    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 2 — MANAGEMENT  (APIs 4-8 + 9-13)
   GET /dashboard/rfqs
   GET /dashboard/quotes
   GET /dashboard/contacts
   GET /dashboard/shipping-lines
   GET /dashboard/emails
   GET /dashboard/admin-management
   GET /dashboard/company-management
   GET /dashboard/ticket-management
   GET /dashboard/system-features
   GET /dashboard/subscriptions
   ═══════════════════════════════════════════ */

/* Column definitions */
const adminColumns: Column[] = [
  {
    key: "firstName",
    label: "Name",
    render: (_v, row) =>
      `${(row as unknown as Admin).firstName} ${(row as unknown as Admin).lastName}`,
  },
  { key: "email", label: "Email" },
  {
    key: "role",
    label: "Role",
    render: (v) => (
      <Chip
        label={String(v || "").replace(/_/g, " ")}
        size="small"
        color={String(v) === "SUPER_ADMIN" ? "secondary" : "default"}
        variant="outlined"
        sx={{ fontWeight: 500, fontSize: "0.75rem" }}
      />
    ),
  },
  {
    key: "isActive",
    label: "Status",
    render: (v) => <StatusChip status={v ? "Active" : "Inactive"} />,
  },
  {
    key: "lastLoginAt",
    label: "Last Login",
    render: (v) => (v ? formatDate(v) : "Never"),
  },
  { key: "createdAt", label: "Created", render: (v) => formatDate(v) },
];

const companyColumns: Column[] = [
  { key: "name", label: "Company Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  {
    key: "subscriptionPlan",
    label: "Plan",
    render: (v) => (
      <Chip
        label={String(v || "—")}
        size="small"
        color={String(v) === "trial" ? "warning" : "info"}
        variant="outlined"
        sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
      />
    ),
  },
  {
    key: "subscriptionStatus",
    label: "Sub Status",
    render: (v) => <StatusChip status={String(v || "")} />,
  },
  {
    key: "isActive",
    label: "Active",
    render: (v) => <StatusChip status={v ? "Active" : "Inactive"} />,
  },
  {
    key: "userCount",
    label: "Users",
    render: (v) => String(v ?? 0),
  },
  { key: "createdAt", label: "Created", render: (v) => formatDate(v) },
];

const ticketColumns: Column[] = [
  { key: "id", label: "ID", render: (v) => String(v || "—").slice(-8) },
  { key: "subject", label: "Subject" },
  { key: "category", label: "Category" },
  {
    key: "priority",
    label: "Priority",
    render: (v) => (
      <Chip
        label={String(v || "—")}
        size="small"
        color={
          String(v).toLowerCase() === "urgent"
            ? "error"
            : String(v).toLowerCase() === "high"
              ? "warning"
              : "default"
        }
        variant="outlined"
        sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
      />
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (v) => <StatusChip status={String(v || "")} />,
  },
  { key: "createdAt", label: "Created", render: (v) => formatDate(v) },
];

const subscriptionColumns: Column[] = [
  { key: "name", label: "Company" },
  { key: "email", label: "Email" },
  {
    key: "subscriptionPlan",
    label: "Plan",
    render: (v) => (
      <Chip
        label={String(v || "—")}
        size="small"
        color={String(v) === "trial" ? "warning" : "info"}
        variant="outlined"
        sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
      />
    ),
  },
  {
    key: "subscriptionStatus",
    label: "Status",
    render: (v) => <StatusChip status={String(v || "")} />,
  },
  {
    key: "trialEndsAt",
    label: "Trial Ends",
    render: (v) => (v ? formatDate(v) : "—"),
  },
  {
    key: "_count",
    label: "Usage",
    render: (_v, row) => {
      const c = (row as unknown as Subscription)._count;
      if (!c) return "—";
      return `${c.users}U · ${c.rfqs}R · ${c.contacts}C`;
    },
  },
  { key: "createdAt", label: "Created", render: (v) => formatDate(v) },
];

function ManagementTab() {
  /* ── Management hooks (APIs 9-11, 13) ── */
  const { data: adminMgmt, loading: adminL, error: adminE, refetch: refetchAdmin } = useAdminManagement();
  const { data: companyMgmt, loading: companyL, error: companyE, refetch: refetchCompany } = useCompanyManagement();
  const { data: ticketMgmt, loading: ticketL, error: ticketE, refetch: refetchTicket } = useTicketManagement();
  const { data: subOverview, loading: subL, error: subE, refetch: refetchSub } = useSubscriptionOverview();

  const handleRefresh = () => {
    refetchAdmin();
    refetchCompany();
    refetchTicket();
    refetchSub();
  };

  /* ── Admin statistics cards ── */
  const adminStats = adminMgmt?.statistics;
  const adminStatCards = adminStats
    ? [
        { title: "Total Admins", value: adminStats.totalAdmins, color: "#7c3aed" },
        { title: "Active Admins", value: adminStats.activeAdmins, color: "#16a34a" },
        { title: "Inactive Admins", value: adminStats.inactiveAdmins, color: "#dc2626" },
        { title: "Super Admins", value: adminStats.superAdmins, color: "#1976d2" },
        { title: "Regular Admins", value: adminStats.regularAdmins, color: "#f59e0b" },
        { title: "Recent Logins", value: adminStats.recentLogins, color: "#0891b2" },
      ]
    : [];

  /* ── Company subscription stats cards ── */
  const subStats = companyMgmt?.subscriptionStats;
  const companyStatCards = subStats
    ? [
        { title: "Total Companies", value: companyMgmt.pagination.total, color: "#1976d2" },
        { title: "Active Subs", value: subStats.activeSubscriptions, color: "#16a34a" },
        { title: "Trial Subs", value: subStats.trialSubscriptions, color: "#f59e0b" },
        { title: "Expired Subs", value: subStats.expiredSubscriptions, color: "#dc2626" },
        { title: "Churn Rate", value: `${subStats.churnRate}%`, color: "#ec4899" },
        { title: "Renewal Rate", value: `${subStats.renewalRate}%`, color: "#0891b2" },
      ]
    : [];

  return (
    <>
      {/* Refresh */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <MuiTooltip title="Refresh all data">
          <IconButton onClick={handleRefresh} size="small">
            <RefreshRounded />
          </IconButton>
        </MuiTooltip>
      </Box>

      {/* ─── Admin Management (API 9) ─── */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Admin Management
      </Typography>

      {/* Admin Statistics */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {adminL
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatSkeleton />
              </Grid>
            ))
          : adminStatCards.map((c) => (
              <Grid key={c.title} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatCard
                  title={c.title}
                  value={c.value}
                  icon={<AdminPanelSettingsRounded />}
                  color={c.color}
                />
              </Grid>
            ))}
      </Grid>

      {/* Admin Table */}
      <Box sx={{ mb: 4 }}>
        <DataTable
          title="Admins"
          icon={<AdminPanelSettingsRounded sx={{ fontSize: 20 }} />}
          color="#7c3aed"
          columns={adminColumns}
          data={(adminMgmt?.admins ?? []) as unknown as Record<string, unknown>[]}
          total={adminMgmt?.total ?? 0}
          loading={adminL}
          error={adminE}
        />
      </Box>

      {/* ─── Company Management (API 10) ─── */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Company Management
      </Typography>

      {/* Company / Subscription Statistics */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {companyL
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatSkeleton />
              </Grid>
            ))
          : companyStatCards.map((c) => (
              <Grid key={c.title} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatCard
                  title={c.title}
                  value={c.value}
                  icon={<BusinessRounded />}
                  color={c.color}
                />
              </Grid>
            ))}
      </Grid>

      {/* Plan Distribution Chips */}
      {subStats && subStats.planDistribution.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
          {subStats.planDistribution.map((p) => (
            <Chip
              key={p.plan}
              label={`${p.plan}: ${p.count} (${p.percentage}%)`}
              size="small"
              variant="outlined"
              color="info"
              sx={{ fontWeight: 500, textTransform: "capitalize" }}
            />
          ))}
          <Chip
            label={`Monthly Rev: $${subStats.revenue.monthly.toLocaleString()}`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={`Yearly Rev: $${subStats.revenue.yearly.toLocaleString()}`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={`Total Rev: $${subStats.revenue.total.toLocaleString()}`}
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      )}

      {/* Company Table */}
      <Box sx={{ mb: 4 }}>
        <DataTable
          title="Companies"
          icon={<BusinessRounded sx={{ fontSize: 20 }} />}
          color="#1976d2"
          columns={companyColumns}
          data={(companyMgmt?.companies ?? []) as unknown as Record<string, unknown>[]}
          total={companyMgmt?.pagination.total ?? 0}
          loading={companyL}
          error={companyE}
        />
      </Box>

      {/* ─── Ticket Management (API 11) ─── */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Ticket Management
      </Typography>

      {/* Ticket Statistics */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {ticketL
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatSkeleton />
              </Grid>
            ))
          : (ticketMgmt?.statistics
              ? [
                  { title: "Total Tickets", value: ticketMgmt.statistics.totalTickets, color: "#0891b2" },
                  { title: "Open", value: ticketMgmt.statistics.openTickets, color: "#f59e0b" },
                  { title: "In Progress", value: ticketMgmt.statistics.inProgressTickets, color: "#1976d2" },
                  { title: "Resolved", value: ticketMgmt.statistics.resolvedTickets, color: "#16a34a" },
                  { title: "Closed", value: ticketMgmt.statistics.closedTickets, color: "#6b7280" },
                  { title: "Resolution Rate", value: `${ticketMgmt.statistics.resolutionRate}%`, color: "#7c3aed" },
                ]
              : []
            ).map((c) => (
              <Grid key={c.title} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatCard
                  title={c.title}
                  value={c.value}
                  icon={<SupportAgentRounded />}
                  color={c.color}
                />
              </Grid>
            ))}
      </Grid>

      {/* Urgent / High Priority Chips */}
      {ticketMgmt?.statistics && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
          <Chip
            label={`Urgent: ${ticketMgmt.statistics.urgentTickets}`}
            size="small"
            color="error"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={`High Priority: ${ticketMgmt.statistics.highPriorityTickets}`}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      )}

      {/* Ticket Table */}
      <Box sx={{ mb: 4 }}>
        <DataTable
          title="Tickets"
          icon={<SupportAgentRounded sx={{ fontSize: 20 }} />}
          color="#0891b2"
          columns={ticketColumns}
          data={(ticketMgmt?.tickets ?? []) as unknown as Record<string, unknown>[]}
          total={ticketMgmt?.total ?? 0}
          loading={ticketL}
          error={ticketE}
        />
      </Box>

      {/* ─── Subscription Overview (API 13) ─── */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Subscription Overview
      </Typography>

      {/* Subscription Statistics */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {subL
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatSkeleton />
              </Grid>
            ))
          : (subOverview?.statistics
              ? [
                  { title: "Total Subs", value: subOverview.statistics.totalSubscriptions, color: "#f59e0b" },
                  { title: "Active", value: subOverview.statistics.activeSubscriptions, color: "#16a34a" },
                  { title: "Trial", value: subOverview.statistics.trialSubscriptions, color: "#1976d2" },
                  { title: "Expired", value: subOverview.statistics.expiredSubscriptions, color: "#dc2626" },
                  { title: "Churn Rate", value: `${subOverview.statistics.churnRate}%`, color: "#ec4899" },
                  { title: "Renewal Rate", value: `${subOverview.statistics.renewalRate}%`, color: "#0891b2" },
                ]
              : []
            ).map((c) => (
              <Grid key={c.title} size={{ xs: 6, sm: 4, lg: 2 }}>
                <StatCard
                  title={c.title}
                  value={c.value}
                  icon={<CardMembershipRounded />}
                  color={c.color}
                />
              </Grid>
            ))}
      </Grid>

      {/* Subscription Revenue & Plan Chips */}
      {subOverview?.statistics && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
          {subOverview.statistics.planDistribution.map((p) => (
            <Chip
              key={p.plan}
              label={`${p.plan}: ${p.count} (${p.percentage}%)`}
              size="small"
              variant="outlined"
              color="info"
              sx={{ fontWeight: 500, textTransform: "capitalize" }}
            />
          ))}
          <Chip
            label={`Monthly Rev: $${subOverview.statistics.revenue.monthly.toLocaleString()}`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={`Yearly Rev: $${subOverview.statistics.revenue.yearly.toLocaleString()}`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={`Total Rev: $${subOverview.statistics.revenue.total.toLocaleString()}`}
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      )}

      {/* Subscription Table */}
      <Box sx={{ mb: 4 }}>
        <DataTable
          title="Subscriptions"
          icon={<CardMembershipRounded sx={{ fontSize: 20 }} />}
          color="#f59e0b"
          columns={subscriptionColumns}
          data={(subOverview?.subscriptions ?? []) as unknown as Record<string, unknown>[]}
          total={subOverview?.total ?? 0}
          loading={subL}
          error={subE}
        />
      </Box>

    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 3 — ANALYTICS
   Dashboard Analytics (APIs 14-18)
   Admin Analytics   (APIs 21-27)
   ═══════════════════════════════════════════ */

function AnalyticsTab() {
  /* Dashboard analytics (APIs 14-18) */
  const { data: overview, loading: overviewL, error: overviewE, refetch: refetchOverview } = useAnalyticsOverview();
  const { data: subAnalytics, loading: subL, error: subE, refetch: refetchSub } = useSubscriptionAnalytics();
  const { data: emailAnalytics, loading: emailL, error: emailE, refetch: refetchEmail } = useEmailAnalytics();
  const { data: rfqAnalytics, loading: rfqL, error: rfqE, refetch: refetchRFQ } = useRFQAnalytics();
  const { data: quoteAnalytics, loading: quoteL, error: quoteE, refetch: refetchQuote } = useQuoteAnalytics();

  /* Admin analytics (APIs 21-27) */
  const { data: companyGrowth, loading: cgL, error: cgE, refetch: refetchCG } = useCompanyGrowthAnalytics();
  const { data: revenue, loading: revL, error: revE, refetch: refetchRev } = useRevenueAnalytics();
  const { data: userActivity, loading: uaL, error: uaE, refetch: refetchUA } = useUserActivityAnalytics();
  const { data: emailPerf, loading: epL, error: epE, refetch: refetchEP } = useEmailPerformance();
  const { data: rfqPerf, loading: rpL, error: rpE, refetch: refetchRP } = useRFQPerformance();
  const { data: quotePerf, loading: qpL, error: qpE, refetch: refetchQP } = useQuotePerformance();
  const { data: topCompanies, loading: tcL, error: tcE, refetch: refetchTC } = useTopCompanies();

  const handleRefresh = () => {
    refetchOverview();
    refetchSub();
    refetchEmail();
    refetchRFQ();
    refetchQuote();
    refetchCG();
    refetchRev();
    refetchUA();
    refetchEP();
    refetchRP();
    refetchQP();
    refetchTC();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <MuiTooltip title="Refresh analytics">
          <IconButton onClick={handleRefresh} size="small">
            <RefreshRounded />
          </IconButton>
        </MuiTooltip>
      </Box>

      {/* ─── Dashboard Analytics (APIs 14-18) ─── */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Dashboard Analytics
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Analytics Overview"
            icon={<AnalyticsRounded sx={{ fontSize: 20 }} />}
            color="#7c3aed"
            data={overview}
            loading={overviewL}
            error={overviewE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Subscription Analytics"
            icon={<CardMembershipRounded sx={{ fontSize: 20 }} />}
            color="#f59e0b"
            data={subAnalytics}
            loading={subL}
            error={subE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Email Analytics"
            icon={<EmailRounded sx={{ fontSize: 20 }} />}
            color="#ec4899"
            data={emailAnalytics}
            loading={emailL}
            error={emailE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="RFQ Analytics"
            icon={<RequestQuoteRounded sx={{ fontSize: 20 }} />}
            color="#0891b2"
            data={rfqAnalytics}
            loading={rfqL}
            error={rfqE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Quote Analytics"
            icon={<FormatQuoteRounded sx={{ fontSize: 20 }} />}
            color="#16a34a"
            data={quoteAnalytics}
            loading={quoteL}
            error={quoteE}
          />
        </Grid>
      </Grid>

      {/* ─── Performance Analytics (APIs 21-27) ─── */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Performance Analytics
      </Typography>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Company Growth"
            icon={<TrendingUpRounded sx={{ fontSize: 20 }} />}
            color="#1976d2"
            data={companyGrowth}
            loading={cgL}
            error={cgE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Revenue"
            icon={<AttachMoneyRounded sx={{ fontSize: 20 }} />}
            color="#16a34a"
            data={revenue}
            loading={revL}
            error={revE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="User Activity"
            icon={<PeopleRounded sx={{ fontSize: 20 }} />}
            color="#7c3aed"
            data={userActivity}
            loading={uaL}
            error={uaE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Email Performance"
            icon={<EmailRounded sx={{ fontSize: 20 }} />}
            color="#ec4899"
            data={emailPerf}
            loading={epL}
            error={epE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="RFQ Performance"
            icon={<RequestQuoteRounded sx={{ fontSize: 20 }} />}
            color="#0891b2"
            data={rfqPerf}
            loading={rpL}
            error={rpE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Quote Performance"
            icon={<FormatQuoteRounded sx={{ fontSize: 20 }} />}
            color="#f59e0b"
            data={quotePerf}
            loading={qpL}
            error={qpE}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ManagementCard
            title="Top Companies"
            icon={<StarRounded sx={{ fontSize: 20 }} />}
            color="#e11d48"
            data={topCompanies}
            loading={tcL}
            error={tcE}
          />
        </Grid>
      </Grid>
    </>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════ */

export default function DashboardPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Welcome back — here&apos;s what&apos;s happening across your platform.
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: "grey.200",
          mb: 3,
          px: 1,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              minHeight: 48,
              px: 2.5,
            },
            "& .MuiTabs-indicator": { height: 2.5, borderRadius: 2 },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Management" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {/* Content */}
      <TabPanel value={tab} index={0}>
        <OverviewTab />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ManagementTab />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <AnalyticsTab />
      </TabPanel>
    </Box>
  );
}
