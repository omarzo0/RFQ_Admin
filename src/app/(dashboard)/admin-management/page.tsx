"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Skeleton,
  Alert,
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
  TextField,
  InputAdornment,
  Button,
  Switch,
} from "@mui/material";
import {
  AdminPanelSettingsRounded,
  RefreshRounded,
  VisibilityRounded,
  SearchRounded,
  EditRounded,
  DeleteRounded,
  LockResetRounded,
  PersonAddRounded,
  SecurityRounded,
  CheckCircleRounded,
  BlockRounded,
} from "@mui/icons-material";
import {
  useAdmins,
  useAdminDetail,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
  useChangePassword,
  useToggleAdminStatus,
  useAdminRoles,
  useAdminActivity,
} from "@/features/admin-management/hooks";
import AdminDetailDialog from "@/features/admin-management/components/AdminDetailDialog";
import CreateAdminDialog from "@/features/admin-management/components/CreateAdminDialog";
import UpdateAdminDialog from "@/features/admin-management/components/UpdateAdminDialog";
import DeleteAdminDialog from "@/features/admin-management/components/DeleteAdminDialog";
import ChangePasswordDialog from "@/features/admin-management/components/ChangePasswordDialog";
import RolesDialog from "@/features/admin-management/components/RolesDialog";
import type { Admin, CreateAdminData, UpdateAdminData } from "@/features/admin-management/types";
import toast from "react-hot-toast";

/* ──────────────── Helpers ──────────────── */

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

function RoleChip({ role }: { role: string }) {
  const r = (role || "").toLowerCase();
  let color: "error" | "primary" | "info" | "default" = "default";
  if (r === "super_admin") color = "error";
  else if (r === "admin") color = "primary";
  else if (r === "support") color = "info";
  return (
    <Chip
      label={(role || "—").replace(/_/g, " ")}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
    />
  );
}

