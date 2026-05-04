"use client";

import React, { useEffect } from "react";
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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Company } from "@/features/companies/types";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  domain: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  timezone: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  // Create-only fields
  subscriptionPlan: z.string().optional().or(z.literal("")),
  subscriptionStatus: z.string().optional().or(z.literal("")),
  trialEndsAt: z.string().optional().or(z.literal("")),
  emailFooter: z.string().optional().or(z.literal("")),
  defaultFollowUpDays: z.string().optional().or(z.literal("")),
  autoFollowUpEnabled: z.boolean().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  company?: Company | null;
  loading: boolean;
  error: string | null;
}

const SUBSCRIPTION_PLANS = [
  { value: "trial", label: "Trial" },
  { value: "basic", label: "Basic" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

const SUBSCRIPTION_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "CANCELLED", label: "Cancelled" },
];

const CompanyFormDialog: React.FC<CompanyFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  company,
  loading,
  error,
}) => {
  const isEdit = !!company;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      domain: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      timezone: "",
      subscriptionPlan: "",
      subscriptionStatus: "",
      trialEndsAt: "",
      emailFooter: "",
      defaultFollowUpDays: "3",
      autoFollowUpEnabled: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (company) {
        reset({
          name: company.name || "",
          email: company.email || "",
          domain: company.domain || "",
          phone: company.phone || "",
          address: company.address || "",
          city: company.city || "",
          country: company.country || "",
          timezone: company.timezone || "",
          isActive: company.isActive ?? true,
        });
      } else {
        reset({
          name: "",
          email: "",
          domain: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          timezone: "",
          subscriptionPlan: "trial",
          subscriptionStatus: "ACTIVE",
          trialEndsAt: "",
          emailFooter: "",
          defaultFollowUpDays: "3",
          autoFollowUpEnabled: true,
        });
      }
    }
  }, [open, company, reset]);

  const handleFormSubmit = async (data: CompanyFormValues) => {
    if (isEdit) {
      // Update only accepts: name, email, domain, phone, address, city, country, timezone, isActive
      const payload: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        domain: data.domain,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        timezone: data.timezone,
        isActive: data.isActive,
      };
      await onSubmit(payload);
    } else {
      // Create sends all fields including subscription & email settings
      const payload: Record<string, unknown> = {
        ...data,
        defaultFollowUpDays: data.defaultFollowUpDays
          ? parseInt(data.defaultFollowUpDays, 10)
          : undefined,
      };
      // Remove edit-only field
      delete payload.isActive;
      await onSubmit(payload);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {isEdit ? "Edit Company" : "Create Company"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
              {error}
            </Alert>
          )}

          {/* Basic Info */}
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Company Name *"
                fullWidth
                size="small"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email *"
                fullWidth
                size="small"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Domain"
                fullWidth
                size="small"
                placeholder="company.com"
                {...register("domain")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                fullWidth
                size="small"
                placeholder="+1234567890"
                {...register("phone")}
              />
            </Grid>
          </Grid>

          {/* Location */}
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Location
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address"
                fullWidth
                size="small"
                {...register("address")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="City"
                fullWidth
                size="small"
                {...register("city")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Country"
                fullWidth
                size="small"
                placeholder="US"
                {...register("country")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Timezone"
                fullWidth
                size="small"
                placeholder="America/New_York"
                {...register("timezone")}
              />
            </Grid>
          </Grid>

          {/* Edit-only: Active Status */}
          {isEdit && (
            <>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Status
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value ?? true}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label="Company Active"
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

          {/* Create-only: Subscription */}
          {!isEdit && (
            <>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Subscription
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Subscription Plan"
                    fullWidth
                    size="small"
                    select
                    defaultValue="trial"
                    {...register("subscriptionPlan")}
                  >
                    {SUBSCRIPTION_PLANS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Subscription Status"
                    fullWidth
                    size="small"
                    select
                    defaultValue="ACTIVE"
                    {...register("subscriptionStatus")}
                  >
                    {SUBSCRIPTION_STATUSES.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Trial Ends At"
                    fullWidth
                    size="small"
                    type="datetime-local"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("trialEndsAt")}
                  />
                </Grid>
              </Grid>

              {/* Email Settings */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Email Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Email Footer"
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    placeholder="Best regards, Company Name"
                    {...register("emailFooter")}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Default Follow-Up Days"
                    fullWidth
                    size="small"
                    type="number"
                    {...register("defaultFollowUpDays")}
                    error={!!errors.defaultFollowUpDays}
                    helperText={errors.defaultFollowUpDays?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                    <Controller
                      name="autoFollowUpEnabled"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value ?? true}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label="Auto Follow-Up Enabled"
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Box sx={{ position: "relative" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ borderRadius: 2, minWidth: 100 }}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
            {loading && (
              <CircularProgress
                size={20}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-10px",
                  marginLeft: "-10px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CompanyFormDialog;
