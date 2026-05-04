"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "@/shared/components/layout/Header";
import Sidebar, { SIDEBAR_WIDTH } from "@/shared/components/layout/Sidebar";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch — render nothing until client mounts
  if (!mounted) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.100" }}>
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              mt: "64px",
              p: 3,
              overflow: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
