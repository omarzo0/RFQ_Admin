"use client";

import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  alpha,
} from "@mui/material";
import {
  DashboardRounded,
  RequestQuoteRounded,
  SettingsRounded,
  BusinessRounded,
  AccountBalanceRounded,
  ReceiptRounded,
  SubscriptionsRounded,
  ConfirmationNumberRounded,
  AdminPanelSettingsRounded,
  NotificationsRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

export const SIDEBAR_WIDTH = 260;

const navItems = [
  { label: "Dashboard", icon: <DashboardRounded />, path: "/dashboard" },
  { label: "Companies", icon: <BusinessRounded />, path: "/companies" },
  { label: "Financial", icon: <AccountBalanceRounded />, path: "/financial" },
  { label: "Transactions", icon: <ReceiptRounded />, path: "/transactions" },
  { label: "Subscriptions", icon: <SubscriptionsRounded />, path: "/subscriptions" },
  { label: "Tickets", icon: <ConfirmationNumberRounded />, path: "/tickets" },
  { label: "Admin Management", icon: <AdminPanelSettingsRounded />, path: "/admin-management" },
  { label: "Warnings", icon: <WarningAmberRounded />, path: "/warnings" },
  { label: "Settings", icon: <SettingsRounded />, path: "/settings" },
  { label: "Notifications", icon: <NotificationsRounded />, path: "/notifications" },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "grey.200",
          backgroundColor: "grey.50",
        },
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RequestQuoteRounded sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            RFQ Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Management Portal
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        <List disablePadding sx={{ px: 1.5 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 0.75,
                    px: 1.5,
                    minHeight: 42,
                    ...(isActive && {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.12),
                      },
                    }),
                    ...(!isActive && {
                      color: "text.secondary",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.action.hover, 0.04),
                        color: "text.primary",
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? "primary.main" : "text.disabled",
                    }}
                  >
                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
