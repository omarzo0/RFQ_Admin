"use client";

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  alpha,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  LoginRounded,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/shared/store/authStore";
import { adminLogin } from "@/features/auth/api/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { isAuthenticated, setCredentials } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await adminLogin(data);
      const result = response.data;

      if (result.success) {
        setCredentials(
          result.data.admin,
          result.data.tokens.accessToken,
          result.data.tokens.refreshToken
        );
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong. Please try again.";

      const isAxiosError = (
        err: unknown
      ): err is {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
        code?: string;
      } => typeof err === "object" && err !== null;

      if (isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          errorMessage = "Unable to connect to server.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.85)} 50%, ${theme.palette.secondary.dark} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "none",
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Logo / Brand */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <LoginRounded sx={{ fontSize: 32, color: "white" }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color="white"
            letterSpacing="-0.02em"
          >
            RFQ Admin
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}
          >
            Sign in to your account
          </Typography>
        </Box>

        {/* Form Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined
                            sx={{ fontSize: 20, color: "text.disabled" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2.5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "grey.50",
                        "&:hover": { backgroundColor: "grey.100" },
                        "&.Mui-focused": { backgroundColor: "white" },
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{ fontSize: 20, color: "text.disabled" }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{ color: "text.disabled" }}
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "grey.50",
                        "&:hover": { backgroundColor: "grey.100" },
                        "&.Mui-focused": { backgroundColor: "white" },
                      },
                    }}
                  />
                )}
              />

              <Box sx={{ textAlign: "right", mb: 3 }}>
                <Link
                  component={NextLink}
                  href="/forgot-password"
                  variant="body2"
                  underline="hover"
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                disableElevation
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  textTransform: "none",
                  letterSpacing: "0.01em",
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  "&:hover": {
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 3,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          © {new Date().getFullYear()} RFQ Admin. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginForm;
