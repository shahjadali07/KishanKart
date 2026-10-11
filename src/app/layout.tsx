import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KisanKart Farmer Dashboard",
  description: "Direct market access for farmers",
};

import { AuthProvider } from "@/context/AuthContext";
import { MarketTicker } from "@/components/farmer/MarketTicker";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <MarketTicker />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
