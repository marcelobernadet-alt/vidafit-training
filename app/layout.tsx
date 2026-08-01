import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });

export const metadata: Metadata = {
  title: "VIDAFIT TRAINING",
  description: "Tu entrenamiento del día, siempre a mano.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VidaFit",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${interTight.variable}`}>
      <body className="min-h-screen bg-base font-sans">{children}</body>
    </html>
  );
}
