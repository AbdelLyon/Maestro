import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Providers from "@/providers/Providers";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@maestro/ui";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Batisseur IA",
    template: "%s | Batisseur IA",
  },

  description:
    "Plateforme intelligente de gestion d'entreprise : devis, factures et automatisation BTP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground"
      >
        <Providers>
          <AppSidebar variant="inset" />

          <SidebarInset>
            <SiteHeader />

            <main className="flex-1">{children}</main>
          </SidebarInset>
        </Providers>
      </body>
    </html>
  );
}
