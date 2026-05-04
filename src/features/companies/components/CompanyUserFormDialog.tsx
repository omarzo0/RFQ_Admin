"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CompanyUser } from "@/features/companies/types";

const userSchema = z.object({
  email: z.string().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().optional().or(z.literal("")),
});

type UserFormValues = z.infer<typeof userSchema>;

interface CompanyUserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  user?: CompanyUser | null;
  loading: boolean;
  error: string | null;
}

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "EMPLOYEE", label: "Employee" },
];

const CompanyUserFormDialog: React.FC<CompanyUserFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  loading,
  error,
}) => {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        reset({
          email: user.email,
          password: "",
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role || "",
        });
      } else {
        reset({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "",
        });
      }
    }
  }, [open, user, reset]);

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const onFormSubmit = async (data: UserFormValues) => {
    // Validate email & password for create mode
    if (!isEdit) {
      const errs: Record<string, string> = {};
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errs.email = "Valid email is required";
      }
      if (!data.password || data.password.length < 6) {
        errs.password = "Password must be at least 6 characters";
      }
      if (Object.keys(errs).length > 0) {
        setLocalErrors(errs);
        return;
      }
    }
    setLocalErrors({});

    if (isEdit) {
      const { firstName, lastName, role } = data;
      await onSubmit({ firstName, lastName, role });
    } else {
      await onSubmit(data);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? "Edit User" : "Add New User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isEdit
              ? "Update the user details below"
              : "Fill in the details to create a new company user"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                fullWidth
                size="small"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                fullWidth
                size="small"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={loading}
              />
            </Grid>

            {!isEdit && (
              <>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    size="small"
                    type="email"
                    {...register("email")}
                    error={!!localErrors.email}
                    helperText={localErrors.email}
                    disabled={loading}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Password"
                    fullWidth
                    size="small"
                    type="password"
                    {...register("password")}
                    error={!!localErrors.password}
                    helperText={localErrors.password}
                    disabled={loading}
                  />
                </Grid>
              </>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Role"
                fullWidth
                size="small"
                select
                defaultValue={user?.role || ""}
                {...register("role")}
                error={!!errors.role}
                helperText={errors.role?.message}
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Select role</em>
                </MenuItem>
                {ROLE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", minWidth: 120 }}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CompanyUserFormDialog;
