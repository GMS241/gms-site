import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";
import { MaintenanceOverlay } from "@/components/MaintenanceOverlay";
import { CONFIG } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gabon Management Service",
  description: "Agence immobilière de référence à Libreville. Vente, location et gestion de biens de prestige.",
  verification: {
    google: "R2A1qLNUH3g5H78kFj4FbhUSG9BXy1U1qWKM5a4Prww",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen font-sans`}
        suppressHydrationWarning
      >
        {CONFIG.maintenanceMode && <MaintenanceOverlay />}
        {children}
        {!CONFIG.maintenanceMode && <ChatWidget />}
      </body>
    </html>
  );
}
