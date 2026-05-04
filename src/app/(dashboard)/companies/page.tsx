"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Skeleton,
  Alert,
  Button,
  TextField,
  InputAdornment,
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
} from "@mui/material";
import {
  BusinessRounded,
  GroupRounded,
  RequestQuoteRounded,
  FormatQuoteRounded,
  AddRounded,
  SearchRounded,
  VisibilityRounded,
  EditRounded,
  DeleteRounded,
  RestoreRounded,
  RefreshRounded,
} from "@mui/icons-material";
import {
  useCompanyDashboardStats,
  useCompanies,
  useCompanyDetail,
  useCompanyMutations,
} from "@/features/companies/hooks";
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/features/companies/types";
import CompanyFormDialog from "@/features/companies/components/CompanyFormDialog";
import CompanyDetailDialog from "@/features/companies/components/CompanyDetailDialog";
import ConfirmDialog from "@/features/companies/components/ConfirmDialog";
import toast from "react-hot-toast";

/* ─── Helpers ─── */

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (["active", "healthy"].includes(s)) color = "success";
  else if (["pending", "trial", "processing"].includes(s)) color = "warning";
  else if (["failed", "error", "rejected", "expired", "inactive"].includes(s)) color = "error";
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

/* ─── Stat Card (inline) ─── */

function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}
      >
        <Skeleton variant="rounded" width={44} height={44} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={80} height={36} />
        <Skeleton variant="text" width={120} height={20} />
      </Paper>
    );
  }

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
      </Box>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {title}
      </Typography>
    </Paper>
  );
}

/* ═══════════════════════════════════════════
   COMPANIES PAGE
   ═══════════════════════════════════════════ */

