"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  alpha,
  Chip,
} from "@mui/material";
import { LogoutRounded } from "@mui/icons-material";
import { useAuthStore } from "@/shared/store/authStore";
import { SIDEBAR_WIDTH } from "./Sidebar";

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
          {/* Dynamic page title can go here */}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            avatar={
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                {initials}
              </Avatar>
            }
            label={user ? `${user.firstName} ${user.lastName}` : "User"}
            variant="outlined"
            sx={{
              borderColor: "grey.300",
              "& .MuiChip-label": {
                fontWeight: 500,
                fontSize: "0.8125rem",
              },
            }}
          />
          <Button
            size="small"
            variant="text"
            color="inherit"
            startIcon={<LogoutRounded sx={{ fontSize: 18 }} />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": { color: "error.main", backgroundColor: "error.50" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
