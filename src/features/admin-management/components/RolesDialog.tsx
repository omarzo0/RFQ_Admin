"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Skeleton,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { AdminRole } from "@/features/admin-management/types";

interface Props {
  open: boolean;
  onClose: () => void;
  roles: AdminRole[];
  loading: boolean;
  error: string | null;
}

export default function RolesDialog({ open, onClose, roles, loading, error }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Admin Roles &amp; Permissions</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={40} />
            ))}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && roles.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {roles.map((r) => (
              <Box
                key={r.role}
                sx={{
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {r.name}
                  </Typography>
                  <Chip
                    label={r.role.replace(/_/g, " ")}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", textTransform: "capitalize" }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.8125rem" }}>
                  {r.description}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {r.permissions.map((p) => (
                    <Chip
                      key={p}
                      label={p.replace(/_/g, " ")}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", textTransform: "capitalize" }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {!loading && !error && roles.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No roles defined.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
