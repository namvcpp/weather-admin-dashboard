import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
// Import custom heatmap enhancements
import "@/heatmap-pulse.css";

export const metadata: Metadata = {
  title: "Rainfall & Weather Dashboard",
  description: "Admin dashboard for rainfall and weather data visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}