export default function CompaniesPage() {
  /* ── State ── */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<Company | null>(null);

  /* ── Hooks ── */
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useCompanyDashboardStats();
  const { companies, pagination, loading: listLoading, error: listError, refetch: refetchList } = useCompanies({
    page,
    limit,
    search,
    status: statusFilter,
  });
  const { company: editCompany, loading: editLoading, error: editError } = useCompanyDetail(editId);
  const { company: detailCompany, loading: detailLoading, error: detailError } = useCompanyDetail(detailId);
  const mutations = useCompanyMutations();

  /* ── Handlers ── */
  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleRefresh = () => {
    refetchStats();
    refetchList();
  };

  // Create
  const handleOpenCreate = () => {
    setEditId(null);
    mutations.clearError();
    setFormOpen(true);
  };

  // Edit
  const handleOpenEdit = (company: Company) => {
    setEditId(company.id);
    mutations.clearError();
    setFormOpen(true);
  };

  // Form submit (create or edit)
  const handleFormSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (editCompany) {
        const result = await mutations.update(editCompany.id, data as unknown as UpdateCompanyPayload);
        if (result) {
          toast.success("Company updated successfully");
          setFormOpen(false);
          setEditId(null);
          refetchList();
          refetchStats();
        }
      } else {
        const result = await mutations.create(data as unknown as CreateCompanyPayload);
        if (result) {
          toast.success("Company created successfully");
          setFormOpen(false);
          refetchList();
          refetchStats();
        }
      }
    },
    [editCompany, mutations, refetchList, refetchStats]
  );

  // View detail
  const handleViewDetail = (id: string) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const success = await mutations.remove(deleteTarget.id);
    if (success) {
      toast.success("Company deleted successfully");
      setDeleteTarget(null);
      refetchList();
      refetchStats();
    }
  };

  // Restore
  const handleRestore = async () => {
    if (!restoreTarget) return;
    const success = await mutations.restore(restoreTarget.id);
    if (success) {
      toast.success("Company restored successfully");
      setRestoreTarget(null);
      refetchList();
      refetchStats();
    }
  };

  /* ── Stats cards ── */
  const statCards = [
    { title: "Total Companies", value: stats?.totalCompanies ?? 0, icon: <BusinessRounded />, color: "#1976d2" },
    { title: "Active Companies", value: stats?.activeCompanies ?? 0, icon: <BusinessRounded />, color: "#16a34a" },
    { title: "Total Users", value: stats?.totalUsers ?? 0, icon: <GroupRounded />, color: "#7c3aed" },
    { title: "Total RFQs", value: stats?.totalRFQs ?? 0, icon: <RequestQuoteRounded />, color: "#0891b2" },
    { title: "Total Quotes", value: stats?.totalQuotes ?? 0, icon: <FormatQuoteRounded />, color: "#f59e0b" },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
            Companies
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Manage all companies on the platform.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} size="small">
              <RefreshRounded />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={handleOpenCreate}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Add Company
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((c) => (
          <Grid key={c.title} size={{ xs: 6, sm: 4, lg: 2.4 }}>
            <StatCard {...c} loading={statsLoading} />
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          sx={{ flex: 1, minWidth: 200 }}
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
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="EXPIRED">Expired</MenuItem>
            <MenuItem value="CANCELED">Canceled</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleSearch} sx={{ borderRadius: 2, textTransform: "none" }}>
          Search
        </Button>
      </Paper>

      {/* Error */}
      {listError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {listError}
        </Alert>
      )}

      {/* Table */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid", borderColor: "grey.200", overflow: "hidden" }}
      >
        {/* Table header info */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Companies
          </Typography>
          <Chip
            label={`${pagination?.total ?? 0} total`}
            size="small"
            sx={{ fontWeight: 600, backgroundColor: alpha("#1976d2", 0.08), color: "#1976d2" }}
          />
        </Box>

        {listLoading ? (
          <Box sx={{ p: 2.5 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={48} sx={{ mb: 0.5, borderRadius: 1 }} />
            ))}
          </Box>
        ) : companies.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center", color: "text.disabled" }}>
            <BusinessRounded sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
            <Typography variant="body1">No companies found</Typography>
            <Typography variant="body2" color="text.disabled">
              {search ? "Try adjusting your search criteria" : "Click \"Add Company\" to create one"}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Company", "Email", "Plan", "Status", "Active", "Created", "Actions"].map(
                      (h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            bgcolor: "grey.50",
                            borderBottom: "1px solid",
                            borderColor: "grey.200",
                          }}
                        >
                          {h}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow
                      key={company.id}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 }, cursor: "pointer" }}
                      onClick={() => handleViewDetail(company.id)}
                    >
                      <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 500, py: 1.5 }}>
                        {company.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>{company.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={company.subscriptionPlan}
                          size="small"
                          color={company.subscriptionPlan === "trial" ? "warning" : "info"}
                          variant="outlined"
                          sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={company.subscriptionStatus} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={company.isActive ? "Active" : "Inactive"} />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(company.createdAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => handleViewDetail(company.id)}>
                              <VisibilityRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenEdit(company)}>
                              <EditRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          {company.isActive ? (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteTarget(company)}
                              >
                                <DeleteRounded sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Restore">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => setRestoreTarget(company)}
                              >
                                <RestoreRounded sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "1px solid",
                  borderColor: "grey.100",
                }}
              >
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  color="primary"
                  shape="rounded"
                  size="small"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* ─── Dialogs ─── */}

      {/* Create / Edit */}
      <CompanyFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditId(null);
        }}
        onSubmit={handleFormSubmit}
        company={editCompany}
        loading={editLoading || (editCompany ? mutations.updating : mutations.creating)}
        error={editError || mutations.error}
      />

      {/* Detail */}
      <CompanyDetailDialog
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailId(null);
        }}
        company={detailCompany}
        loading={detailLoading}
        error={detailError}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will deactivate the company. You can restore it later.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={mutations.deleting}
        error={mutations.error}
      />

      {/* Restore Confirm */}
      <ConfirmDialog
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
        title="Restore Company"
        message={`Are you sure you want to restore "${restoreTarget?.name}"? This will reactivate the company.`}
        confirmLabel="Restore"
        confirmColor="success"
        loading={mutations.restoring}
        error={mutations.error}
      />
    </Box>
  );
}
