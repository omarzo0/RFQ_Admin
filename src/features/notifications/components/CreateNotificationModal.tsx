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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/shared/store/authStore";
import { CreateNotificationPayload, NotificationAudience, NotificationType, NotificationPriority } from "../types";
import { useCompanyManagement } from "@/features/dashboard/hooks";

const schema = z.object({
    title: z.string().min(1, { error: "Title is required" }),
    message: z.string().min(1, { error: "Message is required" }),
    type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
    audience: z.enum(["ALL", "ADMIN_ONLY", "COMPANY_ONLY", "SPECIFIC_COMPANY"]),
    companyId: z.string().optional().nullable(),
    expiresAt: z.string().optional().nullable(),
}).refine((data) => {
    if (data.audience === "SPECIFIC_COMPANY" && !data.companyId) {
        return false;
    }
    return true;
}, {
    message: "Company is required for specific company audience",
    path: ["companyId"],
});

type FormData = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateNotificationPayload) => Promise<void>;
    loading: boolean;
}

export default function CreateNotificationModal({
    open,
    onClose,
    onSubmit,
    loading,
}: Props) {
    const { user } = useAuthStore();
    console.log("CreateNotificationModal - User Context:", user);
    const isSuperAdmin = user?.role?.toUpperCase() === "SUPER_ADMIN";

    const { data: companyData, loading: companiesLoading } = useCompanyManagement();
    const companies = companyData?.companies || [];

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            message: "",
            type: "INFO",
            priority: "NORMAL",
            audience: "ALL",
            companyId: null,
            expiresAt: null,
        },
    });

    const selectedAudience = watch("audience");

    React.useEffect(() => {
        if (open) {
            reset({
                title: "",
                message: "",
                type: "INFO",
                priority: "NORMAL",
                audience: "ALL",
                companyId: null,
                expiresAt: null,
            });
        }
    }, [open, reset]);

    const handleFormSubmit = async (data: FormData) => {
        // Build payload carefully to avoid sending nulls or invalid types to backend
        const payload: any = {
            title: data.title.trim(),
            message: data.message.trim(),
            type: data.type,
            priority: data.priority,
            audience: data.audience === "SPECIFIC_COMPANY" ? "COMPANY_ONLY" : data.audience,
            isGlobal: data.audience !== "SPECIFIC_COMPANY",
        };

        if (data.audience === "SPECIFIC_COMPANY" && data.companyId) {
            payload.companyId = String(data.companyId);
        }

        if (data.expiresAt) {
            try {
                payload.expiresAt = new Date(data.expiresAt).toISOString();
            } catch (e) {
                console.error("Invalid date:", data.expiresAt);
            }
        }

        console.log("Sending Notification Payload:", payload);

        await onSubmit(payload as CreateNotificationPayload);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>Create Notification</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Title"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                    size="small"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="message"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Message"
                                    error={!!errors.message}
                                    helperText={errors.message?.message}
                                    size="small"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    required
                                />
                            )}
                        />

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Type"
                                        error={!!errors.type}
                                        helperText={errors.type?.message}
                                        size="small"
                                        fullWidth
                                    >
                                        <MenuItem value="INFO">INFO</MenuItem>
                                        <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                                        <MenuItem value="WARNING">WARNING</MenuItem>
                                        <MenuItem value="ERROR">ERROR</MenuItem>
                                        <MenuItem value="ANNOUNCEMENT">ANNOUNCEMENT</MenuItem>
                                        <MenuItem value="SYSTEM">SYSTEM</MenuItem>
                                        <MenuItem value="BILLING">BILLING</MenuItem>
                                        <MenuItem value="FEATURE">FEATURE</MenuItem>
                                        <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Priority"
                                        error={!!errors.priority}
                                        helperText={errors.priority?.message}
                                        size="small"
                                        fullWidth
                                    >
                                        <MenuItem value="LOW">LOW</MenuItem>
                                        <MenuItem value="NORMAL">NORMAL</MenuItem>
                                        <MenuItem value="HIGH">HIGH</MenuItem>
                                        <MenuItem value="URGENT">URGENT</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Box>

                        <Controller
                            name="audience"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Audience"
                                    error={!!errors.audience}
                                    helperText={errors.audience?.message || (!isSuperAdmin ? "Targeted notifications require Super Admin access" : "")}
                                    size="small"
                                    fullWidth
                                >
                                    <MenuItem value="ALL">ALL (Everyone)</MenuItem>
                                    <MenuItem value="ADMIN_ONLY" disabled={!isSuperAdmin}>
                                        ADMIN ONLY {!isSuperAdmin && "(Super Admin only)"}
                                    </MenuItem>
                                    <MenuItem value="COMPANY_ONLY" disabled={!isSuperAdmin}>
                                        COMPANY ONLY {!isSuperAdmin && "(Super Admin only)"}
                                    </MenuItem>
                                    <MenuItem value="SPECIFIC_COMPANY" disabled={!isSuperAdmin}>
                                        SPECIFIC COMPANY {!isSuperAdmin && "(Super Admin only)"}
                                    </MenuItem>
                                </TextField>
                            )}
                        />

                        {selectedAudience === "SPECIFIC_COMPANY" && (
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
                                        value={field.value || ""}
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
                        )}

                        <Box sx={{ sx: { display: "flex", gap: 2 } }}>
                            <Controller
                                name="expiresAt"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Expires At"
                                        type="datetime-local"
                                        error={!!errors.expiresAt}
                                        helperText={errors.expiresAt?.message}
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={field.value || ""}
                                    />
                                )}
                            />
                        </Box>
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
