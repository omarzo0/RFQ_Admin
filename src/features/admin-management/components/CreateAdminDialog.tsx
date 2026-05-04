"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AdminRole } from "@/features/admin-management/types";

const schema = z.object({
  email: z.string().email({ error: "Valid email is required" }),
  password: z.string().min(8, { error: "Password must be at least 8 characters" }),
  firstName: z.string().min(1, { error: "First name is required" }),
  lastName: z.string().min(1, { error: "Last name is required" }),
  role: z.string().min(1, { error: "Role is required" }),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  loading: boolean;
  roles: AdminRole[];
}

export default function CreateAdminDialog({
  open,
  onClose,
  onSubmit,
  loading,
  roles,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "admin",
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "admin",
        isActive: true,
      });
    }
  }, [open, reset]);

  const handleFormSubmit = async (data: FormData) => {
    const success = await onSubmit(data);
    if (success) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Create Admin</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  size="small"
                  fullWidth
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  size="small"
                  fullWidth
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  size="small"
                  fullWidth
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  size="small"
                  fullWidth
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Role"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  size="small"
                  fullWidth
                >
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
                </TextField>
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Active"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {loading ? <CircularProgress size={20} /> : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
