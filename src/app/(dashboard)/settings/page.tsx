"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  PersonRounded,
  LockRounded,
  SaveRounded,
  EmailRounded,
  BadgeRounded,
  CalendarMonthRounded,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  useProfile,
  useUpdateProfile,
  useUpdatePassword,
} from "@/features/settings/hooks";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

/* ──────── ZOD SCHEMAS ──────── */

const profileSchema = z.object({
  firstName: z.string().min(1, { error: "First name is required" }),
  lastName: z.string().min(1, { error: "Last name is required" }),
  email: z.string().email({ error: "Valid email is required" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Current password is required" }),
    newPassword: z.string().min(8, { error: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { error: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

/* ──────── HELPERS ──────── */

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ──────── PAGE ──────── */

export default function SettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const { profile, loading: profileLoading, error: profileError, refetch } = useProfile();
  const {
    update: updateProfile,
    loading: updateLoading,
    error: updateError,
    clearError: clearUpdateError,
  } = useUpdateProfile();
  const {
    update: updatePassword,
    loading: passwordLoading,
    error: passwordError,
    clearError: clearPasswordError,
  } = useUpdatePassword();

  /* ---- Profile Form ---- */
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: profileDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  useEffect(() => {
    if (profile) {
      resetProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
      });
    }
  }, [profile, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    clearUpdateError();
    const result = await updateProfile(data);
    if (result) {
      toast.success("Profile updated successfully");
      refetch();
    }
  };

  /* ---- Password Form ---- */
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    clearPasswordError();
    const success = await updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    if (success) {
      toast.success("Password updated — redirecting to login…");
      resetPassword();
      setTimeout(() => {
        Cookies.remove("token");
        router.push("/login");
      }, 1500);
    }
  };

  /* ──────── RENDER ──────── */

  if (profileLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (profileError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{profileError}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* ── Header ── */}
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Settings
      </Typography>

      {/* ── Profile Card ── */}
      {profile && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {(profile.firstName?.[0] || "A").toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
                <Chip
                  label={profile.role?.replace(/_/g, " ")}
                  size="small"
                  color="primary"
                  sx={{ textTransform: "capitalize", fontWeight: 600 }}
                />
                <Chip
                  label={profile.isActive ? "Active" : "Inactive"}
                  size="small"
                  color={profile.isActive ? "success" : "default"}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailRounded fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {profile.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BadgeRounded fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Admin ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontFamily: "monospace", fontSize: 12 }}
                  >
                    {profile.id}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonthRounded fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(profile.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonthRounded fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(profile.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* ── Tabs ── */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, "& .MuiTab-root": { fontWeight: 600, textTransform: "none" } }}
      >
        <Tab icon={<PersonRounded />} iconPosition="start" label="Edit Profile" />
        <Tab icon={<LockRounded />} iconPosition="start" label="Change Password" />
      </Tabs>

      {/* ── TAB 0: Edit Profile ── */}
      {tab === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            maxWidth: 600,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Edit Profile
          </Typography>

          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearUpdateError}>
              {updateError}
            </Alert>
          )}

          <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Controller
                name="firstName"
                control={profileControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    error={!!profileErrors.firstName}
                    helperText={profileErrors.firstName?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="lastName"
                control={profileControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    error={!!profileErrors.lastName}
                    helperText={profileErrors.lastName?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="email"
                control={profileControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    error={!!profileErrors.email}
                    helperText={profileErrors.email?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 1 }}>
                <Button
                  variant="outlined"
                  disabled={!profileDirty || updateLoading}
                  onClick={() => {
                    if (profile) {
                      resetProfile({
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        email: profile.email || "",
                      });
                    }
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!profileDirty || updateLoading}
                  startIcon={
                    updateLoading ? <CircularProgress size={18} /> : <SaveRounded />
                  }
                  sx={{ borderRadius: 2, minWidth: 120 }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      )}

      {/* ── TAB 1: Change Password ── */}
      {tab === 1 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            maxWidth: 600,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            After changing your password you will be logged out of all devices.
          </Typography>

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearPasswordError}>
              {passwordError}
            </Alert>
          )}

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Controller
                name="currentPassword"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Password"
                    type="password"
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="newPassword"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    type="password"
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm New Password"
                    type="password"
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword?.message}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  disabled={passwordLoading}
                  startIcon={
                    passwordLoading ? <CircularProgress size={18} /> : <LockRounded />
                  }
                  sx={{ borderRadius: 2, minWidth: 160 }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
}