function StatusChip({ active }: { active: boolean }) {
  return (
    <Chip
      label={active ? "Active" : "Inactive"}
      size="small"
      color={active ? "success" : "default"}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
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

/* ──────── Stat Card ──────── */

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
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function AdminManagementPage() {
  /* ─── List State ─── */
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  const { admins, pagination, loading, error, refetch } = useAdmins({
    page,
    limit,
    role: role || undefined,
    isActive: isActive || undefined,
    search: search || undefined,
  });

  /* ─── Roles ─── */
  const { roles, loading: rolesLoading, error: rolesError } = useAdminRoles();
  const [rolesOpen, setRolesOpen] = useState(false);

  /* ─── Detail ─── */
  const [viewId, setViewId] = useState<string | null>(null);
  const { data: detail, loading: detailLoading, error: detailError } = useAdminDetail(viewId);
  const [activityPage, setActivityPage] = useState(1);
  const {
    activities,
    pagination: activityPagination,
    loading: activityLoading,
  } = useAdminActivity(viewId, { page: activityPage, limit: 10 });

  /* ─── Create ─── */
  const [createOpen, setCreateOpen] = useState(false);
  const { create, loading: creating } = useCreateAdmin();

  /* ─── Update ─── */
  const [editTarget, setEditTarget] = useState<Admin | null>(null);
  const { update, loading: updating } = useUpdateAdmin();

  /* ─── Delete ─── */
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { remove, loading: deleting } = useDeleteAdmin();

  /* ─── Change Password ─── */
  const [passwordTarget, setPasswordTarget] = useState<{ id: string; name: string } | null>(null);
  const { changePassword, loading: changingPassword } = useChangePassword();

  /* ─── Toggle Status ─── */
  const { toggle, loading: toggling } = useToggleAdminStatus();

  /* ─── Search ─── */
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  /* ─── Create Handler ─── */
  const handleCreate = useCallback(
    async (data: CreateAdminData) => {
      const result = await create(data);
      if (result) {
        toast.success("Admin created successfully");
        refetch();
        return true;
      }
      toast.error("Failed to create admin");
      return false;
    },
    [create, refetch]
  );

  /* ─── Update Handler ─── */
  const handleUpdate = useCallback(
    async (data: UpdateAdminData) => {
      if (!editTarget) return false;
      const result = await update(editTarget.id, data);
      if (result) {
        toast.success("Admin updated successfully");
        refetch();
        return true;
      }
      toast.error("Failed to update admin");
      return false;
    },
    [editTarget, update, refetch]
  );

  /* ─── Delete Handler ─── */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return false;
    const result = await remove(deleteTarget.id);
    if (result) {
      toast.success("Admin deleted successfully");
      setDeleteTarget(null);
      refetch();
      return true;
    }
    toast.error("Failed to delete admin");
    return false;
  }, [deleteTarget, remove, refetch]);

  /* ─── Change Password Handler ─── */
  const handleChangePassword = useCallback(
    async (newPassword: string) => {
      if (!passwordTarget) return false;
      const result = await changePassword(passwordTarget.id, { newPassword });
      if (result) {
        toast.success("Password changed successfully");
        return true;
      }
      toast.error("Failed to change password");
      return false;
    },
    [passwordTarget, changePassword]
  );

  /* ─── Toggle Status Handler ─── */
  const handleToggleStatus = useCallback(
    async (admin: Admin) => {
      const result = await toggle(admin.id, !admin.isActive);
      if (result) {
        toast.success(`Admin ${admin.isActive ? "deactivated" : "activated"} successfully`);
        refetch();
      } else {
        toast.error("Failed to update admin status");
      }
    },
    [toggle, refetch]
  );

  /* Computed stats from the list */
  const totalAdmins = pagination?.total ?? admins.length;
  const activeAdmins = admins.filter((a) => a.isActive).length;
  const superAdmins = admins.filter((a) => a.role === "super_admin").length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Admin Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create, update, and manage admin users, roles, and permissions.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<SecurityRounded />}
            onClick={() => setRolesOpen(true)}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            View Roles
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddRounded />}
            onClick={() => setCreateOpen(true)}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Create Admin
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, lg: 3 }}>
          <StatCard
            title="Total Admins"
            value={totalAdmins}
            icon={<AdminPanelSettingsRounded />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 3 }}>
          <StatCard
            title="Active"
            value={activeAdmins}
            icon={<CheckCircleRounded />}
            color="#16a34a"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 3 }}>
          <StatCard
            title="Super Admins"
            value={superAdmins}
            icon={<SecurityRounded />}
            color="#ef4444"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 3 }}>
          <StatCard
            title="Roles Available"
            value={roles.length}
            icon={<SecurityRounded />}
            color="#7c3aed"
            loading={rolesLoading}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search by name or email…"
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
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => { setRole(e.target.value); setPage(1); }}
            >
              <MenuItem value="">All</MenuItem>
              {roles.length > 0
                ? roles.map((r) => (
                    <MenuItem key={r.role} value={r.role}>
                      {r.name}
                    </MenuItem>
                  ))
                : ["super_admin", "admin", "support"].map((r) => (
                    <MenuItem key={r} value={r}>
                      {r.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={isActive}
              label="Status"
              onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
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
        ) : admins.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
            No admins found.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                        {a.firstName} {a.lastName}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>{a.email}</TableCell>
                      <TableCell><RoleChip role={a.role} /></TableCell>
                      <TableCell><StatusChip active={a.isActive} /></TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(a.lastLogin)}</TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(a.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end", alignItems: "center" }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => { setViewId(a.id); setActivityPage(1); }}>
                              <VisibilityRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => setEditTarget(a)}>
                              <EditRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Change Password">
                            <IconButton size="small" onClick={() => setPasswordTarget({ id: a.id, name: `${a.firstName} ${a.lastName}` })}>
                              <LockResetRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={a.isActive ? "Deactivate" : "Activate"}>
                            <Switch
                              size="small"
                              checked={a.isActive}
                              onChange={() => handleToggleStatus(a)}
                              disabled={toggling || a.role === "super_admin"}
                              sx={{ mx: 0.25 }}
                            />
                          </Tooltip>
                          {a.role !== "super_admin" && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteTarget({ id: a.id, name: `${a.firstName} ${a.lastName}` })}
                              >
                                <DeleteRounded sx={{ fontSize: 18 }} />
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

            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* ─── Dialogs ─── */}
      <AdminDetailDialog
        open={!!viewId}
        onClose={() => setViewId(null)}
        data={detail}
        loading={detailLoading}
        error={detailError}
        activities={activities}
        activityPagination={activityPagination}
        activityLoading={activityLoading}
        activityPage={activityPage}
        onActivityPageChange={setActivityPage}
      />
      <CreateAdminDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
        roles={roles}
      />
      <UpdateAdminDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        loading={updating}
        roles={roles}
        admin={editTarget}
      />
      <DeleteAdminDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        adminName={deleteTarget?.name}
      />
      <ChangePasswordDialog
        open={!!passwordTarget}
        onClose={() => setPasswordTarget(null)}
        onSubmit={handleChangePassword}
        loading={changingPassword}
        adminName={passwordTarget?.name}
      />
      <RolesDialog
        open={rolesOpen}
        onClose={() => setRolesOpen(false)}
        roles={roles}
        loading={rolesLoading}
        error={rolesError}
      />
    </Box>
  );
}
