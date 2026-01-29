/**
 * VANGUARD APP STRUCTURE
 * 
 * PUBLIC ROUTES (no sidebar):
 * / - Landing page with hero and features
 * /auth/login - Login page
 * /auth/signup - Signup page
 * 
 * PROTECTED ROUTES (with sidebar):
 * /dashboard - Main dashboard with metrics
 * /dashboard/* - All dashboard pages
 * 
 * LAYOUT STRUCTURE:
 * src/app/layout.tsx - Root layout (minimal, no sidebar)
 * src/app/dashboard/layout.tsx - Dashboard layout (includes sidebar)
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Vanguard",
  description: "Educational Progress & Engagement System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
