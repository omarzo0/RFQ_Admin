import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/shared/providers/ThemeRegistry";
import ToastProvider from "@/shared/providers/ToastProvider";

export const metadata: Metadata = {
  title: "RFQ Admin Portal",
  description: "Admin portal for managing the RFQ system",
};

import AuthProvider from "@/shared/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeRegistry>
            {children}
            <ToastProvider />
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
