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
    Typography,
    Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateWarningPayload } from "../types";
import { useCompanyManagement } from "@/features/dashboard/hooks";

const schema = z.object({
    companyId: z.string().min(1, { error: "Company is required" }),
    title: z.string().min(1, { error: "Title is required" }),
    reason: z.string().min(1, { error: "Reason is required" }),
    severity: z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]),
    category: z.enum(["GENERAL", "PAYMENT", "POLICY_VIOLATION", "SECURITY", "PERFORMANCE", "COMPLIANCE", "ABUSE", "OTHER"]),
    expiresAt: z.string().optional().nullable(),
    actionRequired: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateWarningPayload) => Promise<void>;
    loading: boolean;
}

export default function CreateWarningModal({
    open,
    onClose,
    onSubmit,
    loading,
}: Props) {
    const { data: companyData, loading: companiesLoading } = useCompanyManagement();
    const companies = companyData?.companies || [];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            companyId: "",
            title: "",
            reason: "",
            severity: "MODERATE",
            category: "GENERAL",
            expiresAt: null,
            actionRequired: null,
            notes: null,
        },
    });

    React.useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, reset]);

    const handleFormSubmit = async (data: FormData) => {
        const payload: any = {
            companyId: data.companyId,
            title: data.title.trim(),
            reason: data.reason.trim(),
            severity: data.severity,
            category: data.category,
        };

        if (data.expiresAt) payload.expiresAt = new Date(data.expiresAt).toISOString();
        if (data.actionRequired?.trim()) payload.actionRequired = data.actionRequired.trim();
        if (data.notes?.trim()) payload.notes = data.notes.trim();

        await onSubmit(payload as CreateWarningPayload);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>Issue Company Warning</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2.5} sx={{ pt: 1 }}>
                        <Grid size={12}>
                            <Controller
                                name="companyId"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Select Company"
                                        error={!!errors.companyId}
                                        helperText={errors.companyId?.message}
                                        size="small"
                                        fullWidth
                                        required
                                    >
                                        {companiesLoading ? (
                                            <MenuItem disabled>Loading companies...</MenuItem>
                                        ) : companies.length > 0 ? (
                                            companies.map((c: any) => (
                                                <MenuItem key={c.id} value={c.id}>
                                                    {c.name} ({c.email})
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No companies found</MenuItem>
                                        )}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Warning Title"
                                        placeholder="e.g. Payment Overdue"
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                        size="small"
                                        fullWidth
                                        required
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Controller
                                name="reason"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Reason / Details"
                                        placeholder="Describe the reason for this warning..."
                                        error={!!errors.reason}
                                        helperText={errors.reason?.message}
                                        size="small"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        required
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="severity"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Severity Level"
                                        error={!!errors.severity}
                                        size="small"
                                        fullWidth
                                    >
                                        <MenuItem value="LOW">LOW</MenuItem>
                                        <MenuItem value="MODERATE">MODERATE</MenuItem>
                                        <MenuItem value="HIGH">HIGH</MenuItem>
                                        <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Warning Category"
                                        error={!!errors.category}
                                        size="small"
                                        fullWidth
                                    >
                                        <MenuItem value="GENERAL">GENERAL</MenuItem>
                                        <MenuItem value="PAYMENT">PAYMENT</MenuItem>
                                        <MenuItem value="POLICY_VIOLATION">POLICY VIOLATION</MenuItem>
                                        <MenuItem value="SECURITY">SECURITY</MenuItem>
                                        <MenuItem value="PERFORMANCE">PERFORMANCE</MenuItem>
                                        <MenuItem value="COMPLIANCE">COMPLIANCE</MenuItem>
                                        <MenuItem value="ABUSE">ABUSE</MenuItem>
                                        <MenuItem value="OTHER">OTHER</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="expiresAt"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Expires At (Optional)"
                                        type="datetime-local"
                                        error={!!errors.expiresAt}
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={field.value || ""}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="actionRequired"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Action Required (Optional)"
                                        placeholder="What should the company do?"
                                        error={!!errors.actionRequired}
                                        size="small"
                                        fullWidth
                                        value={field.value || ""}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Internal Notes (Optional)"
                                        placeholder="Private notes for admins..."
                                        size="small"
                                        multiline
                                        rows={2}
                                        fullWidth
                                        value={field.value || ""}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} disabled={loading} sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ borderRadius: 2, minWidth: 100, backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Issue Warning"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
